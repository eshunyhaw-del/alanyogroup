import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { categories, productsIn } from "@/lib/catalog";

export const metadata: Metadata = { title: "Collections | Alanyo Group" };

export default function CollectionsPage() {
  return (
    <main>
      <PageHeader
        kicker="Collections"
        title="Sanitaryware and fixtures, composed as a whole."
        intro="Choose a category to browse. Each is selected to sit comfortably beside the others."
      />
      <ul className="mx-auto grid max-w-[1800px] gap-x-6 gap-y-16 px-5 pb-32 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-14">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/collections/${c.slug}`} className="group block">
              <div
                data-tone={c.tone}
                className={`relative grid aspect-[4/5] place-items-center overflow-hidden ${
                  c.fit === "contain" ? "bg-white" : "bg-stone"
                }`}
              >
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.imageAlt ?? ""}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className={`transition-transform duration-[1400ms] ease-quiet group-hover:scale-[1.04] ${
                      c.fit === "contain" ? "object-contain p-6" : "object-cover"
                    }`}
                  />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-warm">Photography to come</span>
                )}
              </div>
              <h2 className="mt-5 text-xl font-light tracking-tight">{c.name}</h2>
              <p className="mt-2 max-w-sm text-[14px] font-light leading-[1.7] text-ink/70">
                {c.blurb}
                {productsIn(c.slug).length > 0 && ` ${productsIn(c.slug).length} pieces.`}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
