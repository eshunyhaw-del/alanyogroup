from django.db import models


class Product(models.Model):
    """A sellable product. The server's price here is the only price a payment is ever based on."""

    external_id = models.PositiveIntegerField(unique=True, help_text="ID in the original WooCommerce store.")
    slug = models.SlugField(max_length=200, unique=True)
    name = models.CharField(max_length=300)
    sku = models.CharField(max_length=80, blank=True)
    category_slug = models.SlugField(max_length=80, db_index=True)
    # 1 GHS = 100 pesewas. Integer money avoids floating-point rounding. Null means no price is set,
    # and such a product cannot be bought online.
    price_pesewas = models.PositiveIntegerField(null=True, blank=True)
    in_stock = models.BooleanField(default=True)
    active = models.BooleanField(default=True, help_text="Untick to hide the product and stop sales.")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category_slug", "name"]

    def __str__(self) -> str:
        return self.name

    @property
    def purchasable(self) -> bool:
        return self.active and self.in_stock and self.price_pesewas is not None and self.price_pesewas > 0
