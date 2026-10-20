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
        intro="At Alanyo Group, we are committed to providing reliable, timely, and efficient delivery services to our customers. Please review our shipping policy below for clarity on how we handle deliveries."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="Free delivery eligibility">
          <ul>
            <li>Orders of GHS 16,000 and above qualify for free delivery within Greater Accra.</li>
            <li>Orders below GHS 16,000 do not qualify for free delivery and will attract a delivery fee.</li>
          </ul>
        </Section>

        <Section title="Shipping methods">
          <ul>
            <li>We offer Standard Shipping for all orders within Accra.</li>
            <li>
              Depending on the size of your order:
              <ul>
                <li>Large orders are delivered using our Kimo Trucks.</li>
                <li>Small orders are delivered via trusted third-party motorcycle services.</li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section title="Order processing & delivery time">
          <ul>
            <li>
              Orders within Accra are typically processed and delivered within 24–48 hours.
              <ul>
                <li>Day 1: Order processing</li>
                <li>Day 2: Delivery</li>
              </ul>
            </li>
            <li>
              Please note: national holidays or high-volume periods may cause slight delays. We appreciate your
              patience during such times.
            </li>
          </ul>
        </Section>

        <Section title="Shipping rates">
          <ul>
            <li>Delivery charges are based on our 23+ years of delivery experience within Accra.</li>
            <li>Our rates are carefully structured to remain fair, reasonable, and transparent.</li>
          </ul>
        </Section>

        <Section title="Shipping locations">
          <p>We currently deliver within Accra and outside Accra.</p>
        </Section>

        <Section title="Order confirmation & delivery process">
          <ul>
            <li>
              After placing an order, our customer support team will call you to:
              <ul>
                <li>Confirm your exact delivery address</li>
                <li>Ensure smooth and accurate delivery</li>
              </ul>
            </li>
            <li>
              Upon arrival, the delivery driver will request:
              <ul>
                <li>Your name</li>
                <li>Your order number</li>
              </ul>
            </li>
          </ul>
          <p>This helps us confirm that the order is delivered to the right customer.</p>
        </Section>

        <Section title="Lost or damaged items">
          <ul>
            <li>In the rare case that an item is lost or damaged during delivery, please contact us immediately.</li>
            <li>
              We will investigate and take appropriate action, which may include:
              <ul>
                <li>A replacement</li>
                <li>Or a refund, where applicable</li>
              </ul>
            </li>
          </ul>
          <p>Your satisfaction is very important to us.</p>
        </Section>

        <Section title="Returns & exchanges">
          <ul>
            <li>
              Please refer to our{" "}
              <Link href="/returns" className="border-b border-ink/40 hover:border-ink">
                Returns and Exchanges Policy
              </Link>{" "}
              for full details.
            </li>
            <li>Note: return delivery costs or restocking fees may apply, depending on the situation.</li>
          </ul>
        </Section>

        <Section title="Customer support">
          <p>Our support team is always ready to help with any delivery-related questions.</p>
          <p>
            Business hours: 8:00 AM – 5:00 PM
            <br />
            Phone:{" "}
            <a href="tel:+233531978362" className="border-b border-ink/40 hover:border-ink">
              +233 531 978 362
            </a>
          </p>
        </Section>

        <Section title="Policy updates">
          <ul>
            <li>This shipping policy may be updated from time to time to improve our service.</li>
            <li>Any changes will be communicated via our website or email.</li>
          </ul>
        </Section>

        <div className="border-t border-stone pt-10 md:grid md:grid-cols-12 md:gap-8">
          <div className="space-y-2 text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8 md:col-start-4">
            <p className="text-xl font-light text-ink">Thank you for choosing Alanyo Group.</p>
            <p>We appreciate your trust and look forward to delivering your orders promptly and professionally.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
