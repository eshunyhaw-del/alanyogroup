"""Deciding when an order counts as paid. Every path (verify call, webhook) goes through settle()."""

import logging
from typing import Any

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from apps.orders.tasks import notify_order_paid

from .models import Payment

log = logging.getLogger(__name__)

PAID = "paid"
ALREADY_PAID = "already_paid"
FAILED = "failed"
PENDING = "pending"
MISMATCH = "mismatch"
UNKNOWN = "unknown"


def settle(reference: str, data: dict[str, Any]) -> str:
    """Apply Paystack's verified transaction data to the order, exactly once.

    The row is locked, so two requests arriving together (the customer's return and the webhook) cannot both
    mark the order paid or both send notifications. Money is only accepted when the reference, status, amount and
    currency all match what this server created, never what the browser claimed.
    """
    with transaction.atomic():
        try:
            payment = Payment.objects.select_for_update().select_related("order").get(reference=reference)
        except Payment.DoesNotExist:
            log.warning("Paystack data for an unknown reference was ignored.")
            return UNKNOWN

        if payment.status == Payment.Status.SUCCESS:
            return ALREADY_PAID

        remote_status = data.get("status")
        if remote_status in ("failed", "reversed"):
            payment.status = Payment.Status.FAILED
            payment.gateway_response = str(data.get("gateway_response", ""))[:200]
            payment.save(update_fields=["status", "gateway_response", "updated_at"])
            if payment.order.status == Order.Status.PENDING:
                payment.order.status = Order.Status.FAILED
                payment.order.save(update_fields=["status"])
            return FAILED

        if remote_status != "success":
            return PENDING  # abandoned, ongoing or queued: the customer may still complete it

        matches = (
            data.get("reference") == payment.reference
            and data.get("amount") == payment.amount_pesewas
            and str(data.get("currency", "")).upper() == payment.currency
        )
        if not matches:
            payment.status = Payment.Status.MISMATCH
            payment.save(update_fields=["status", "updated_at"])
            payment.order.status = Order.Status.REVIEW
            payment.order.save(update_fields=["status"])
            log.error("Payment %s succeeded at Paystack but did not match the order. Manual review needed.", reference)
            return MISMATCH

        now = timezone.now()
        payment.status = Payment.Status.SUCCESS
        payment.paid_at = now
        payment.paystack_transaction_id = str(data.get("id", ""))[:40]
        payment.channel = str(data.get("channel", ""))[:30]
        payment.gateway_response = str(data.get("gateway_response", ""))[:200]
        payment.save()
        order = payment.order
        order.status = Order.Status.PAID
        order.paid_at = now
        order.save(update_fields=["status", "paid_at"])
        transaction.on_commit(lambda: _enqueue_notification(order.pk))
        return PAID


def _enqueue_notification(order_id: int) -> None:
    try:
        notify_order_paid.delay(order_id)
    except Exception:  # a broker outage must never undo a recorded payment
        log.exception("Could not queue the order notification.")


def callback_url() -> str:
    return f"{settings.SITE_URL}/order/confirmation"
