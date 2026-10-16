"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const primary = [
  { label: "Collections", href: "#" },
  { label: "Showroom", href: "#" },
  { label: "Materials", href: "#" },
  { label: "About", href: "#" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = !(solid || open);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color] duration-500 ease-quiet ${
        light ? "bg-transparent text-white" : "bg-porcelain text-ink"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid h-20 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-14"
      >
        <ul className="hidden gap-9 text-[11px] font-medium uppercase tracking-[0.18em] lg:flex">
          {primary.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="opacity-90 transition-opacity hover:opacity-60">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="justify-self-start text-[11px] font-medium uppercase tracking-[0.18em] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <Link
          href="/"
          aria-label="Alanyo Group, home"
          className="text-[13px] font-semibold uppercase tracking-[0.42em]"
        >
          Alanyo
        </Link>

        <div className="flex items-center justify-end gap-6 text-[11px] font-medium uppercase tracking-[0.18em] sm:gap-9">
          <a href="#" className="hidden opacity-90 transition-opacity hover:opacity-60 sm:inline">
            Search
          </a>
          <a href="#" className="opacity-90 transition-opacity hover:opacity-60">
            Cart <span aria-label="0 items">(0)</span>
          </a>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-stone bg-porcelain px-5 pb-10 pt-8 sm:px-8 lg:hidden"
        >
          <ul className="flex flex-col gap-6 text-2xl font-light tracking-tight">
            {primary.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
