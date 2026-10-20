import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from .models import Order

log = logging.getLogger(__name__)


def ghs(pesewas: int) -> str:
    return f"GHS {pesewas / 100:,.2f}"


def _lines(order: Order) -> str:
    return "\n".join(
        f"  {i.quantity} × {i.product_name}{f' ({i.sku})' if i.sku else ''}: {ghs(i.line_total_pesewas)}"
        for i in order.items.all()
    )


@shared_task
def notify_order_paid(order_id: int) -> None:
    """Email the customer a receipt and tell staff a paid order is waiting. Sends at most once per order."""
    with transaction.atomic():
        try:
            order = Order.objects.select_for_update().get(pk=order_id, status=Order.Status.PAID)
        except Order.DoesNotExist:
            return
        if order.notified_at:
            return
        order.notified_at = timezone.now()
        order.save(update_fields=["notified_at"])

    customer_body = (
        f"Hello {order.customer_name},\n\n"
        f"Thank you for your order with Alanyo Group. Your payment has been received.\n\n"
        f"Order number: {order.reference}\n{_lines(order)}\n"
        f"Total paid: {ghs(order.total_pesewas)}\n\n"
        "Our customer support team will call you to confirm your delivery address. When your order arrives, "
        "the driver will ask for your name and order number.\n\n"
        "Alanyo Group\nPhone: +233 531 978 362 (8:00 AM to 5:00 PM)\n"
    )
    staff_body = (
        f"New paid order {order.reference}\n\n"
        f"Customer: {order.customer_name}\nPhone: {order.phone}\nEmail: {order.email}\n"
        f"Deliver to: {order.address}, {order.city}, {order.region}\n"
        f"Notes: {order.notes or '—'}\n\n{_lines(order)}\nTotal paid: {ghs(order.total_pesewas)}\n"
    )
    try:
        send_mail(f"Your Alanyo Group order {order.reference}", customer_body, None, [order.email])
        if settings.ORDER_NOTIFY_EMAILS:
            send_mail(f"New paid order {order.reference}", staff_body, None, settings.ORDER_NOTIFY_EMAILS)
    except Exception:
        # Roll the flag back so a later retry can send it; the payment itself is already safely recorded.
        Order.objects.filter(pk=order_id).update(notified_at=None)
        log.exception("Order notification email failed for %s", order.reference)
