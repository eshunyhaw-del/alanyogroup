"use client";

import { useEffect, useState } from "react";

// 053 197 8362 in international form, as wa.me expects (no plus sign or spaces).
const NUMBER = "233531978362";
const MESSAGE = "Hello Alanyo Group, I would like to ask about your products.";
const HREF = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

export function WhatsAppButton() {
  // On phones the button stays out of the way until the visitor starts scrolling.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Alanyo Group on WhatsApp (opens in a new tab)"
      className={`fixed z-40 flex items-center gap-3 border border-porcelain/25 bg-ink px-5 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-porcelain transition-[opacity,transform] duration-500 ease-quiet hover:bg-navy motion-reduce:transition-none
        bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2
        md:bottom-8 md:left-auto md:right-8 md:translate-x-0
        ${scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0 md:pointer-events-auto md:translate-y-0 md:opacity-100"}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
      WhatsApp
    </a>
  );
}
