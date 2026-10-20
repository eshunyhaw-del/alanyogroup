from rest_framework import serializers

from apps.orders.serializers import clean_text, normalise_phone

from .models import Enquiry


class EnquirySerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=120)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=30, allow_blank=True, required=False, default="")
    topic = serializers.ChoiceField(choices=Enquiry.Topic.choices, default=Enquiry.Topic.GENERAL)
    message = serializers.CharField(min_length=10, max_length=2000)
    # Honeypot: hidden from people, filled in by simple bots.
    website = serializers.CharField(allow_blank=True, required=False, default="", max_length=200)

    def validate_name(self, value):
        return clean_text(value)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        return normalise_phone(value) if value.strip() else ""

    def validate_message(self, value):
        # Keep line breaks in a message, but refuse control characters.
        from apps.orders.serializers import CONTROL_CHARS

        if CONTROL_CHARS.search(value):
            raise serializers.ValidationError("Contains characters that are not allowed.")
        return value.strip()

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Rejected.")
        return value
