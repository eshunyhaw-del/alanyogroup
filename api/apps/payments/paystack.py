"""Thin, strict client for the parts of the Paystack API this shop uses."""

import hashlib
import hmac
import logging
from typing import Any

import requests
from django.conf import settings

log = logging.getLogger(__name__)


class PaystackError(Exception):
    """Paystack could not be reached, or refused the request."""


def _headers() -> dict[str, str]:
    if not settings.PAYSTACK_SECRET_KEY:
        raise PaystackError("PAYSTACK_SECRET_KEY is not configured.")
    return {"Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}", "Content-Type": "application/json"}


def _request(method: str, path: str, **kwargs: Any) -> dict[str, Any]:
    try:
        response = requests.request(
            method,
            f"{settings.PAYSTACK_BASE_URL}{path}",
            headers=_headers(),
            timeout=settings.PAYSTACK_TIMEOUT_SECONDS,
            **kwargs,
        )
        body = response.json()
    except (requests.RequestException, ValueError) as exc:
        # Log the failure type only: the request carries the secret key and customer details.
        log.error("Paystack request failed: %s", type(exc).__name__)
        raise PaystackError("Could not reach the payment provider.") from exc
    if not response.ok or not body.get("status"):
        log.error("Paystack refused %s %s: HTTP %s", method, path.split("/")[1], response.status_code)
        raise PaystackError(str(body.get("message", "The payment provider refused the request.")))
    return body["data"]


def initialize_transaction(*, email: str, amount_pesewas: int, reference: str, callback_url: str) -> dict[str, Any]:
    """Start a hosted-checkout transaction. The customer then pays on Paystack's page, never ours."""
    return _request(
        "POST",
        "/transaction/initialize",
        json={
            "email": email,
            "amount": amount_pesewas,
            "currency": settings.PAYSTACK_CURRENCY,
            "reference": reference,
            "callback_url": callback_url,
        },
    )


def verify_transaction(reference: str) -> dict[str, Any]:
    """Ask Paystack directly for the truth about a transaction. Never trust a redirect or browser claim."""
    return _request("GET", f"/transaction/verify/{reference}")


def signature_is_valid(raw_body: bytes, signature: str | None) -> bool:
    """Paystack signs each webhook body with HMAC-SHA512 using the secret key."""
    if not signature or not settings.PAYSTACK_SECRET_KEY:
        return False
    expected = hmac.new(settings.PAYSTACK_SECRET_KEY.encode(), raw_body, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature.strip().lower())
