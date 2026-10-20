from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "category_slug", "price_ghs", "in_stock", "active")
    list_filter = ("category_slug", "in_stock", "active")
    search_fields = ("name", "sku", "slug")
    list_editable = ("in_stock", "active")

    @admin.display(description="Price (GHS)", ordering="price_pesewas")
    def price_ghs(self, obj: Product):
        return "—" if obj.price_pesewas is None else f"{obj.price_pesewas / 100:,.2f}"
