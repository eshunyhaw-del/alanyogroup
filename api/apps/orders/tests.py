import hashlib
import hmac
import json
import uuid
from unittest import mock

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.catalog.models import Product
from apps.payments import paystack
from apps.payments.models import Payment, WebhookEvent

from .models import Order

SECRET = "sk_test_unit_test_secret"


def paystack_data(order, **overrides):
    data = {
        "id": 987654,
        "status": "success",
        "reference": order.reference,
        "amount": order.total_pesewas,
        "currency": "GHS",
        "channel": "card",
        "gateway_response": "Successful",
    }
    data.update(overrides)
    return data


def sign(body: bytes) -> str:
    return hmac.new(SECRET.encode(), body, hashlib.sha512).hexdigest()


@override_settings(PAYSTACK_SECRET_KEY=SECRET, ORDER_NOTIFY_EMAILS=["staff@example.com"], PAYSTACK_WEBHOOK_IPS=[])
class CheckoutTests(TestCase):
    def setUp(self):
        cache.clear()  # throttle counters
        self.api = APIClient()
        self.vanity = Product.objects.create(
            external_id=1, slug="vanity-set", name="Vanity Set", sku="YN-1", category_slug="vanity-cabinets",
            price_pesewas=550000, in_stock=True,
        )
        self.sink = Product.objects.create(
            external_id=2, slug="steel-sink", name="Steel Sink", category_slug="kitchen",
            price_pesewas=245000, in_stock=True,
        )
        self.sold_out = Product.objects.create(
            external_id=3, slug="sold-out", name="Sold Out", category_slug="kitchen",
            price_pesewas=100000, in_stock=False,
        )
        self.unpriced = Product.objects.create(
            external_id=4, slug="no-price", name="No Price", category_slug="kitchen", price_pesewas=None,
        )

    def payload(self, **overrides):
        body = {
            "items": [{"slug": "vanity-set", "quantity": 2}, {"slug": "steel-sink", "quantity": 1}],
            "name": "Ama Mensah",
            "email": "Ama@Example.com",
            "phone": "053 197 8362",
            "address": "12 Palm Street, Weija",
            "city": "Accra",
            "region": "Greater Accra",
            "notes": "",
            "consent": True,
        }
        body.update(overrides)
        return body

    def checkout(self, body=None, key=None):
        headers = {"HTTP_IDEMPOTENCY_KEY": key} if key else {}
        with mock.patch.object(
            paystack, "initialize_transaction",
            return_value={"authorization_url": "https://checkout.paystack.com/abc123", "access_code": "abc123"},
        ) as init:
            response = self.api.post("/api/v1/checkout", body or self.payload(), format="json", **headers)
        return response, init

    # --- pricing and validation -------------------------------------------------------------------

    def test_total_comes_from_the_server_catalogue_never_the_browser(self):
        body = self.payload()
        body["items"][0]["price"] = 1  # a tampered price field is simply not part of the contract
        body["total"] = 1
        response, init = self.checkout(body)
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(reference=response.data["reference"])
        self.assertEqual(order.total_pesewas, 2 * 550000 + 245000)
        self.assertEqual(init.call_args.kwargs["amount_pesewas"], 2 * 550000 + 245000)
        self.assertEqual(response.data["authorization_url"], "https://checkout.paystack.com/abc123")

    def test_unavailable_products_cannot_be_bought(self):
        for slug in ("sold-out", "no-price", "does-not-exist"):
            cache.clear()
            response, init = self.checkout(self.payload(items=[{"slug": slug, "quantity": 1}]))
            self.assertEqual(response.status_code, 409, slug)
            init.assert_not_called()
        self.assertEqual(Order.objects.count(), 0)

    def test_invalid_input_is_rejected(self):
        bad = [
            self.payload(phone="12345"),
            self.payload(email="not-an-email"),
            self.payload(consent=False),
            self.payload(website="http://spam.example"),  # honeypot
            self.payload(items=[]),
            self.payload(items=[{"slug": "vanity-set", "quantity": 0}]),
            self.payload(items=[{"slug": "vanity-set", "quantity": 21}]),
            self.payload(name="A\x00B"),
        ]
        for body in bad:
            cache.clear()
            response, init = self.checkout(body)
            self.assertEqual(response.status_code, 400, body)
            init.assert_not_called()

    def test_phone_and_email_are_normalised(self):
        response, _ = self.checkout()
        order = Order.objects.get(reference=response.data["reference"])
        self.assertEqual(order.phone, "+233531978362")
        self.assertEqual(order.email, "ama@example.com")

    def test_snapshot_of_prices_survives_catalogue_changes(self):
        response, _ = self.checkout()
        order = Order.objects.get(reference=response.data["reference"])
        self.vanity.price_pesewas = 1
        self.vanity.save()
        self.assertEqual(order.items.get(product_name="Vanity Set").unit_price_pesewas, 550000)

    # --- idempotency and failure ------------------------------------------------------------------

    def test_same_idempotency_key_returns_the_same_order(self):
        key = str(uuid.uuid4())
        first, _ = self.checkout(key=key)
        second, init2 = self.checkout(key=key)
        self.assertEqual(first.data["reference"], second.data["reference"])
        self.assertEqual(Order.objects.count(), 1)
        init2.assert_not_called()

    def test_failure_to_reach_paystack_fails_the_order_cleanly(self):
        with mock.patch.object(paystack, "initialize_transaction", side_effect=paystack.PaystackError("down")):
            response = self.api.post("/api/v1/checkout", self.payload(), format="json")
        self.assertEqual(response.status_code, 502)
        self.assertEqual(Order.objects.get().status, Order.Status.FAILED)
        self.assertNotIn("down", json.dumps(response.data))  # no internals leak to the browser

    def test_checkout_is_rate_limited(self):
        codes = []
        for _ in range(12):
            response, _ = self.checkout(self.payload(items=[{"slug": "vanity-set", "quantity": 1}]))
            codes.append(response.status_code)
        self.assertIn(429, codes)

    # --- webhook ---------------------------------------------------------------------------------

    def make_order(self):
        response, _ = self.checkout()
        return Order.objects.get(reference=response.data["reference"])

    def send_webhook(self, order, data=None, event="charge.success", signature=None):
        body = json.dumps({"event": event, "data": data or paystack_data(order)}).encode()
        return self.api.post(
            "/api/v1/paystack/webhook", body, content_type="application/json",
            HTTP_X_PAYSTACK_SIGNATURE=signature if signature is not None else sign(body),
        )

    def test_webhook_with_bad_or_missing_signature_is_rejected(self):
        order = self.make_order()
        for sig in ("", "deadbeef", sign(b"something else")):
            response = self.send_webhook(order, signature=sig)
            self.assertEqual(response.status_code, 401)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PENDING)
        self.assertEqual(WebhookEvent.objects.count(), 0)

    def test_valid_webhook_marks_the_order_paid_once_and_replays_change_nothing(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order)):
            with self.captureOnCommitCallbacks(execute=True):
                first = self.send_webhook(order)
            replay = self.send_webhook(order)  # Paystack retries
        self.assertEqual((first.status_code, replay.status_code), (200, 200))
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PAID)
        self.assertIsNotNone(order.paid_at)
        self.assertEqual(order.payment.status, Payment.Status.SUCCESS)
        self.assertEqual(WebhookEvent.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)  # one receipt to the customer, one alert to staff, never repeated

    def test_forged_success_event_is_not_trusted_when_paystack_disagrees(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order, status="abandoned")):
            self.send_webhook(order)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PENDING)

    def test_amount_mismatch_sends_the_order_to_review_not_paid(self):
        order = self.make_order()
        short = paystack_data(order, amount=order.total_pesewas - 100)
        with mock.patch.object(paystack, "verify_transaction", return_value=short):
            self.send_webhook(order, data=short)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.REVIEW)
        self.assertEqual(order.payment.status, Payment.Status.MISMATCH)
        self.assertEqual(len(mail.outbox), 0)

    def test_wrong_currency_is_a_mismatch(self):
        order = self.make_order()
        usd = paystack_data(order, currency="USD")
        with mock.patch.object(paystack, "verify_transaction", return_value=usd):
            self.send_webhook(order, data=usd)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.REVIEW)

    def test_webhook_for_unknown_reference_changes_nothing(self):
        order = self.make_order()
        ghost = paystack_data(order, reference="ALY-DOESNOTEXIST")
        with mock.patch.object(paystack, "verify_transaction", return_value=ghost):
            response = self.send_webhook(order, data=ghost)
        self.assertEqual(response.status_code, 200)
        order.refresh_from_db()
        self.assertEqual(order.status, Order.Status.PENDING)

    def test_webhook_asks_paystack_to_retry_when_verification_is_unavailable(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", side_effect=paystack.PaystackError("down")):
            response = self.send_webhook(order)
        self.assertEqual(response.status_code, 503)
        self.assertEqual(WebhookEvent.objects.count(), 0)  # so the retry is processed, not mistaken for a replay

    @override_settings(PAYSTACK_WEBHOOK_IPS=["52.31.139.75"])
    def test_optional_ip_allowlist(self):
        order = self.make_order()
        response = self.send_webhook(order)
        self.assertEqual(response.status_code, 403)

    # --- verify on return from Paystack ----------------------------------------------------------

    def test_return_from_paystack_is_verified_server_side(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order)):
            with self.captureOnCommitCallbacks(execute=True):
                response = self.api.post(f"/api/v1/orders/{order.reference}/verify")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "paid")

    def test_abandoned_payment_stays_pending(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order, status="abandoned")):
            response = self.api.post(f"/api/v1/orders/{order.reference}/verify")
        self.assertEqual(response.data["status"], "pending")

    def test_failed_payment_is_recorded_as_failed(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order, status="failed")):
            response = self.api.post(f"/api/v1/orders/{order.reference}/verify")
        self.assertEqual(response.data["status"], "failed")

    def test_paystack_outage_on_return_is_reported_honestly(self):
        order = self.make_order()
        with mock.patch.object(paystack, "verify_transaction", side_effect=paystack.PaystackError("down")):
            response = self.api.post(f"/api/v1/orders/{order.reference}/verify")
        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.data["status"], "pending")

    def test_order_status_exposes_no_personal_data(self):
        order = self.make_order()
        text = json.dumps(self.api.get(f"/api/v1/orders/{order.reference}").data)
        for private in ("Ama", "example.com", "0531978362", "Palm Street", "233"):
            self.assertNotIn(private, text)

    def test_unknown_or_malformed_references_are_404(self):
        for ref in ("ALY-" + "0" * 24, "ALY-short", "../etc/passwd"):
            self.assertEqual(self.api.get(f"/api/v1/orders/{ref}").status_code, 404)

    def test_unsafe_methods_are_refused(self):
        order = self.make_order()
        self.assertEqual(self.api.get("/api/v1/paystack/webhook").status_code, 405)
        self.assertEqual(self.api.get(f"/api/v1/orders/{order.reference}/verify").status_code, 405)
        self.assertEqual(self.api.get("/api/v1/checkout").status_code, 405)


