from django.conf import settings
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, re_path

from apps.enquiries.views import EnquiryView
from apps.orders.views import CheckoutView, OrderStatusView, OrderVerifyView
from apps.payments.views import paystack_webhook

ORDER_REF = r"(?P<reference>ALY-[0-9A-F]{24})"


def health(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path("api/v1/health", health),
    path("api/v1/checkout", CheckoutView.as_view()),
    path("api/v1/enquiries", EnquiryView.as_view()),
    re_path(rf"^api/v1/orders/{ORDER_REF}$", OrderStatusView.as_view()),
    re_path(rf"^api/v1/orders/{ORDER_REF}/verify$", OrderVerifyView.as_view()),
    path("api/v1/paystack/webhook", paystack_webhook),
]
