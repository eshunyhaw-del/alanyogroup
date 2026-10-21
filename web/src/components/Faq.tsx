import type { Faq } from "@/lib/faqs";

/** Visible, keyboard-accessible Q&A (native disclosure) plus FAQPage structured data. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export function FaqList({
  faqs,
  title = "Frequently asked questions",
  schema = true,
}: {
  faqs: Faq[];
  title?: string;
  schema?: boolean;
}) {

  return (
    <section className="grid gap-4 border-t border-stone py-10 md:grid-cols-12 md:gap-8">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm md:col-span-3">{title}</h2>
      <div className="divide-y divide-stone border-y border-stone md:col-span-8">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-normal leading-[1.5] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="mt-1 text-warm transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[60ch] text-[15px] font-light leading-[1.8] text-ink/80">{f.a}</p>
          </details>
        ))}
      </div>
      {schema && <FaqJsonLd faqs={faqs} />}
    </section>
  );
}
