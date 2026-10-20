import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PolicySection as Section } from "@/components/PolicySection";
import { PHONE, SALES_EMAIL, WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Returns Policy — Alanyo Group",
  description: "Returns are accepted within 7 days when an item is broken. How to report a problem and what happens next.",
};

export default function ReturnsPage() {
  return (
    <main>
      <PageHeader
        kicker="Support"
        title="Returns Policy"
        intro="We want you to be happy with your purchase. This policy explains when an item can be returned and how to go about it."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="1. Returns within 7 days">
          <p>
            We accept returns <strong className="font-medium text-ink">only when an item is broken</strong>. If your
            item is broken, damaged or faulty, please contact us within 7 days of delivery or collection.
          </p>
        </Section>

        <Section title="2. What counts as broken">
          <ul>
            <li>An item that is cracked, chipped or otherwise damaged when you receive it.</li>
            <li>An item that is faulty and does not work as it should.</li>
          </ul>
          <p>
            Damage caused after delivery by misuse, incorrect installation or an accident is not covered by this policy.
          </p>
        </Section>

        <Section title="3. What we do not accept">
          <p>
            Because we accept returns only for broken items, we cannot accept returns for a change of mind, or for items
            that are not broken.
          </p>
        </Section>

        <Section title="4. How to return an item">
          <ul>
            <li>
              Contact us within 7 days of delivery or collection, by phone or WhatsApp on {PHONE.display}, or by email at{" "}
              <a href={`mailto:${SALES_EMAIL}`} className="border-b border-ink/40 hover:border-ink">
                {SALES_EMAIL}
              </a>
              .
            </li>
            <li>Give us your order number or collection code, and clear photos or a short video showing the problem.</li>
            <li>
              We will review your request and tell you what happens next. Please do not send the item back until we have
              agreed to the return.
            </li>
          </ul>
        </Section>

        <Section title="5. Replacement or refund">
          <p>If we approve your return, we will offer a replacement or, where applicable, a refund.</p>
        </Section>

        <Section title="6. Return costs">
          <p>Return delivery costs or restocking fees may apply, depending on the circumstances.</p>
        </Section>

        <Section title="7. Lost or damaged in delivery">
          <p>
            If your order is lost or damaged during delivery, please contact us immediately. See our{" "}
            <Link href="/delivery" className="border-b border-ink/40 hover:border-ink">
              Shipping Policy
            </Link>{" "}
            for details.
          </p>
        </Section>

        <Section title="8. Faults after 7 days">
          <p>
            A fault that appears after the 7-day return period may be covered by our{" "}
            <Link href="/warranty" className="border-b border-ink/40 hover:border-ink">
              5-Year Warranty
            </Link>
            .
          </p>
        </Section>

        <Section title="9. Contact us">
          <p>
            Phone:{" "}
            <a href={`tel:${PHONE.e164}`} className="border-b border-ink/40 hover:border-ink">
              {PHONE.display}
            </a>
            <br />
            WhatsApp:{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ink/40 hover:border-ink"
            >
              message us
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <br />
            Email:{" "}
            <a href={`mailto:${SALES_EMAIL}`} className="border-b border-ink/40 hover:border-ink">
              {SALES_EMAIL}
            </a>
            <br />
            Business hours: 8:00 AM to 5:00 PM
          </p>
        </Section>

        <Section title="10. Changes to this policy">
          <p>
            We may update this policy from time to time. Any changes will be communicated through our website or by
            email.
          </p>
        </Section>
      </div>
    </main>
  );
}
