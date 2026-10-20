import { ButtonLink, PageHeader } from "@/components/PageHeader";
import { PHONE, SALES_EMAIL, WHATSAPP_URL } from "@/lib/contact";

type Block = { title: string; items: string[]; numbered?: boolean };

// Layout shared by the pages for customers abroad and for major projects: a headline, a few plain blocks,
// and one clear way to get in touch.
export function EnquiryPage({
  kicker,
  title,
  intro,
  blocks,
  topic,
  cta,
  note,
}: {
  kicker: string;
  title: string;
  intro: string;
  blocks: Block[];
  topic: string;
  cta: string;
  note?: string;
}) {
  return (
    <main>
      <PageHeader kicker={kicker} title={title} intro={intro} />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        {blocks.map((b) => (
          <section key={b.title} className="grid gap-4 border-t border-stone py-10 md:grid-cols-12 md:gap-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm md:col-span-3">{b.title}</h2>
            {b.numbered ? (
              <ol className="space-y-5 text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8">
                {b.items.map((item, i) => (
                  <li key={item} className="flex gap-5">
                    <span className="w-6 shrink-0 text-warm">{String(i + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8">
                {b.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="grid gap-6 border-t border-stone pt-10 md:grid-cols-12 md:gap-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm md:col-span-3">Get in touch</h2>
          <div className="md:col-span-8">
            {note && <p className="max-w-xl text-[15px] font-light leading-[1.8] text-ink/80">{note}</p>}
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={`/contact?topic=${topic}`}>{cta}</ButtonLink>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-ink/70 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-ink hover:text-porcelain"
              >
                WhatsApp us
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <dl className="mt-10 space-y-2 text-[15px] font-light">
              <div className="flex gap-4">
                <dt className="w-16 text-warm">Email</dt>
                <dd>
                  <a href={`mailto:${SALES_EMAIL}`} className="border-b border-ink/40 hover:border-ink">
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
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}
