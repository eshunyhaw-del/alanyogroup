import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, PageHeader } from "@/components/PageHeader";
import { showroomHours, showrooms } from "@/lib/showrooms";

export const metadata: Metadata = { title: "Showrooms — Alanyo Group" };

export default function ShowroomPage() {
  return (
    <main>
      <PageHeader
        kicker="Showrooms"
        title="Come and see it in person."
        intro="Some things are best judged by eye and by hand. Visit us at either of our two Accra showrooms."
      />

      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <div className="relative mb-16 aspect-[16/9] overflow-hidden bg-stone md:aspect-[21/9]">
          <Image
            src="/images/craft-vanity.webp"
            alt="A floating timber double vanity with a stone top, set against travertine-clad walls"
            fill
            sizes="(min-width: 1800px) 1700px, 100vw"
            className="object-cover"
          />
        </div>

        <ul className="grid gap-12 md:grid-cols-2 md:gap-8">
          {showrooms.map((s) => (
            <li key={s.slug} className="border-t border-ink/20 pt-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">{s.area}</p>
              <h2 className="mt-4 text-[clamp(1.5rem,2.4vw,2.25rem)] font-light leading-[1.15] tracking-[-0.01em]">
                {s.name}
              </h2>
              <address className="mt-6 text-[15px] font-light not-italic leading-[1.8] text-ink/75">
                {s.addressLine}
                <br />
                <span className="text-warm">Plus code {s.plusCode}</span>
              </address>
              <p className="mt-4 text-[15px] font-light">
                <span className="text-warm">Telephone </span>
                {s.phone ? (
                  <a href={`tel:${s.phone.e164}`} className="border-b border-ink/40 hover:border-ink">
                    {s.phone.display}
                  </a>
                ) : (
                  <span className="text-warm">to be confirmed</span>
                )}
              </p>
              <dl className="mt-6 max-w-xs divide-y divide-stone text-[14px] font-light">
                {showroomHours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6 py-2">
                    <dt className="text-warm">{h.days}</dt>
                    <dd>{h.time}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={s.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink"
                >
                  Get directions
                  <span className="sr-only"> to {s.name} (opens Google Maps in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 max-w-xl">
          <p className="text-[15px] font-light leading-[1.8] text-ink/75">
            Planning a visit or a project? Tell us which showroom suits you and what you are looking for.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" variant="outline">
              Make an enquiry
            </ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
