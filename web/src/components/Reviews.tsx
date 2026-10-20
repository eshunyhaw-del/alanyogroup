"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

type Review = {
  author: string;
  rating: number;
  /** The reviewer's words, exactly as posted. Do not edit or embellish. */
  text: string;
  url: string;
};

const reviews: Review[] = [
  {
    author: "George Dennis Obeng",
    rating: 4,
    text: "They have good prices for bathroom stuff for the average income persons",
    url: "https://maps.app.goo.gl/ctYi3eXoeBoz7q7U9",
  },
  {
    author: "Andremat Enterprise",
    rating: 5,
    text: "My new location",
    url: "https://share.google/95AdTwzW1EbpWtl6H",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1 text-ink">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-none stroke-current opacity-30"}`}
          strokeWidth="1.2"
        >
          <path d="m10 1.8 2.4 5.2 5.7.6-4.3 3.8 1.2 5.6L10 14.2 5 17l1.2-5.6L1.9 7.6l5.7-.6L10 1.8Z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-rise]"), {
        opacity: 0,
        y: 28,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.14,
        scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="bg-stone text-ink">
      <div className="mx-auto max-w-[1800px] px-5 py-24 sm:px-8 lg:px-14 lg:py-36">
        <h2
          data-rise
          className="max-w-3xl text-[clamp(2.25rem,4.6vw,4.75rem)] font-light leading-[1.05] tracking-[-0.02em]"
        >
          What our customers say.
        </h2>

        <ul className="mt-16 grid gap-14 md:grid-cols-2 md:gap-10 lg:mt-24">
          {reviews.map((r) => (
            <li key={r.author} data-rise className="flex flex-col justify-between border-t border-ink/20 pt-8">
              <figure>
                <Stars rating={r.rating} />
                <blockquote className="mt-8 text-[clamp(1.5rem,2.6vw,2.5rem)] font-light leading-[1.25] tracking-[-0.01em]">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-warm">
                  {r.author}
                </figcaption>
              </figure>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block w-fit border-b border-ink/50 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-60"
              >
                Read on Google
                <span className="sr-only"> (review by {r.author}, opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
