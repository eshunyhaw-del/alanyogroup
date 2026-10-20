"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/motion";

// Fades and lifts its children into place as they scroll into view, and back out if the reader scrolls up.
// Reduced-motion visitors get the content as it is, with no animation.
export function RiseIn({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "header";
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const { gsap } = registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 32,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none reverse" },
      });
    });
    return () => mm.revert();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Element = Tag as any;
  return (
    <Element ref={ref} className={className}>
      {children}
    </Element>
  );
}
