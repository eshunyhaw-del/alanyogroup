from django.contrib import admin, messages
from django.utils import timezone

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
    list_display = (
        "code_display",
        "status",
        "fulfilment",
        "pickup_showroom",
        "customer_name",
        "phone",
        "total_ghs",
        "collected",
        "created_at",
    )
    list_filter = ("status", "fulfilment", "pickup_showroom", "created_at")
    # Staff at a showroom type the customer's code (spaces and case are ignored) to find the order.
    search_fields = ("code", "reference", "customer_name", "email", "phone")
    date_hierarchy = "created_at"
    inlines = [OrderItemInline]
    actions = ["mark_collected"]
    # Money and identity fields are history. Staff change only the status (for example after a manual review).
    readonly_fields = tuple(f.name for f in Order._meta.fields if f.name not in ("status",))

    def get_search_results(self, request, queryset, search_term):
        return super().get_search_results(request, queryset, search_term.replace(" ", "").upper() if len(search_term.replace(" ", "")) == 6 else search_term)

    @admin.display(description="Code", ordering="code")
    def code_display(self, obj: Order):
        return f"{obj.code[:3]} {obj.code[3:]}"

    @admin.display(description="Total (GHS)", ordering="total_pesewas")
    def total_ghs(self, obj: Order):
        return f"{obj.total_pesewas / 100:,.2f}"

    @admin.display(description="Collected", boolean=True, ordering="collected_at")
    def collected(self, obj: Order):
        return bool(obj.collected_at) if obj.fulfilment == Order.Fulfilment.PICKUP else None

    @admin.action(description="Mark selected paid pickup orders as collected")
    def mark_collected(self, request, queryset):
        eligible = queryset.filter(
            status=Order.Status.PAID, fulfilment=Order.Fulfilment.PICKUP, collected_at__isnull=True
        )
        count = eligible.update(collected_at=timezone.now())
        skipped = queryset.count() - count
        self.message_user(request, f"{count} order(s) marked as collected.", messages.SUCCESS)
        if skipped:
            self.message_user(
                request,
                f"{skipped} skipped: only paid pickup orders that have not already been collected can be marked.",
                messages.WARNING,
            )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
