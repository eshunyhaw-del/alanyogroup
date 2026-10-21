from unittest import mock

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Enquiry


@override_settings(ENQUIRY_EMAILS=["sales@alanyogroup.com"])
class EnquiryTests(TestCase):
    def setUp(self):
        cache.clear()
        self.api = APIClient()

    def body(self, **overrides):
        data = {
            "name": "Kofi Boateng",
            "email": "Kofi@Example.com",
            "phone": "+44 7700 900123",
            "topic": "abroad",
            "message": "I am building a house in Kumasi and would like to discuss bathroom fixtures.",
        }
        data.update(overrides)
        return data

    def post(self, **overrides):
        return self.api.post("/api/v1/enquiries", self.body(**overrides), format="json")

    def test_enquiry_is_saved_and_emailed_to_staff_only(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.post()
        self.assertEqual(response.status_code, 201)
        enquiry = Enquiry.objects.get()
        self.assertEqual(enquiry.email, "kofi@example.com")
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.to, ["sales@alanyogroup.com"])  # never the visitor's address
        self.assertEqual(message.reply_to, ["kofi@example.com"])
        self.assertIn("Kumasi", message.body)

    def test_invalid_input_and_honeypot_are_rejected(self):
        for overrides in (
            {"email": "nope"},
            {"message": "short"},
            {"name": "K"},
            {"topic": "spam"},
            {"website": "http://spam.example"},
            {"message": "Hello there\x00 with a control character"},
            {"phone": "12"},
        ):
            cache.clear()
            self.assertEqual(self.post(**overrides).status_code, 400, overrides)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_phone_is_optional(self):
        self.assertEqual(self.post(phone="").status_code, 201)

    def test_line_breaks_in_the_name_cannot_inject_email_headers(self):
        with self.captureOnCommitCallbacks(execute=True):
            response = self.post(name="Kofi\r\nBcc: victim@example.com")
        self.assertEqual(response.status_code, 201)
        self.assertNotIn("\n", Enquiry.objects.get().name)  # flattened to one line
        message = mail.outbox[0]
        self.assertNotIn("\n", message.subject)
        self.assertEqual(message.bcc, [])
        self.assertEqual(message.to, ["sales@alanyogroup.com"])

    def test_rate_limited(self):
        codes = [self.post().status_code for _ in range(8)]
        self.assertIn(429, codes)


@override_settings(ENQUIRY_EMAILS=["sales@alanyogroup.com"], TURNSTILE_SECRET_KEY="turnstile-test-secret")
class TurnstileTests(TestCase):
    def setUp(self):
        cache.clear()
        self.api = APIClient()

    def post(self, **extra):
        data = {
            "name": "Kofi Boateng", "email": "kofi@example.com", "topic": "general",
            "message": "I would like to ask about bathroom fixtures for my house.",
        }
        data.update(extra)
        return self.api.post("/api/v1/enquiries", data, format="json")

    def cloudflare(self, success=True):
        response = mock.Mock()
        response.json.return_value = {"success": success}
        return mock.patch("apps.enquiries.turnstile.requests.post", return_value=response)

    def test_a_missing_token_is_refused_without_calling_cloudflare(self):
        with self.cloudflare() as call:
            response = self.post()
        self.assertEqual(response.status_code, 400)
        self.assertIn("turnstile", response.data)
        call.assert_not_called()
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_a_failed_check_is_refused(self):
        with self.cloudflare(success=False):
            response = self.post(turnstile_token="bad-token")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Enquiry.objects.count(), 0)

    def test_a_passed_check_saves_the_enquiry_and_sends_the_secret_only_to_cloudflare(self):
        with self.cloudflare(success=True) as call:
            response = self.post(turnstile_token="good-token")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Enquiry.objects.count(), 1)
        sent = call.call_args.kwargs["data"]
        self.assertEqual((sent["secret"], sent["response"]), ("turnstile-test-secret", "good-token"))

    def test_cloudflare_being_down_fails_safely(self):
        import requests

        with mock.patch("apps.enquiries.turnstile.requests.post", side_effect=requests.ConnectionError("down")):
            response = self.post(turnstile_token="any")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(Enquiry.objects.count(), 0)
        self.assertNotIn("down", str(response.data))

    @override_settings(TURNSTILE_SECRET_KEY="")
    def test_when_not_configured_the_form_works_exactly_as_before(self):
        self.assertEqual(self.post().status_code, 201)
