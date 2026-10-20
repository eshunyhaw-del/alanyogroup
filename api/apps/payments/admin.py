from django.contrib import admin

from .models import Payment, WebhookEvent


class ReadOnlyAdmin(admin.ModelAdmin):
    """Payment records are an audit trail: view only."""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Payment)
class PaymentAdmin(ReadOnlyAdmin):
    list_display = ("reference", "status", "amount_pesewas", "currency", "channel", "paid_at")
    list_filter = ("status", "channel")
    search_fields = ("reference", "paystack_transaction_id")


@admin.register(WebhookEvent)
class WebhookEventAdmin(ReadOnlyAdmin):
    list_display = ("event_type", "reference", "outcome", "received_at")
    list_filter = ("event_type", "outcome")
