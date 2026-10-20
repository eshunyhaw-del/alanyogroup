"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

export function Invitation() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // Rest: the room slows to a near standstill as the reader arrives.
      gsap.fromTo(
        q("[data-drift]"),
        { yPercent: -6, scale: 1.14 },
        {
          yPercent: 6,
          scale: 1.04,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );

      gsap.from(q("[data-rise]"), {
        opacity: 0,
        y: 32,
        duration: 1.4,
        ease: "power2.out",
        stagger: 0.16,
        scrollTrigger: { trigger: root.current, start: "top 55%", toggleActions: "play none none reverse" },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative grid min-h-svh place-items-center overflow-hidden bg-ink text-white">
      <div data-drift className="absolute inset-0 will-change-transform">
        <Image
          src="/images/invitation-garden.webp"
          alt="A bathroom opening onto a garden, with a freestanding bath and a timber vanity"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-ink/55" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-32 text-center sm:px-8">
        <p data-rise className="mb-8 text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
          The Invitation
        </p>
        <h2
          data-rise
          className="text-[clamp(2.5rem,5.4vw,5.5rem)] font-light leading-[1.04] tracking-[-0.025em]"
        >
          Let us help you
          <br />
          compose the room.
        </h2>
        <p data-rise className="mx-auto mt-8 max-w-md text-[15px] font-light leading-[1.8] text-white/85">
          Whether you are renovating one bathroom or building a home, we would be glad to talk it through.
        </p>
        <div data-rise className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/contact"
            className="inline-block border border-white bg-white px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-white"
          >
            Make an enquiry
          </Link>
          <Link
            href="/collections"
            className="inline-block border border-white/70 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-white hover:text-ink"
          >
            Explore collections
          </Link>
        </div>
      </div>
    </section>
  );
}
