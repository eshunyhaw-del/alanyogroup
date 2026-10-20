"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/catalog";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const images = product.images;

  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/5] place-items-center bg-stone md:aspect-[5/6]">
        <span className="text-[10px] uppercase tracking-[0.2em] text-warm">Photography to come</span>
      </div>
    );
  }

  const current = images[active] ?? images[0];
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-white md:aspect-[5/6]">
        <Image
          key={current.src}
          src={current.src}
          alt={`${product.name}, view ${active + 1} of ${images.length}`}
          fill
          priority={active === 0}
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-contain p-4 md:p-8"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-3" aria-label="Product views">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show view ${i + 1}`}
                aria-current={i === active}
                className={`relative block aspect-square w-full overflow-hidden bg-white transition-opacity ${
                  i === active ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="120px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
