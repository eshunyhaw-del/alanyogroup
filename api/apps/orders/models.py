import secrets

from django.db import models

from apps.catalog.models import Product

# No 0, O, 1 or I, so a code read out over the phone or typed from a screen is hard to get wrong.
CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
CODE_LENGTH = 6


def new_reference() -> str:
    """Unguessable, URL-safe, unique order reference. Also used as the Paystack transaction reference."""
    return "ALY-" + secrets.token_hex(12).upper()


def new_code() -> str:
    """Short code the customer quotes: shown at a showroom for pickup, or sent on WhatsApp for delivery."""
    return "".join(secrets.choice(CODE_ALPHABET) for _ in range(CODE_LENGTH))


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Awaiting payment"
        PAID = "paid", "Paid"
        FAILED = "failed", "Payment failed"
        REVIEW = "review", "Needs review"  # money moved but did not match the order; a person must check

    class Fulfilment(models.TextChoices):
        DELIVERY = "delivery", "Delivery"
        PICKUP = "pickup", "Showroom pickup"

    class Showroom(models.TextChoices):
        WEIJA = "weija", "Weija showroom"
        EAST_LEGON = "east-legon", "East Legon showroom"

    reference = models.CharField(max_length=40, unique=True, default=new_reference, editable=False)
    # The short code the customer quotes. Assigned on first save, never reused.
    code = models.CharField(max_length=8, unique=True, editable=False)
    # Sent by the browser so a double-click or retry returns the same order instead of creating a second one.
    idempotency_key = models.CharField(max_length=64, unique=True, null=True, blank=True, editable=False)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING, db_index=True)

    fulfilment = models.CharField(max_length=10, choices=Fulfilment.choices, default=Fulfilment.DELIVERY, db_index=True)
    pickup_showroom = models.CharField(max_length=12, choices=Showroom.choices, blank=True, db_index=True)
    collected_at = models.DateTimeField(null=True, blank=True, help_text="When the customer collected a pickup order.")

    customer_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    # Not needed for showroom pickup.
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    notes = models.CharField(max_length=500, blank=True)

    currency = models.CharField(max_length=3, default="GHS")
    subtotal_pesewas = models.PositiveIntegerField()
    # Delivery is arranged with the customer by our team (see the Shipping Policy), and pickup is free,
    # so nothing beyond the subtotal is charged online.
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

    def save(self, *args, **kwargs):
        if not self.code:
            code = new_code()
            while Order.objects.filter(code=code).exists():
                code = new_code()
            self.code = code
        super().save(*args, **kwargs)


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
