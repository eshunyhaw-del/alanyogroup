"""Server-side check of a Cloudflare Turnstile token, the privacy-friendly "are you human" widget."""

import requests
from django.conf import settings

VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


class TurnstileUnavailable(Exception):
    """Cloudflare could not be reached, so the check could not be completed."""


def enabled() -> bool:
    return bool(settings.TURNSTILE_SECRET_KEY)


def verify(token: str, remote_ip: str = "") -> bool:
    data = {"secret": settings.TURNSTILE_SECRET_KEY, "response": token}
    if remote_ip:
        data["remoteip"] = remote_ip
    try:
        body = requests.post(VERIFY_URL, data=data, timeout=5).json()
    except (requests.RequestException, ValueError) as exc:
        raise TurnstileUnavailable from exc
    return body.get("success") is True
