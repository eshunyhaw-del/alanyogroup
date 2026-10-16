import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Showroom — Alanyo Group" };

export default function Page() {
  return (
    <main>
      <PageHeader kicker="Showroom" title="Come and see it in person." intro="Some things are best judged by eye and by hand." />
      <div className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14">
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone">
            <Image
              src="/images/craft-vanity.webp"
              alt="A floating timber double vanity with a stone top"
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
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">Showroom details, including address and opening hours, will be published here once confirmed by Alanyo Group.</p>
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">In the meantime, get in touch and we will arrange a conversation about your project.</p>
          <div className="pt-4">
            <ButtonLink href="/contact">Make an enquiry</ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
