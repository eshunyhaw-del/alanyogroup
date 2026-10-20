import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PolicySection as Section } from "@/components/PolicySection";

export const metadata: Metadata = {
  title: "Shipping Policy — Alanyo Group",
  description: "How Alanyo Group delivers: free delivery eligibility, shipping methods, timings and locations.",
};

export default function ShippingPolicyPage() {
  return (
    <main>
      <PageHeader
        kicker="Support"
        title="Shipping Policy"
        intro="Alanyo Group is committed to reliable, timely and efficient delivery. This policy explains how we deliver your order."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="1. Free delivery">
          <ul>
            <li>Orders of GHS 16,000 or more qualify for free delivery within Greater Accra.</li>
            <li>Orders below GHS 16,000 are subject to a delivery fee.</li>
          </ul>
        </Section>

        <Section title="2. Delivery methods">
          <p>Standard delivery is available for all orders within Accra. The method depends on the size of your order:</p>
          <ul>
            <li>Large orders are delivered by our Kimo trucks.</li>
            <li>Small orders are delivered by trusted third-party motorcycle couriers.</li>
          </ul>
        </Section>

        <Section title="3. Processing and delivery times">
          <p>
            Orders within Accra are normally processed and delivered within 24 to 48 hours of being placed. Processing
            takes place on the first day, and delivery on the second.
          </p>
          <p>
            Public holidays and periods of high demand may cause slight delays. We appreciate your patience at these
            times.
          </p>
        </Section>

        <Section title="4. Delivery charges">
          <p>
            Our delivery charges draw on more than 23 years of delivery experience in Accra. They are set to be fair,
            reasonable and transparent.
          </p>
        </Section>

        <Section title="5. Delivery locations">
          <p>We deliver within Accra and to locations outside Accra.</p>
        </Section>

        <Section title="6. Order confirmation and delivery">
          <p>After you place an order, our customer support team will call you to:</p>
          <ul>
            <li>confirm your exact delivery address; and</li>
            <li>arrange a smooth and accurate delivery.</li>
          </ul>
          <p>
            On arrival, the delivery driver will ask for your name and order number. This allows us to confirm that
            your order is handed to the right customer.
          </p>
        </Section>

        <Section title="7. Lost or damaged items">
          <p>
            If an item is lost or damaged during delivery, please contact us immediately. We will investigate and take
            appropriate action, which may include a replacement or, where applicable, a refund.
          </p>
        </Section>

        <Section title="8. Returns and exchanges">
          <p>
            Please see our{" "}
            <Link href="/returns" className="border-b border-ink/40 hover:border-ink">
              Returns and Exchanges Policy
            </Link>{" "}
            for full details. Return delivery costs or restocking fees may apply, depending on the circumstances.
          </p>
        </Section>

        <Section title="9. Customer support">
          <p>Our support team is happy to answer any questions about your delivery.</p>
          <p>
            Phone:{" "}
            <a href="tel:+233531978362" className="border-b border-ink/40 hover:border-ink">
              +233 531 978 362
            </a>
            <br />
            Business hours: 8:00 AM to 5:00 PM
          </p>
        </Section>

        <Section title="10. Changes to this policy">
          <p>
            We may update this policy from time to time to improve our service. Any changes will be communicated
            through our website or by email.
          </p>
        </Section>

        <div className="border-t border-stone pt-10 md:grid md:grid-cols-12 md:gap-8">
          <p className="text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8 md:col-start-4">
            Thank you for choosing Alanyo Group. We value your trust and look forward to delivering your order
            promptly and professionally.
          </p>
        </div>
      </div>
    </main>
  );
}
