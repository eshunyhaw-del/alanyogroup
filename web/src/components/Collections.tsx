"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

type Tile = {
  name: string;
  href: string;
  image?: string;
  alt?: string;
  span: string;
  aspect: string;
  fit?: "cover" | "contain";
  tone?: "dark";
};

// Category names come from the business brief. No counts, prices or specifications are shown
// until real catalogue data exists in the API.
const tiles: Tile[] = [
  {
    name: "Water Closets",
    href: "/collections/water-closets",
    image: "/images/col-water-closets.webp",
    alt: "A wall-hung water closet and basin in a white marble bathroom",
    span: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    name: "Vanity Cabinets",
    href: "/collections/vanity-cabinets",
    image: "/images/col-vanities.webp",
    alt: "A walnut vanity with twin basins beneath arched mirrors",
    span: "md:col-span-5",
    aspect: "aspect-[4/3] md:aspect-auto md:min-h-[20rem] md:flex-1",
  },
  {
    name: "Bathtubs",
    href: "/collections/freestanding-baths",
    image: "/images/col-baths.webp",
    alt: "A freestanding bath beside a tiled wall in soft daylight",
    span: "md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Rainfall Showers",
    tone: "dark",
    href: "/collections/rainfall-showers",
    image: "/images/col-showers.webp",
    alt: "A rainfall shower head releasing water against a dark wall",
    span: "md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Wash Basins",
    tone: "dark",
    href: "/collections/wash-basins",
    image: "/images/col-basins.webp",
    alt: "Raking light across the curve of a basin in a warm room",
    span: "md:col-span-4",
    aspect: "aspect-[4/5]",
  },
  {
    name: "Kitchen Sinks & Fixtures",
    href: "/collections/kitchen",
    image: "/images/col-kitchen.webp",
    alt: "A stainless sink with a matte black tap in a timber and stone kitchen",
    span: "md:col-span-8",
    aspect: "aspect-[4/3] md:aspect-[16/9]",
  },
  {
    name: "Water Heaters",
    href: "/collections/water-heaters",
    image: "/products/15l-electric-water-heater-with-elbc-protector-1.webp",
    alt: "A white electric water heater with a digital temperature display",
    fit: "contain",
    span: "md:col-span-4",
    aspect: "aspect-[4/3] md:aspect-auto md:min-h-[20rem] md:flex-1",
  },
];

export function Collections() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap, ScrollTrigger } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      gsap.from(q("[data-head]"), {
        opacity: 0,
        y: 28,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-head]")[0], start: "top 82%", toggleActions: "play none none reverse" },
      });

      // Tiles settle in as they arrive, in the order they enter the viewport.
      gsap.set(q("[data-tile]"), { opacity: 0, y: 40 });
      ScrollTrigger.batch(q("[data-tile]"), {
        start: "top 88%",
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", stagger: 0.12, overwrite: true }),
        onLeaveBack: (els) => gsap.to(els, { opacity: 0, y: 40, duration: 0.6, overwrite: true }),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="bg-porcelain text-ink">
      <div className="mx-auto max-w-[1800px] px-5 py-24 sm:px-8 lg:px-14 lg:py-40">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p data-head className="mb-8 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">
              The Collections
            </p>
            <h2
              data-head
              className="text-[clamp(2.25rem,4.6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.02em]"
            >
              Everything the room needs, chosen with the same eye.
            </h2>
          </div>
          <div className="md:col-span-3 md:col-start-10 md:text-right">
            <Link
              data-head
              href="/collections"
              className="inline-block border-b border-ink/60 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
            >
              Shop all collections
            </Link>
          </div>
        </div>

        <ul className="grid gap-x-6 gap-y-14 md:grid-cols-12 md:gap-y-20">
          {tiles.map((t) => (
            <li key={t.name} data-tile className={`${t.span} flex flex-col`}>
              <Link href={t.href} className="group flex h-full flex-col">
                <div
                  data-tone={t.tone}
                  className={`relative w-full overflow-hidden ${t.aspect} ${
                    t.fit === "contain" ? "bg-white" : t.image ? "bg-stone" : "grid place-items-center bg-stone"
                  }`}
                >
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.alt ?? ""}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className={`transition-transform duration-[1400ms] ease-quiet group-hover:scale-[1.04] ${
                        t.fit === "contain" ? "object-contain p-6" : "object-cover"
                      }`}
                    />
                  ) : (
                    <span className="px-6 text-center text-[10px] uppercase tracking-[0.2em] text-warm">
                      Photography to come
                    </span>
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-6">
                  <h3 className="text-lg font-light tracking-tight">{t.name}</h3>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-warm transition-colors group-hover:text-ink">
                    Explore
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
