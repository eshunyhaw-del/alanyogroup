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
