"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/categories";

type Catalog = typeof import("@/lib/catalog");
type Product = ReturnType<Catalog["getProducts"]>[number];

const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

// Words customers use for the same thing. Each typed word also matches its equivalents.
const SYNONYMS: Record<string, string[]> = {
  toilet: ["closet", "wc"],
  wc: ["closet", "toilet"],
  closet: ["wc", "toilet"],
  tub: ["bath", "bathtub"],
  bathtub: ["bath", "tub"],
  bath: ["bathtub", "tub"],
  geyser: ["heater"],
  heater: ["geyser"],
  cabinet: ["vanity"],
  vanity: ["cabinet"],
};

/** Every word typed (or an equivalent) must appear in the product's searchable text. Name matches rank first. */
function search(products: Product[], query: string): Product[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored: { p: Product; score: number }[] = [];
  for (const p of products) {
    const name = fold(p.name);
    const nameTokens = name.split(/[^a-z0-9]+/);
    const sku = fold(p.sku ?? "");
    const rest = fold([categoryName(p.categorySlug), ...p.specs.map((s) => s.value), p.summary].join(" "));
    let score = 0;
    let ok = true;
    for (const w of words) {
      let best = 0;
      for (const alt of [w, ...(SYNONYMS[w] ?? [])]) {
        const own = alt === w ? 0 : -1; // an exact word outranks its synonym
        let s = 0;
        if (name.startsWith(alt)) s = 5;
        else if (nameTokens.some((t) => t.startsWith(alt))) s = 4;
        else if (name.includes(alt)) s = 3;
        else if (sku.includes(alt)) s = 3;
        else if (rest.includes(alt)) s = 1;
        if (s > 0) best = Math.max(best, s + own);
      }
      if (best === 0) {
        ok = false;
        break;
      }
      score += best;
    }
    if (ok) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name)).map((s) => s.p);
}

export function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The product catalogue is a separate chunk, fetched the first time search is opened.
  useEffect(() => {
    let live = true;
    import("@/lib/catalog").then((m) => live && setCatalog(m));
    inputRef.current?.focus();
    return () => {
      live = false;
    };
  }, []);

  const results = catalog && query.trim() ? search(catalog.getProducts(), query) : [];
  const typed = query.trim().length > 0;

  return (
    <div id="search-panel" role="search" className="border-t border-stone">
      <div className="mx-auto max-w-[1800px] px-5 pb-10 pt-6 sm:px-8 lg:px-14 lg:pb-14 lg:pt-10">
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          id="site-search"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          autoComplete="off"
          enterKeyHint="search"
          className="w-full border-0 border-b border-ink/30 bg-transparent py-3 text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-tight text-ink outline-none placeholder:text-ink/35 focus:border-ink focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />

        <p aria-live="polite" className="mt-4 text-[12px] text-warm">
          {!typed
            ? "Search by name, model or collection, for example “wall-hung” or “vanity 80cm”."
            : !catalog
              ? "Searching…"
              : results.length === 0
                ? "No products found. Try a different word."
                : `${results.length} ${results.length === 1 ? "product" : "products"} found`}
        </p>

        {!typed && (
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px] uppercase tracking-[0.16em]">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  onClick={onNavigate}
                  className="border-b border-transparent hover:border-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 && (
          <ul className="mt-6 max-h-[min(60svh,34rem)] divide-y divide-stone overflow-y-auto pr-1">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  onClick={onNavigate}
                  className="flex items-center gap-5 py-4 transition-opacity hover:opacity-70"
                >
                  <span className="relative block h-16 w-14 shrink-0 overflow-hidden bg-white">
                    {p.image && <Image src={p.image} alt="" fill sizes="56px" className="object-contain p-1" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-light">{p.name}</span>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-warm">
                      {categoryName(p.categorySlug)}
                      {p.sku ? ` · ${p.sku}` : ""}
                      {!p.inStock ? " · Out of stock" : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-[14px]">
                    {p.pricePesewas === null ? "" : catalog!.formatGHS(p.pricePesewas)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
