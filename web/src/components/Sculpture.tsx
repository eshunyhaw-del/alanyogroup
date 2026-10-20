"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

export function Sculpture() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // Approach: the frame opens as the scene arrives. Scrubbed, so it reverses with the scroll.
      gsap.fromTo(
        q("[data-frame]"),
        { clipPath: "inset(18% 12% 18% 12%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.6 },
        },
      );

      // Focus: the object drifts slowly inside its frame.
      gsap.fromTo(
        q("[data-drift]"),
        { yPercent: -6, scale: 1.14 },
        {
          yPercent: 6,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );

      gsap.from(q("[data-rise]"), {
        opacity: 0,
        y: 32,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.14,
        scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 80%", toggleActions: "play none none reverse" },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} data-tone="dark" className="bg-ink text-porcelain">
      <div className="mx-auto grid max-w-[1800px] items-center gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-8 lg:px-14 lg:py-40">
        <div data-copy className="md:order-2 md:col-span-5 md:col-start-8">
          <h2
            data-rise
            className="text-[clamp(2.25rem,4.4vw,4.5rem)] font-light leading-[1.06] tracking-[-0.02em]"
          >
            A bath is not furniture.
            <br />
            It is the quiet centre of the room.
          </h2>
          <p data-rise className="mt-8 max-w-md text-[15px] font-light leading-[1.8] text-porcelain/75">
            We choose forms that hold their own in an architectural space: unbroken curves, honest
            materials, and the stillness that comes from restraint.
          </p>
          <Link
            data-rise
            href="/collections/freestanding-baths"
            className="mt-10 inline-block border border-porcelain/60 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-porcelain hover:text-ink"
          >
            View bathtubs
          </Link>
        </div>

        <div className="md:order-1 md:col-span-6 md:col-start-1">
          <div data-frame className="relative aspect-[3/4] overflow-hidden">
            <div data-drift className="absolute inset-0 will-change-transform">
              <Image
                src="/images/sculpture-bathtub.webp"
                alt="A freestanding white bath in a dark marble bathroom, photographed in black and white"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
