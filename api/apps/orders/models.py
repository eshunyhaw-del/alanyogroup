import secrets

from django.db import models

from apps.catalog.models import Product


def new_reference() -> str:
    """Unguessable, URL-safe, unique order reference. Also used as the Paystack transaction reference."""
    return "ALY-" + secrets.token_hex(12).upper()


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Awaiting payment"
        PAID = "paid", "Paid"
        FAILED = "failed", "Payment failed"
        REVIEW = "review", "Needs review"  # money moved but did not match the order; a person must check

    reference = models.CharField(max_length=40, unique=True, default=new_reference, editable=False)
    # Sent by the browser so a double-click or retry returns the same order instead of creating a second one.
    idempotency_key = models.CharField(max_length=64, unique=True, null=True, blank=True, editable=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING, db_index=True)

    customer_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    notes = models.CharField(max_length=500, blank=True)

    currency = models.CharField(max_length=3, default="GHS")
    subtotal_pesewas = models.PositiveIntegerField()
    # Delivery is arranged with the customer by our team (see the Shipping Policy), so it is not charged online.
    delivery_fee_pesewas = models.PositiveIntegerField(default=0)
    total_pesewas = models.PositiveIntegerField()

    consented_at = models.DateTimeField(help_text="When the customer accepted the privacy and shipping policies.")
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    notified_at = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.reference


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    # Snapshot at the time of purchase, so later catalogue edits never rewrite history.
    product_name = models.CharField(max_length=300)
    sku = models.CharField(max_length=80, blank=True)
    unit_price_pesewas = models.PositiveIntegerField()
    quantity = models.PositiveSmallIntegerField()

    @property
    def line_total_pesewas(self) -> int:
        return self.unit_price_pesewas * self.quantity

    def __str__(self) -> str:
        return f"{self.quantity} × {self.product_name}"
