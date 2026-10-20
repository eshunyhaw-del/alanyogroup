import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { PHONE, SALES_EMAIL, WHATSAPP_URL } from "@/lib/contact";

export const metadata: Metadata = { title: "Contact — Alanyo Group" };

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        kicker="Contact"
        title="Let us help you compose the room."
        intro="Tell us about your project and we will come back to you."
      />
      <div className="mx-auto grid max-w-[1800px] gap-16 px-5 pb-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14">
        <div className="md:col-span-7">
          <Suspense fallback={<div className="min-h-[24rem]" />}>
            <ContactForm />
          </Suspense>
        </div>

        <aside className="space-y-10 md:col-span-4 md:col-start-9">
          <div>
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Sales</h2>
            <dl className="mt-5 space-y-2 text-[15px] font-light">
              <div className="flex gap-4">
                <dt className="w-16 text-warm">Email</dt>
                <dd>
                  <a href={`mailto:${SALES_EMAIL}`} className="break-all border-b border-ink/40 hover:border-ink">
                    {SALES_EMAIL}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-16 text-warm">Phone</dt>
                <dd>
                  <a href={`tel:${PHONE.e164}`} className="border-b border-ink/40 hover:border-ink">
                    {PHONE.display}
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-16 text-warm">Hours</dt>
                <dd>8:00 AM to 5:00 PM</dd>
              </div>
            </dl>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border border-ink/70 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-ink hover:text-porcelain"
            >
              WhatsApp us
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          <div className="space-y-3 text-[15px] font-light">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">More ways to reach us</h2>
            <p>
              <Link href="/showroom" className="border-b border-ink/40 hover:border-ink">
                Visit a showroom
              </Link>
            </p>
            <p>
              <Link href="/abroad" className="border-b border-ink/40 hover:border-ink">
                Customers abroad
              </Link>
            </p>
            <p>
              <Link href="/projects" className="border-b border-ink/40 hover:border-ink">
                Major projects
              </Link>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
