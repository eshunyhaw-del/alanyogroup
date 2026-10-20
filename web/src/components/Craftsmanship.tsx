"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

export function Craftsmanship() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // Reveal: each text block rises once, and returns if the reader scrolls back.
      q("[data-rise-group]").forEach((group) => {
        gsap.from(group.querySelectorAll("[data-rise]"), {
          opacity: 0,
          y: 28,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none reverse" },
        });
      });

      // Drift: the wide room moves slower than the page.
      gsap.fromTo(
        q("[data-wide-drift]"),
        { yPercent: -7, scale: 1.12 },
        {
          yPercent: 7,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: q("[data-wide]")[0], start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );

      // Unfold: the two detail plates part at different speeds.
      gsap.to(q("[data-plate='a']"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: q("[data-plates]")[0], start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(q("[data-plate='b']"), {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: q("[data-plates]")[0], start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="bg-porcelain text-ink">
      <div className="mx-auto max-w-[1800px] px-5 pb-12 pt-24 sm:px-8 lg:px-14 lg:pb-20 lg:pt-40">
        <div data-rise-group className="grid gap-8 md:grid-cols-12">
          <h2
            data-rise
            className="text-[clamp(2.25rem,4.6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.02em] md:col-span-8 md:col-start-4"
          >
            Cabinetry composed with the patience of joinery.
          </h2>
        </div>
      </div>

      <div data-wide className="relative mx-auto aspect-[4/3] w-full max-w-[1800px] overflow-hidden md:aspect-[21/10]">
        <div data-wide-drift className="absolute inset-0 will-change-transform">
          <Image
            src="/images/craft-vanity.webp"
            alt="A floating timber double vanity with a stone top, set against travertine-clad walls"
            fill
            sizes="(min-width: 1800px) 1800px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-5 py-20 sm:px-8 lg:px-14 lg:py-36">
        <div data-plates className="grid items-start gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4 md:col-start-2">
            <div data-plate="a" className="relative aspect-[2/3] overflow-hidden will-change-transform">
              <Image
                src="/images/craft-detail.webp"
                alt="A stone basin top and timber drawer front under soft wall lighting"
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div data-rise-group className="md:col-span-3 md:col-start-6 md:self-center">
            <p data-rise className="text-[15px] font-light leading-[1.8] text-ink/80">
              Grain, edge and shadow line. We look first at how a piece is made, then at how it
              sits in the room, and only then at what it is called.
            </p>
            <Link
              data-rise
              href="/collections/vanity-cabinets"
              className="mt-10 inline-block border border-ink/70 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-ink hover:text-porcelain"
            >
              View vanities
            </Link>
          </div>

          <div className="md:col-span-3 md:col-start-9 md:mt-40">
            <div data-plate="b" className="relative aspect-[2/3] overflow-hidden will-change-transform">
              <Image
                src="/images/craft-basin.webp"
                alt="Raking light across the curve of a basin in a warm, plastered room"
                fill
                sizes="(min-width: 768px) 25vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-warm">Light across form</p>
          </div>
        </div>
      </div>
    </section>
  );
}
