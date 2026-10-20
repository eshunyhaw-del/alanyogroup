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
        intro="Alanyo Group respects your privacy and is committed to protecting the personal information you share with us. This policy explains how we collect, use, store and protect that information when you deal with us."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="1. Information we collect">
          <p>When you place an order or contact us, we may collect:</p>
          <ul>
            <li>your full name;</li>
            <li>your telephone number;</li>
            <li>your delivery address;</li>
            <li>the details of your order; and</li>
            <li>any other information you choose to give us when we communicate with you.</li>
          </ul>
        </Section>

        <Section title="2. How we use your information">
          <p>We use your information only to:</p>
          <ul>
            <li>process and deliver your orders accurately;</li>
            <li>contact you to confirm your order and delivery details;</li>
            <li>provide customer support and respond to your enquiries;</li>
            <li>improve our services and your experience; and</li>
            <li>send you important updates about your orders.</li>
          </ul>
          <p>We do not sell, rent or trade your personal information to third parties.</p>
        </Section>

        <Section title="3. Sharing your information">
          <p>We share your information only where necessary, and only with:</p>
          <ul>
            <li>delivery drivers and logistics partners, solely for the purpose of delivering your order; and</li>
            <li>our own staff who are responsible for order fulfilment and customer service.</li>
          </ul>
          <p>Any information we share is handled responsibly and used only for legitimate business purposes.</p>
        </Section>

        <Section title="4. Data security">
          <p>We take reasonable measures to protect your personal information from:</p>
          <ul>
            <li>unauthorised access;</li>
            <li>loss;</li>
            <li>misuse; and</li>
            <li>disclosure.</li>
          </ul>
          <p>Your information is accessible only to authorised personnel who need it to carry out their duties.</p>
        </Section>

        <Section title="5. Contacting you">
          <p>By placing an order with us, you agree that we may contact you by:</p>
          <ul>
            <li>telephone;</li>
            <li>SMS; and</li>
            <li>WhatsApp, where applicable.</li>
          </ul>
          <p>We will use these channels only for order confirmation, delivery coordination and customer support.</p>
        </Section>

        <Section title="6. How long we keep your information">
          <p>We keep your information only for as long as necessary to:</p>
          <ul>
            <li>fulfil your orders; and</li>
            <li>maintain records for operational and legal purposes.</li>
          </ul>
          <p>After that time, your information is securely deleted or anonymised.</p>
        </Section>

        <Section title="7. Your rights">
          <p>You have the right to:</p>
          <ul>
            <li>request access to the personal information we hold about you;</li>
            <li>ask us to correct any inaccurate information; and</li>
            <li>ask us to delete your information, where applicable.</li>
          </ul>
          <p>To exercise any of these rights, please contact us using the details below.</p>
        </Section>

        <Section title="8. Third-party links">
          <p>
            Our website and communication channels may link to third-party platforms. We are not responsible for the
            privacy practices of those sites.
          </p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>
            We may update this policy from time to time to reflect changes in our operations or in the law. Where
            necessary, we will notify you of changes through our website or directly.
          </p>
        </Section>

        <Section title="10. Contact us">
          <p>If you have any questions or concerns about this policy or how we handle your information, please contact us:</p>
          <p>
            Phone:{" "}
            <a href="tel:+233531978362" className="border-b border-ink/40 hover:border-ink">
              +233 531 978 362
            </a>
            <br />
            Business hours: 8:00 AM to 5:00 PM
          </p>
        </Section>

        <div className="border-t border-stone pt-10 md:grid md:grid-cols-12 md:gap-8">
          <p className="text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8 md:col-start-4">
            By using our services, you agree to the terms of this Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
