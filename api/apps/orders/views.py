import logging
import re

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.catalog.models import Product
from apps.payments import paystack
from apps.payments.models import Payment
from apps.payments.services import PENDING, callback_url, settle

from .models import Order, OrderItem
from .serializers import CheckoutSerializer

log = logging.getLogger(__name__)

IDEMPOTENCY_KEY = re.compile(r"^[A-Za-z0-9-]{16,64}$")


def order_payload(order: Order) -> dict:
    """What the storefront may know about an order. Deliberately no name, phone, email or address."""
    return {
        "reference": order.reference,
        "status": order.status,
        "currency": order.currency,
        "total_pesewas": order.total_pesewas,
        "items": [
            {"name": i.product_name, "quantity": i.quantity, "line_total_pesewas": i.line_total_pesewas}
            for i in order.items.all()
        ],
    }


class CheckoutView(APIView):
    """Create an order from product slugs and quantities, then start a Paystack payment for it."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "checkout"

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        key = request.headers.get("Idempotency-Key", "")
        key = key if IDEMPOTENCY_KEY.fullmatch(key) else None
        if key:
            existing = Order.objects.filter(idempotency_key=key).select_related("payment").first()
            if existing:
                return self._respond(existing)

        # Price everything from the server's own catalogue. Prices and stock in the request are ignored.
        products = {p.slug: p for p in Product.objects.filter(slug__in=[i["slug"] for i in data["items"]])}
        problems, lines, subtotal = [], [], 0
        for item in data["items"]:
            product = products.get(item["slug"])
            if product is None or not product.purchasable:
                problems.append(product.name if product else item["slug"])
                continue
            subtotal += product.price_pesewas * item["quantity"]
            lines.append((product, item["quantity"]))
        if problems:
            return Response(
                {"detail": "Some items are no longer available to buy online.", "unavailable": problems},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            with transaction.atomic():
                order = Order.objects.create(
                    idempotency_key=key,
                    customer_name=data["name"],
                    email=data["email"],
                    phone=data["phone"],
                    address=data["address"],
                    city=data["city"],
                    region=data["region"],
                    notes=data["notes"],
                    currency=settings.PAYSTACK_CURRENCY,
                    subtotal_pesewas=subtotal,
                    total_pesewas=subtotal,
                    consented_at=timezone.now(),
                )
                OrderItem.objects.bulk_create(
                    OrderItem(
                        order=order,
                        product=p,
                        product_name=p.name,
                        sku=p.sku,
                        unit_price_pesewas=p.price_pesewas,
                        quantity=q,
                    )
                    for p, q in lines
                )
                Payment.objects.create(
                    order=order,
                    reference=order.reference,
                    amount_pesewas=order.total_pesewas,
                    currency=order.currency,
                )
        except IntegrityError:
            # A parallel request with the same idempotency key won the race: return its order.
            existing = Order.objects.filter(idempotency_key=key).first() if key else None
            if existing:
                return self._respond(existing)
            raise

        try:
            tx = paystack.initialize_transaction(
                email=order.email,
                amount_pesewas=order.total_pesewas,
                reference=order.reference,
                callback_url=callback_url(),
            )
        except paystack.PaystackError:
            order.status = Order.Status.FAILED
            order.save(update_fields=["status"])
            return Response(
                {"detail": "We could not start the payment. Please try again in a moment."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        Payment.objects.filter(order=order).update(
            authorization_url=tx["authorization_url"], channel=""
        )
        order.refresh_from_db()
        return self._respond(order, created=True)

    @staticmethod
    def _respond(order: Order, created: bool = False):
        payment = order.payment
        return Response(
            {
                "reference": order.reference,
                "status": order.status,
                "authorization_url": payment.authorization_url if order.status == Order.Status.PENDING else None,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class OrderStatusView(APIView):
    """Read an order's state by its unguessable reference."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "order_lookup"

    def get(self, request, reference):
        order = Order.objects.filter(reference=reference).prefetch_related("items").first()
        if order is None:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(order_payload(order))


class OrderVerifyView(APIView):
    """The customer has returned from Paystack. Ask Paystack directly what happened. The redirect proves nothing."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "order_lookup"

    def post(self, request, reference):
        order = Order.objects.filter(reference=reference).prefetch_related("items").first()
        if order is None:
            return Response({"detail": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        if order.status == Order.Status.PENDING:
            try:
                outcome = settle(reference, paystack.verify_transaction(reference))
            except paystack.PaystackError:
                return Response(
                    {**order_payload(order), "detail": "We could not confirm the payment yet. Please try again."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            if outcome != PENDING:
                order.refresh_from_db()
        return Response(order_payload(order))
