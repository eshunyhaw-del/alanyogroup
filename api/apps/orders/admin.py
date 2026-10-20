from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = ("product", "product_name", "sku", "unit_price_pesewas", "quantity")

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("reference", "status", "customer_name", "phone", "total_ghs", "created_at", "paid_at")
    list_filter = ("status", "created_at")
    search_fields = ("reference", "customer_name", "email", "phone")
    date_hierarchy = "created_at"
    inlines = [OrderItemInline]
    # Money and identity fields are history. Staff change only the status (for example after a manual review).
    readonly_fields = tuple(
        f.name for f in Order._meta.fields if f.name not in ("status",)
    )

    @admin.display(description="Total (GHS)", ordering="total_pesewas")
    def total_ghs(self, obj: Order):
        return f"{obj.total_pesewas / 100:,.2f}"

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
