import logging

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from . import turnstile
from .models import Enquiry
from .serializers import EnquirySerializer
from .tasks import notify_enquiry

log = logging.getLogger(__name__)


class EnquiryView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "enquiry"

    def post(self, request):
        serializer = EnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if turnstile.enabled():
            token = str(request.data.get("turnstile_token") or "")
            if not token:
                return Response(
                    {"turnstile": ["Please complete the security check."]}, status=status.HTTP_400_BAD_REQUEST
                )
            forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
            ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR", "")
            try:
                human = turnstile.verify(token, ip)
            except turnstile.TurnstileUnavailable:
                return Response(
                    {"detail": "The security check is unavailable. Please try WhatsApp or email instead."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
            if not human:
                return Response(
                    {"turnstile": ["The security check failed. Please try again."]}, status=status.HTTP_400_BAD_REQUEST
                )
        enquiry = Enquiry.objects.create(
            name=data["name"], email=data["email"], phone=data["phone"], topic=data["topic"], message=data["message"]
        )

        def queue():
            try:
                notify_enquiry.delay(enquiry.pk)
            except Exception:  # a broker outage must not lose a saved enquiry
                log.exception("Could not queue the enquiry notification.")

        transaction.on_commit(queue)
        return Response({"status": "received"}, status=status.HTTP_201_CREATED)
