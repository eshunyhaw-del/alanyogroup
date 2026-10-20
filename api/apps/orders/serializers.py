import re

from rest_framework import serializers

from .models import Order

# Every control character except tab, newline and carriage return, which whitespace handling covers.
CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
E164 = re.compile(r"^\+[1-9]\d{7,14}$")


def clean_text(value: str) -> str:
    """Collapse whitespace and refuse control characters, which have no place in a name or address."""
    if CONTROL_CHARS.search(value):
        raise serializers.ValidationError("Contains characters that are not allowed.")
    return re.sub(r"\s+", " ", value).strip()


def normalise_phone(raw: str) -> str:
    """Accept Ghanaian numbers as 053 197 8362, 0531978362 or +233 53 197 8362; return +233531978362."""
    digits = re.sub(r"[\s\-().]", "", raw)
    if re.fullmatch(r"0\d{9}", digits):
        digits = "+233" + digits[1:]
    elif re.fullmatch(r"233\d{9}", digits):
        digits = "+" + digits
    if not E164.fullmatch(digits):
        raise serializers.ValidationError("Enter a valid phone number, for example 053 197 8362.")
    return digits


class CartItemSerializer(serializers.Serializer):
    # Only which product and how many. The price is never accepted from the browser.
    slug = serializers.SlugField(max_length=200)
    quantity = serializers.IntegerField(min_value=1, max_value=20)


class CheckoutSerializer(serializers.Serializer):
    items = CartItemSerializer(many=True, allow_empty=False, max_length=30)
    name = serializers.CharField(min_length=2, max_length=120)
    email = serializers.EmailField(max_length=254)
    phone = serializers.CharField(max_length=30)
    fulfilment = serializers.ChoiceField(choices=Order.Fulfilment.choices, default=Order.Fulfilment.DELIVERY)
    pickup_showroom = serializers.ChoiceField(choices=Order.Showroom.choices, required=False, allow_blank=True, default="")
    # Required for delivery, ignored for showroom pickup (checked in validate()).
    address = serializers.CharField(max_length=300, required=False, allow_blank=True, default="")
    city = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
    region = serializers.CharField(max_length=100, required=False, allow_blank=True, default="")
    notes = serializers.CharField(max_length=500, allow_blank=True, required=False, default="")
    consent = serializers.BooleanField()
    # Honeypot: hidden from people, filled in by simple bots.
    website = serializers.CharField(allow_blank=True, required=False, default="", max_length=200)

    def validate_name(self, value):
        return clean_text(value)

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        return normalise_phone(value)

    def validate_address(self, value):
        return clean_text(value) if value else ""

    def validate_city(self, value):
        return clean_text(value) if value else ""

    def validate_region(self, value):
        return clean_text(value) if value else ""

    def validate_notes(self, value):
        return clean_text(value) if value else ""

    def validate_consent(self, value):
        if value is not True:
            raise serializers.ValidationError("Please accept the privacy and shipping policies to continue.")
        return value

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Rejected.")
        return value

    def validate(self, data):
        errors = {}
        if data["fulfilment"] == Order.Fulfilment.PICKUP:
            if not data["pickup_showroom"]:
                errors["pickup_showroom"] = "Choose which showroom you will collect from."
            # A pickup order carries no delivery address.
            data["address"] = data["city"] = data["region"] = ""
        else:
            data["pickup_showroom"] = ""
            for field, minimum, message in (
                ("address", 5, "Enter your delivery address."),
                ("city", 2, "Enter your town or city."),
                ("region", 2, "Choose your region."),
            ):
                if len(data[field]) < minimum:
                    errors[field] = message
        if errors:
            raise serializers.ValidationError({k: [v] for k, v in errors.items()})
        return data

    def validate_items(self, value):
        merged: dict[str, int] = {}
        for item in value:
            merged[item["slug"]] = merged.get(item["slug"], 0) + item["quantity"]
        if any(q > 20 for q in merged.values()):
            raise serializers.ValidationError("You can order at most 20 of one product at a time.")
        return [{"slug": s, "quantity": q} for s, q in merged.items()]
