from django.contrib import admin

from .models import Enquiry


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "topic", "email", "phone", "created_at")
    list_filter = ("topic", "created_at")
    search_fields = ("name", "email", "phone", "message")
    readonly_fields = [f.name for f in Enquiry._meta.fields]

    def has_add_permission(self, request):
        return False
