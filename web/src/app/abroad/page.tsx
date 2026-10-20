import type { Metadata } from "next";
import { EnquiryPage } from "@/components/EnquiryPage";

export const metadata: Metadata = {
  title: "Customers Abroad — Alanyo Group",
  description:
    "Building or renovating in Ghana from abroad? Choose your bathroom and kitchen fixtures with Alanyo Group and have them delivered to your property.",
};

export default function AbroadPage() {
  return (
    <EnquiryPage
      kicker="Customers abroad"
      title="Building or renovating in Ghana from abroad?"
      intro="Choose your bathroom and kitchen fixtures from wherever you are. Our team in Accra will guide your selection and arrange delivery of your order to your property in Ghana."
      topic="abroad"
      cta="Start an enquiry"
      note="Tell us what you are planning and where in Ghana it is. A message or a WhatsApp chat is enough to begin, and our team will take it from there."
      blocks={[
        {
          title: "How it works",
          numbered: true,
          items: [
            "Tell us what you need. Send the products you like, a list, or a plan.",
            "Our team confirms availability and pricing with you. Prices are in Ghana cedis (GHS).",
            "We arrange delivery to your site, or to someone you nominate to receive it, in Accra or beyond.",
            "Before dispatch, our support team calls to confirm the exact delivery address.",
          ],
        },
        {
          title: "What to send us",
          items: [
            "The products or collections you are interested in.",
            "Where in Ghana the property is.",
            "When you expect to need the fixtures.",
            "The name and phone number of the person who will receive the delivery.",
          ],
        },
        {
          title: "Good to know",
          items: [
            "A family member or your contractor is welcome to visit one of our showrooms in Weija or East Legon on your behalf.",
            "Our team is available from 8:00 AM to 5:00 PM, Ghana time (GMT). WhatsApp is often the easiest way to reach us across time zones.",
          ],
        },
      ]}
    />
  );
}
