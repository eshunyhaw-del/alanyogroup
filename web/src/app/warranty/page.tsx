import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PolicySection as Section } from "@/components/PolicySection";
import { PHONE, SALES_EMAIL, WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = {
  title: "5-Year Warranty — Alanyo Group",
  description: "Every Alanyo Group purchase is covered by a 5-year warranty. What it covers and how to make a claim.",
};

export default function WarrantyPage() {
  return (
    <main>
      <PageHeader
        kicker="Support"
        title="5-Year Warranty"
        intro="Alanyo Group stands behind the products it sells. Your purchase is covered by a 5-year warranty."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Section title="1. Warranty period">
          <p>Your product is covered for 5 years from the date of purchase.</p>
        </Section>

        <Section title="2. What is covered">
          <p>
            Faults caused by defects in materials or manufacture that arise when the product is used normally and
            correctly.
          </p>
        </Section>

        <Section title="3. What is not covered">
          <ul>
            <li>Misuse, abuse or neglect.</li>
            <li>Incorrect installation.</li>
            <li>Accidental damage.</li>
            <li>Normal wear and tear.</li>
            <li>Repairs or changes made by anyone we have not authorised.</li>
          </ul>
        </Section>

        <Section title="4. How to make a claim">
          <ul>
            <li>
              Contact us by phone or WhatsApp on {PHONE.display}, or by email at{" "}
              <a href={`mailto:${SALES_EMAIL}`} className="border-b border-ink/40 hover:border-ink">
                {SALES_EMAIL}
              </a>
              .
            </li>
            <li>Give us your order number or collection code, and describe the problem.</li>
            <li>Send clear photos or a short video showing the fault.</li>
            <li>We may ask you for more information, and we will tell you what happens next.</li>
          </ul>
        </Section>

        <Section title="5. What we will do">
          <p>If we approve your claim, we will repair or replace the product or, where applicable, offer a refund.</p>
        </Section>

        <Section title="6. Proof of purchase">
          <p>
            Please keep your order confirmation email or receipt. We will need your order number or collection code to
            find your purchase.
          </p>
        </Section>

        <Section title="7. Returns and the warranty">
          <p>
            An item that is broken when you receive it can be returned within 7 days under our{" "}
            <Link href="/returns" className="border-b border-ink/40 hover:border-ink">
              Returns Policy
            </Link>
            . The warranty covers faults that appear after that.
          </p>
        </Section>

        <Section title="8. Contact us">
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

        <Section title="9. Changes to this policy">
          <p>
            We may update this policy from time to time. Any changes will be communicated through our website or by
            email.
          </p>
        </Section>
      </div>
    </main>
  );
}