@override_settings(PAYSTACK_SECRET_KEY=SECRET, ORDER_NOTIFY_EMAILS=["staff@example.com"])
class PickupTests(TestCase):
    def setUp(self):
        cache.clear()
        self.api = APIClient()
        Product.objects.create(
            external_id=1, slug="vanity-set", name="Vanity Set", sku="YN-1", category_slug="vanity-cabinets",
            price_pesewas=550000, in_stock=True,
        )

    def body(self, **overrides):
        data = {
            "items": [{"slug": "vanity-set", "quantity": 1}],
            "name": "Ama Mensah",
            "email": "ama@example.com",
            "phone": "053 197 8362",
            "fulfilment": "pickup",
            "pickup_showroom": "weija",
            "consent": True,
        }
        data.update(overrides)
        return data

    def checkout(self, **overrides):
        with mock.patch.object(
            paystack, "initialize_transaction",
            return_value={"authorization_url": "https://checkout.paystack.com/abc123"},
        ):
            return self.api.post("/api/v1/checkout", self.body(**overrides), format="json")

    def pay(self, order):
        with mock.patch.object(paystack, "verify_transaction", return_value=paystack_data(order)):
            with self.captureOnCommitCallbacks(execute=True):
                self.api.post(f"/api/v1/orders/{order.reference}/verify")

    def test_pickup_needs_no_address_and_records_the_showroom(self):
        response = self.checkout()
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(reference=response.data["reference"])
        self.assertEqual(order.fulfilment, "pickup")
        self.assertEqual(order.pickup_showroom, "weija")
        self.assertEqual((order.address, order.city, order.region), ("", "", ""))
        self.assertEqual(order.total_pesewas, 550000)  # pickup is free: nothing added

    def test_pickup_must_name_a_valid_showroom(self):
        for room in ("", "kumasi"):
            cache.clear()
            self.assertEqual(self.checkout(pickup_showroom=room).status_code, 400, room)
        self.assertEqual(Order.objects.count(), 0)

    def test_delivery_still_requires_an_address(self):
        response = self.checkout(fulfilment="delivery", pickup_showroom="")
        self.assertEqual(response.status_code, 400)
        self.assertIn("address", response.data)
        ok = self.checkout(
            fulfilment="delivery", pickup_showroom="weija", address="12 Palm Street", city="Accra", region="Greater Accra"
        )
        cache.clear()
        order = Order.objects.get()
        self.assertEqual((ok.status_code, order.pickup_showroom), (201, ""))  # showroom ignored for delivery

    def test_pickup_ignores_any_address_sent(self):
        response = self.checkout(address="Somewhere", city="Accra", region="Greater Accra")
        order = Order.objects.get(reference=response.data["reference"])
        self.assertEqual(order.address, "")

    def test_every_order_gets_a_short_unique_code_in_a_readable_alphabet(self):
        codes = set()
        for _ in range(6):
            cache.clear()
            response = self.checkout()
            codes.add(Order.objects.get(reference=response.data["reference"]).code)
        self.assertEqual(len(codes), 6)
        for code in codes:
            self.assertRegex(code, r"^[2-9A-HJ-NP-Z]{6}$")  # no 0, 1, I or O

    def test_status_exposes_code_and_showroom_but_no_personal_data(self):
        order = Order.objects.get(reference=self.checkout().data["reference"])
        data = self.api.get(f"/api/v1/orders/{order.reference}").data
        self.assertEqual((data["code"], data["fulfilment"], data["pickup_showroom"]), (order.code, "pickup", "weija"))
        text = json.dumps(data)
        for private in ("Ama", "example.com", "0531978362"):
            self.assertNotIn(private, text)

    def test_paid_pickup_emails_tell_customer_and_showroom_what_to_do(self):
        order = Order.objects.get(reference=self.checkout(pickup_showroom="east-legon").data["reference"])
        self.pay(order)
        customer, staff = mail.outbox
        spaced = f"{order.code[:3]} {order.code[3:]}"
        self.assertIn(spaced, customer.body)
        self.assertIn("East Legon", customer.body)
        self.assertIn("ID", customer.body)
        self.assertIn("free", customer.body.lower())
        self.assertTrue(staff.subject.startswith("[PICKUP]"))
        self.assertIn("East Legon", staff.body)

    def test_paid_delivery_email_asks_for_the_code_on_whatsapp(self):
        response = self.checkout(
            fulfilment="delivery", pickup_showroom="", address="12 Palm Street", city="Accra", region="Greater Accra"
        )
        order = Order.objects.get(reference=response.data["reference"])
        self.pay(order)
        customer, staff = mail.outbox
        self.assertIn("WhatsApp", customer.body)
        self.assertIn(f"{order.code[:3]} {order.code[3:]}", customer.body)
        self.assertTrue(staff.subject.startswith("[DELIVERY]"))


