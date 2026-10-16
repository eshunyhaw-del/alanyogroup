"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // Arrival: the room settles, then the words rise out of it.
      gsap.set(q("[data-reveal]"), { y: 28 });
      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .fromTo(media.current, { scale: 1.12 }, { scale: 1.04, duration: 2.8, ease: "power2.inOut" }, 0)
        .to(q("[data-reveal]"), { opacity: 1, y: 0, duration: 1.4, stagger: 0.18 }, 0.5);

      // Drift: scrubbed and reversible, the room recedes as you leave it.
      gsap.to(q("[data-media]"), {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(q("[data-copy]"), {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "20% top", end: "bottom 30%", scrub: 0.6 },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[620px] overflow-hidden bg-ink text-white">
      <div data-media className="absolute inset-0 will-change-transform">
        <div ref={media} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero-arrival-2400.webp"
            alt="A bathroom in warm stone and oak, with a freestanding bath beside a glass-enclosed shower"
            fill
            priority
            sizes="(max-aspect-ratio: 3/2) 150svh, 100vw"
            className="object-cover object-[62%_55%]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,43,42,0.4),rgba(41,43,42,0)_22%),linear-gradient(0deg,rgba(41,43,42,0.72),rgba(41,43,42,0)_62%),linear-gradient(90deg,rgba(41,43,42,0.35),rgba(41,43,42,0)_55%)]"
      />

      <div
        data-copy
        className="absolute bottom-[clamp(56px,13svh,128px)] left-5 max-w-[60rem] sm:left-8 lg:left-14"
      >
        <p
          data-reveal
          className="reveal mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-white/85"
        >
          Alanyo Group · Sanitaryware &amp; Fixtures
        </p>
        <h1
          data-reveal
          className="reveal text-[clamp(2.75rem,6.4vw,6.25rem)] font-light leading-[1.02] tracking-[-0.025em]"
        >
          The Art of
          <br />
          Refined Living.
        </h1>
        <p
          data-reveal
          className="reveal mt-6 max-w-[24rem] text-[15px] font-light leading-[1.7] text-white/90"
        >
          Bathrooms and kitchens composed like architecture, considered in every surface, line and
          detail.
        </p>
        <Link
          data-reveal
          href="/collections"
          className="reveal mt-9 inline-block border border-white/70 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-white hover:text-ink"
        >
          Explore the collections
        </Link>
      </div>

      <div
        data-reveal
        aria-hidden
        className="reveal absolute bottom-12 right-5 hidden flex-col items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/80 sm:flex lg:right-14"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="block h-12 w-px bg-white/60" />
      </div>
    </section>
  );
}
