from django.db import models

from apps.orders.models import Order


class Payment(models.Model):
    class Status(models.TextChoices):
        INITIALIZED = "initialized", "Initialised"
        SUCCESS = "success", "Succeeded"
        FAILED = "failed", "Failed"
        MISMATCH = "mismatch", "Amount or currency mismatch"

    order = models.OneToOneField(Order, related_name="payment", on_delete=models.PROTECT)
    # Unique Paystack transaction reference (the same as the order reference).
    reference = models.CharField(max_length=40, unique=True)
    amount_pesewas = models.PositiveIntegerField()
    currency = models.CharField(max_length=3, default="GHS")
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.INITIALIZED, db_index=True)

    authorization_url = models.URLField(max_length=300, blank=True)
    paystack_transaction_id = models.CharField(max_length=40, blank=True)
    channel = models.CharField(max_length=30, blank=True)
    gateway_response = models.CharField(max_length=200, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.reference} ({self.status})"


class WebhookEvent(models.Model):
    """Every authenticated Paystack webhook, stored once. The unique key is what makes retries harmless."""

    event_key = models.CharField(max_length=120, unique=True)
    event_type = models.CharField(max_length=60)
    reference = models.CharField(max_length=60, blank=True, db_index=True)
    outcome = models.CharField(max_length=60, blank=True)
    received_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.event_type} {self.reference}"
