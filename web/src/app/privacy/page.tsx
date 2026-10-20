import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PolicySection as Section } from "@/components/PolicySection";

export const metadata: Metadata = {
  title: "Privacy Policy — Alanyo Group",
  description: "How Alanyo Group collects, uses, stores and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        kicker="Legal"
        title="Privacy Policy"
        intro="At Alanyo Group, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your information when you interact with our business."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="1. Information we collect">
          <p>We may collect the following information when you place an order or contact us:</p>
          <ul>
            <li>Full name</li>
            <li>Phone number</li>
            <li>Delivery address</li>
            <li>Order details</li>
            <li>Any other information you voluntarily provide during communication</li>
          </ul>
        </Section>

        <Section title="2. How we use your information">
          <p>Your information is used strictly to:</p>
          <ul>
            <li>Process and deliver your orders accurately</li>
            <li>Contact you to confirm orders and delivery details</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Improve our services and customer experience</li>
            <li>Communicate important updates related to your orders</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties.</p>
        </Section>

        <Section title="3. Information sharing">
          <p>We may share limited information only when necessary with:</p>
          <ul>
            <li>Delivery drivers or logistics partners (solely for delivery purposes)</li>
            <li>Internal staff responsible for order fulfillment and customer service</li>
          </ul>
          <p>All shared information is handled responsibly and only for business-related purposes.</p>
        </Section>

        <Section title="4. Data security">
          <p>We take reasonable measures to protect your personal information against:</p>
          <ul>
            <li>Unauthorized access</li>
            <li>Loss</li>
            <li>Misuse</li>
            <li>Disclosure</li>
          </ul>
          <p>Your data is only accessible to authorized personnel who need it to perform their duties.</p>
        </Section>

        <Section title="5. Customer communication">
          <p>By placing an order with us, you consent to being contacted via:</p>
          <ul>
            <li>Phone calls</li>
            <li>SMS</li>
            <li>WhatsApp (where applicable)</li>
          </ul>
          <p>This communication is strictly for order confirmation, delivery coordination, and customer support.</p>
        </Section>

        <Section title="6. Data retention">
          <p>We retain customer information only for as long as necessary to:</p>
          <ul>
            <li>Fulfill orders</li>
            <li>Maintain records for operational and legal purposes</li>
          </ul>
          <p>After this period, data is securely deleted or anonymized.</p>
        </Section>

        <Section title="7. Your rights">
          <p>You have the right to:</p>
          <ul>
            <li>Request access to your personal information</li>
            <li>Request corrections to inaccurate information</li>
            <li>Request deletion of your data where applicable</li>
          </ul>
          <p>To exercise these rights, please contact us using the details below.</p>
        </Section>

        <Section title="8. Third-party links">
          <p>
            Our website or communication channels may contain links to third-party platforms. We are not responsible
            for the privacy practices of these external sites.
          </p>
        </Section>

        <Section title="9. Policy updates">
          <p>
            This Privacy Policy may be updated periodically to reflect changes in our operations or legal
            requirements. Any updates will be communicated via our website or directly to customers where necessary.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>
            If you have any questions or concerns about this Privacy Policy or how your information is handled,
            please contact us:
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+233531978362" className="border-b border-ink/40 hover:border-ink">
              +233 531 978 362
            </a>
            <br />
            Business hours: 8:00 AM – 5:00 PM
          </p>
        </Section>

        <div className="border-t border-stone pt-10 md:grid md:grid-cols-12 md:gap-8">
          <p className="text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8 md:col-start-4">
            By using our services, you agree to the terms outlined in this Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
