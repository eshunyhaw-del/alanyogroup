import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from .models import Order

log = logging.getLogger(__name__)

WHATSAPP_NUMBER = "+233 531 978 362"

# Showroom details for emails. Hours were supplied by the owner and apply to both showrooms.
SHOWROOMS = {
    Order.Showroom.WEIJA: {"name": "Alanyo Group Weija Showroom", "where": "Gbawe, Weija (plus code HM2F+RCG)"},
    Order.Showroom.EAST_LEGON: {"name": "Alanyo Group East Legon Showroom", "where": "East Legon, Accra (plus code MVMM+X46)"},
}
SHOWROOM_HOURS = "Monday to Saturday, 8:00 AM to 5:00 PM"


def ghs(pesewas: int) -> str:
    return f"GHS {pesewas / 100:,.2f}"


def spaced(code: str) -> str:
    """K7M2QX -> K7M 2QX, easier to read and say aloud."""
    return f"{code[:3]} {code[3:]}"


def _lines(order: Order) -> str:
    return "\n".join(
        f"  {i.quantity} × {i.product_name}{f' ({i.sku})' if i.sku else ''}: {ghs(i.line_total_pesewas)}"
        for i in order.items.all()
    )


def customer_instructions(order: Order) -> str:
    code = spaced(order.code)
    if order.fulfilment == Order.Fulfilment.PICKUP:
        room = SHOWROOMS[order.pickup_showroom]
        return (
            f"Your collection code: {code}\n\n"
            f"Collect your order from the {room['name']}, {room['where']}.\n"
            f"Opening hours: {SHOWROOM_HOURS}.\n"
            "Your order is available now that your payment is confirmed. Pickup is free. "
            "Please bring this code and a valid form of ID.\n"
        )
    return (
        f"Your order code: {code}\n\n"
        f"Please send this code on WhatsApp to {WHATSAPP_NUMBER} so we can match your order quickly. "
        "Our customer support team will also call you to confirm your delivery address. When your order arrives, "
        "the driver will ask for your name and order number.\n"
    )


def staff_destination(order: Order) -> str:
    if order.fulfilment == Order.Fulfilment.PICKUP:
        return f"PICKUP at {SHOWROOMS[order.pickup_showroom]['name']} (customer shows code {spaced(order.code)} and ID)"
    return f"DELIVERY to {order.address}, {order.city}, {order.region}"


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
        "Thank you for your order with Alanyo Group. Your payment has been received.\n\n"
        f"Order number: {order.reference}\n{_lines(order)}\n"
        f"Total paid: {ghs(order.total_pesewas)}\n\n"
        f"{customer_instructions(order)}\n"
        f"Alanyo Group\nPhone: {WHATSAPP_NUMBER} (8:00 AM to 5:00 PM)\n"
    )
    staff_body = (
        f"New paid order {order.reference}\nCode: {spaced(order.code)}\n{staff_destination(order)}\n\n"
        f"Customer: {order.customer_name}\nPhone: {order.phone}\nEmail: {order.email}\n"
        f"Notes: {order.notes or 'none'}\n\n{_lines(order)}\nTotal paid: {ghs(order.total_pesewas)}\n"
    )
    tag = "PICKUP" if order.fulfilment == Order.Fulfilment.PICKUP else "DELIVERY"
    try:
        send_mail(f"Your Alanyo Group order {order.reference}", customer_body, None, [order.email])
        if settings.ORDER_NOTIFY_EMAILS:
            send_mail(f"[{tag}] New paid order {spaced(order.code)}", staff_body, None, settings.ORDER_NOTIFY_EMAILS)
    except Exception:
        # Roll the flag back so a later retry can send it; the payment itself is already safely recorded.
        Order.objects.filter(pk=order_id).update(notified_at=None)
        log.exception("Order notification email failed for %s", order.reference)
