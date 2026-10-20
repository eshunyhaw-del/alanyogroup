import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "About — Alanyo Group" };

export default function Page() {
  return (
    <main>
      <PageHeader kicker="About" title="The Art of Refined Living." intro="Alanyo Group supplies luxury sanitaryware and fixtures for the bathroom and kitchen." />
      <div className="mx-auto grid max-w-[1800px] gap-12 px-5 pb-32 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14">
        <div className="md:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-stone">
            <Image
              src="/images/invitation-garden.webp"
              alt="A bathroom opening onto a garden, with a freestanding bath and a timber vanity"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="space-y-6 md:col-span-4 md:col-start-9 md:pt-8">
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">We believe a bathroom or kitchen should feel composed, calm and considered, closer to a well-made room in a fine home than to a catalogue page.</p>
            <p className="text-[15px] font-light leading-[1.8] text-ink/75">We offer water closets, vanity cabinets, freestanding baths, rainfall showers, wash basins, kitchen sinks and fixtures, and water heaters.</p>
          <div className="pt-4">
            <ButtonLink href="/collections">Explore collections</ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
