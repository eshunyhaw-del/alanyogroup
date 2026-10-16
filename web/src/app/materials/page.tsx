import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Materials — Alanyo Group" };

export default function Page() {
  return (
    <main>
      <PageHeader kicker="Materials" title="Timber, stone and light." intro="How a piece is made matters as much as how it looks." />
      <div className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14">
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone">
            <Image
              src="/images/craft-detail.webp"
              alt="A stone basin top and timber drawer front under soft wall lighting"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-warm">
            Atmosphere photography. Not a product listing.
          </p>
        </div>
        <div className="space-y-6 md:col-span-4 md:col-start-9 md:pt-8">
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">Detailed material information will be added alongside each product as catalogue content is confirmed by Alanyo Group.</p>
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">Until then, our enquiry team can answer questions about finishes and construction.</p>
          <div className="pt-4">
            <ButtonLink href="/contact">Make an enquiry</ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