class PickupAdminTests(TestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model

        get_user_model().objects.create_superuser("staff", "staff@example.com", "a-long-test-password-123")
        self.client.login(username="staff", password="a-long-test-password-123")

    def make(self, status, fulfilment):
        return Order.objects.create(
            status=status, fulfilment=fulfilment, pickup_showroom="weija" if fulfilment == "pickup" else "",
            customer_name="Ama", email="a@example.com", phone="+233531978362",
            subtotal_pesewas=100, total_pesewas=100, consented_at="2026-10-20T10:00:00Z",
        )

    def test_only_paid_pickup_orders_can_be_marked_collected_and_only_once(self):
        paid_pickup = self.make("paid", "pickup")
        unpaid_pickup = self.make("pending", "pickup")
        paid_delivery = self.make("paid", "delivery")
        ids = [paid_pickup.pk, unpaid_pickup.pk, paid_delivery.pk]
        self.client.post("/admin/orders/order/", {"action": "mark_collected", "_selected_action": ids})
        for o in (paid_pickup, unpaid_pickup, paid_delivery):
            o.refresh_from_db()
        self.assertIsNotNone(paid_pickup.collected_at)
        self.assertIsNone(unpaid_pickup.collected_at)
        self.assertIsNone(paid_delivery.collected_at)
        first = paid_pickup.collected_at
        self.client.post("/admin/orders/order/", {"action": "mark_collected", "_selected_action": ids})
        paid_pickup.refresh_from_db()
        self.assertEqual(paid_pickup.collected_at, first)  # a code cannot be used a second time

    def test_staff_can_find_an_order_by_its_code_with_spaces_and_lowercase(self):
        order = self.make("paid", "pickup")
        typed = f"{order.code[:3]} {order.code[3:]}".lower()
        response = self.client.get("/admin/orders/order/", {"q": typed})
        self.assertContains(response, order.customer_name)
