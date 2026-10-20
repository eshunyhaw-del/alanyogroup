"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/categories";

const noopSubscribe = () => () => {};
// False during server render and hydration, true afterwards, so client-only values never mismatch.
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const links = [
  { label: "Showrooms", href: "/showroom" },
  { label: "Materials", href: "/materials" },
  { label: "About", href: "/about" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform duration-300 ease-quiet ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  // The path a menu was opened on. A menu counts as open only while the page is still that path,
  // so navigating closes it without an effect.
  const [shopAt, setShopAt] = useState<string | null>(null);
  const [mobileShop, setMobileShop] = useState(false);
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const count = useHydrated() ? cartCount : 0;
  const onHome = pathname === "/";
  const shopOpen = shopAt === pathname;
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open && !shopOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShopAt(null);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (shopOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) setShopAt(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = "";
    };
  }, [open, shopOpen]);

  const light = onHome && !(solid || open || shopOpen);
  const closeAll = () => {
    setOpen(false);
    setShopAt(null);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color] duration-500 ease-quiet ${
        light ? "bg-transparent text-white" : "bg-porcelain text-ink"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto grid h-20 max-w-[1800px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-14"
      >
        <ul className="hidden items-center gap-9 text-[11px] font-medium uppercase tracking-[0.18em] xl:flex">
          <li>
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className="opacity-90 transition-opacity hover:opacity-60"
            >
              Home
            </Link>
          </li>
          <li>
            <button
              type="button"
              aria-expanded={shopOpen}
              aria-controls="shop-menu"
              onClick={() => setShopAt(shopOpen ? null : pathname)}
              className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-60"
            >
              Shop
              <Chevron open={shopOpen} />
            </button>
          </li>
          {links.map((l) => (
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
          onClick={() => {
            setShopAt(null);
            setOpen((v) => !v);
          }}
        >
          {open ? "Close" : "Menu"}
        </button>

        <Link href="/" aria-label="Alanyo Group, home" className="flex items-center gap-3 justify-self-center">
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

      {shopOpen && (
        <div id="shop-menu" className="hidden border-t border-stone xl:block">
          <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-8 px-14 pb-14 pt-10">
            <p className="col-span-2 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Collections</p>
            <ul className="col-span-6 grid grid-cols-2 gap-x-10 gap-y-5 text-[22px] font-light tracking-tight">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    onClick={closeAll}
                    className="inline-block border-b border-transparent transition-colors hover:border-ink"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-3 col-start-10 self-end text-right">
              <Link
                href="/collections"
                onClick={closeAll}
                className="border-b border-ink/60 pb-1 text-[11px] font-medium uppercase tracking-[0.2em] hover:opacity-60"
              >
                View all collections
              </Link>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-stone bg-porcelain px-5 pb-10 pt-8 sm:px-8 xl:hidden"
        >
          <ul className="flex flex-col gap-6 text-2xl font-light tracking-tight">
            <li>
              <Link href="/" onClick={closeAll}>
                Home
              </Link>
            </li>
            <li>
              <button
                type="button"
                aria-expanded={mobileShop}
                aria-controls="mobile-shop"
                onClick={() => setMobileShop((v) => !v)}
                className="flex w-full items-center justify-between"
              >
                Shop
                <Chevron open={mobileShop} />
              </button>
              {mobileShop && (
                <ul id="mobile-shop" className="mt-5 flex flex-col gap-4 border-l border-stone pl-5 text-lg">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/collections/${c.slug}`} onClick={closeAll}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/collections" onClick={closeAll} className="text-warm">
                      View all collections
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {links.map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={closeAll}>
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
