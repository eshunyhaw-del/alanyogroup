import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, PageHeader } from "@/components/PageHeader";
import { RiseIn } from "@/components/RiseIn";
import { categories, productsIn } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "About Us | Alanyo Group",
  description:
    "The story of Alanyo Group: quality craftsmanship and accessible luxury for homeowners, architects and designers.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader kicker="Our story" title="About us." />

      {/* The story */}
      <section className="mx-auto max-w-[1800px] px-5 pb-20 sm:px-8 lg:px-14 lg:pb-32">
        <RiseIn className="md:grid md:grid-cols-12 md:gap-8">
          <p className="text-[clamp(1.35rem,2.3vw,2.1rem)] font-light leading-[1.5] tracking-[-0.01em] md:col-span-9 md:col-start-4">
            Born from a passion for redefining home aesthetics, Alanyo Group began as a humble vision to bridge the gap
            between quality craftsmanship and accessible luxury. Over the years, we’ve grown into a trusted partner for
            homeowners, architects, and designers who share our commitment to excellence. Our journey is rooted in the
            belief that even the smallest details, such as a perfectly sculpted faucet, a sleek basin, or a statement
            bathtub, can inspire and uplift.
          </p>
        </RiseIn>
      </section>

      {/* Photograph */}
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[1800px] overflow-hidden bg-stone md:aspect-[21/9]">
        <Image
          src="/images/invitation-garden.webp"
          alt="A bathroom opening onto a garden, with a freestanding bath and a timber vanity"
          fill
          sizes="(min-width: 1800px) 1800px, 100vw"
          className="object-cover"
        />
      </div>

      {/* Products */}
      <section className="mx-auto max-w-[1800px] px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <RiseIn className="grid gap-8 md:grid-cols-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm md:col-span-3">Products</p>
          <h2 className="text-[clamp(2.25rem,4.6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.02em] md:col-span-8">
            What we offer.
          </h2>
        </RiseIn>

        <ul className="mt-16 border-t border-ink/20 lg:mt-24">
          {categories.map((c) => {
            const count = productsIn(c.slug).length;
            return (
              <li key={c.slug} className="border-b border-stone">
                <Link
                  href={`/collections/${c.slug}`}
                  className="group grid items-baseline gap-2 py-7 transition-colors md:grid-cols-12 md:gap-8"
                >
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.5rem)] font-light tracking-[-0.01em] transition-transform duration-500 ease-quiet group-hover:translate-x-2 md:col-span-5 md:col-start-4">
                    {c.name}
                  </h3>
                  <p className="text-[14px] font-light leading-[1.7] text-ink/70 md:col-span-3">
                    {c.blurb}
                    {count > 0 && <span className="text-warm"> {count} pieces.</span>}
                  </p>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm transition-colors group-hover:text-ink md:col-span-1 md:text-right">
                    Explore
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Invitation */}
      <section className="bg-stone">
        <RiseIn className="mx-auto grid max-w-[1800px] gap-8 px-5 py-24 sm:px-8 md:grid-cols-12 lg:px-14 lg:py-32">
          <h2 className="text-[clamp(2rem,3.8vw,3.75rem)] font-light leading-[1.08] tracking-[-0.02em] md:col-span-6 md:col-start-4">
            Building or renovating? Let us help you choose.
          </h2>
          <div className="flex flex-wrap items-start gap-4 md:col-span-6 md:col-start-4">
            <ButtonLink href="/contact">Make an enquiry</ButtonLink>
            <ButtonLink href="/projects" variant="outline">
              Major projects
            </ButtonLink>
            <ButtonLink href="/abroad" variant="outline">
              Customers abroad
            </ButtonLink>
          </div>
        </RiseIn>
      </section>
    </main>
  );
}
