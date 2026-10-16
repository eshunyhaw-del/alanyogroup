"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

export function Ritual() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);

      // The scene holds still while the reader moves through it: water, then warmth.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
        },
      });

      tl.fromTo(q("[data-frame]"), { scale: 0.88 }, { scale: 1, duration: 0.3 }, 0)
        .fromTo(q("[data-water]"), { scale: 1.18 }, { scale: 1.04, duration: 1 }, 0)
        .to(q("[data-copy='1']"), { opacity: 0, y: -24, duration: 0.2 }, 0.5)
        .fromTo(q("[data-atmosphere]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 }, 0.5)
        .fromTo(q("[data-atmos-img]"), { scale: 1.15 }, { scale: 1.02, duration: 0.45 }, 0.5)
        .fromTo(q("[data-copy='2']"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25 }, 0.75);
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative h-svh min-h-[620px] overflow-hidden bg-ink text-porcelain">
      <div className="mx-auto grid h-full max-w-[1800px] grid-rows-[minmax(0,1fr)_auto] gap-8 px-5 pb-10 pt-24 sm:px-8 md:grid-cols-12 md:grid-rows-1 md:items-center md:gap-8 md:py-24 lg:px-14">
        <div className="relative min-h-0 md:order-2 md:col-span-5 md:col-start-7 md:h-full">
          <div data-frame className="relative mx-auto h-full max-h-full w-full overflow-hidden md:max-w-[34rem]">
            <div className="absolute inset-0">
              <div data-water className="absolute inset-0 will-change-transform">
                <Image
                  src="/images/ritual-water.webp"
                  alt="Rainfall shower head releasing water against a dark wall, in black and white"
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div data-atmosphere className="absolute inset-0 [clip-path:inset(100%_0%_0%_0%)]">
              <div data-atmos-img className="absolute inset-0 will-change-transform">
                <Image
                  src="/images/ritual-atmosphere.webp"
                  alt="A shower alcove clad in travertine with a matte black rail and hand shower"
                  fill
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative md:order-1 md:col-span-5 md:col-start-1">
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-porcelain/60">
            04 — The Ritual
          </p>
          <div className="relative min-h-[11rem] md:min-h-[22rem]">
            <div data-copy="1" className="absolute inset-0">
              <h2 className="text-[clamp(2.25rem,4.4vw,4.5rem)] font-light leading-[1.06] tracking-[-0.02em]">
                Begin the day
                <br />
                with water.
              </h2>
              <p className="mt-6 hidden max-w-sm md:block text-[15px] font-light leading-[1.8] text-porcelain/75">
                A rainfall shower turns a daily routine into a pause. Clean lines, quiet surfaces,
                and nothing to distract from the water.
              </p>
            </div>
            <div data-copy="2" className="absolute inset-0 opacity-0 motion-reduce:hidden">
              <h2 className="text-[clamp(2.25rem,4.4vw,4.5rem)] font-light leading-[1.06] tracking-[-0.02em]">
                End it in
                <br />
                warm stone.
              </h2>
              <p className="mt-6 hidden max-w-sm md:block text-[15px] font-light leading-[1.8] text-porcelain/75">
                Showers designed as part of the architecture, from the head above to the surfaces
                around you.
              </p>
              <a
                href="#"
                className="mt-8 inline-block border border-porcelain/60 px-7 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-porcelain hover:text-ink"
              >
                View showers
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
