import json
import logging

from django.conf import settings
from django.db import IntegrityError, transaction
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from . import paystack
from .models import WebhookEvent
from .services import settle

log = logging.getLogger(__name__)

MAX_BODY_BYTES = 128 * 1024


def _client_ip(request) -> str:
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    return forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR", "")


@csrf_exempt  # Paystack cannot send a CSRF token. The HMAC signature below is the authentication.
@require_POST
def paystack_webhook(request):
    raw = request.body
    if len(raw) > MAX_BODY_BYTES:
        return HttpResponse(status=413)

    allowed_ips = settings.PAYSTACK_WEBHOOK_IPS
    if allowed_ips and _client_ip(request) not in allowed_ips:
        return HttpResponseForbidden()

    if not paystack.signature_is_valid(raw, request.headers.get("x-paystack-signature")):
        log.warning("Webhook rejected: bad signature.")
        return HttpResponse(status=401)

    try:
        event = json.loads(raw)
        event_type = event["event"]
        data = event["data"]
        reference = str(data.get("reference", ""))
    except (ValueError, KeyError, AttributeError, TypeError):
        return HttpResponse(status=400)

    # One row per distinct event: Paystack retries, and a replay must change nothing.
    event_key = f"{event_type}:{data.get('id') or reference}"[:120]
    try:
        with transaction.atomic():  # a savepoint, so a duplicate cannot poison any surrounding transaction
            record = WebhookEvent.objects.create(
                event_key=event_key, event_type=event_type[:60], reference=reference[:60]
            )
    except IntegrityError:
        return HttpResponse(status=200)

    outcome = "ignored"
    if event_type == "charge.success" and reference:
        # Re-verify with Paystack rather than trusting the body, so even a leaked key cannot forge a payment alone.
        try:
            outcome = settle(reference, paystack.verify_transaction(reference))
        except paystack.PaystackError:
            record.delete()  # let Paystack's retry try again
            return HttpResponse(status=503)
    record.outcome = outcome[:60]
    record.save(update_fields=["outcome"])
    return HttpResponse(status=200)
