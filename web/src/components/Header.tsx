"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useEffect, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
// False during server render and hydration, true afterwards, so client-only values never mismatch.
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const primary = [
  { label: "Collections", href: "/collections" },
  { label: "Showrooms", href: "/showroom" },
  { label: "Materials", href: "/materials" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const count = useHydrated() ? cartCount : 0;
  const onHome = pathname === "/";

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

  const light = onHome && !(solid || open);

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
        <ul className="hidden gap-9 text-[11px] font-medium uppercase tracking-[0.18em] xl:flex">
          {primary.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="opacity-90 transition-opacity hover:opacity-60">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="justify-self-start text-[11px] font-medium uppercase tracking-[0.18em] xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <Link
          href="/"
          aria-label="Alanyo Group, home"
          className="flex items-center gap-3 justify-self-center"
        >
          <Image
            src={light ? "/brand/mark-porcelain.png" : "/brand/mark-colour.png"}
            alt=""
            width={675}
            height={687}
            priority
            className="h-9 w-auto"
          />
          <span className="hidden text-[13px] font-semibold uppercase tracking-[0.42em] sm:inline">Alanyo</span>
        </Link>

        <div className="flex items-center justify-end gap-6 text-[11px] font-medium uppercase tracking-[0.18em] sm:gap-9">
          <Link href="/contact" className="hidden opacity-90 transition-opacity hover:opacity-60 sm:inline">
            Enquire
          </Link>
          <Link href="/cart" className="opacity-90 transition-opacity hover:opacity-60">
            Cart <span aria-label={`${count} items`}>({count})</span>
          </Link>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-stone bg-porcelain px-5 pb-10 pt-8 sm:px-8 xl:hidden"
        >
          <ul className="flex flex-col gap-6 text-2xl font-light tracking-tight">
            {primary.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
