import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMessage
from django.db import transaction
from django.utils import timezone

from .models import Enquiry

log = logging.getLogger(__name__)


@shared_task
def notify_enquiry(enquiry_id: int) -> None:
    """Email the enquiry to staff, once. The visitor is never emailed, so the form cannot be used to spam others."""
    with transaction.atomic():
        try:
            enquiry = Enquiry.objects.select_for_update().get(pk=enquiry_id)
        except Enquiry.DoesNotExist:
            return
        if enquiry.notified_at:
            return
        enquiry.notified_at = timezone.now()
        enquiry.save(update_fields=["notified_at"])

    body = (
        f"New website enquiry ({enquiry.get_topic_display()})\n\n"
        f"Name: {enquiry.name}\nEmail: {enquiry.email}\nPhone: {enquiry.phone or 'not given'}\n\n{enquiry.message}\n"
    )
    try:
        EmailMessage(
            subject=f"Website enquiry: {enquiry.get_topic_display()} from {enquiry.name}",
            body=body,
            to=settings.ENQUIRY_EMAILS,
            reply_to=[enquiry.email],  # staff can answer straight from their inbox
        ).send()
    except Exception:
        Enquiry.objects.filter(pk=enquiry_id).update(notified_at=None)
        log.exception("Enquiry email failed for enquiry %s", enquiry_id)
