"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/catalog";

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product.inStock) {
    return (
      <div>
        <p className="mb-5 text-[13px] text-warm">Currently out of stock.</p>
        <Link
          href={`/contact?product=${encodeURIComponent(product.slug)}`}
          className="inline-block border border-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet hover:bg-ink hover:text-porcelain"
        >
          Ask about availability
        </Link>
      </div>
    );
  }

  if (product.pricePesewas === null) {
    return (
      <Link
        href={`/contact?product=${encodeURIComponent(product.slug)}`}
        className="inline-block border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink"
      >
        Enquire about this piece
      </Link>
    );
  }

  const price = product.pricePesewas;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-ink/30" role="group" aria-label="Quantity">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="h-14 w-12 text-lg"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span aria-live="polite" className="w-8 text-center text-[15px]">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="h-14 w-12 text-lg"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink"
          onClick={() => {
            add({ slug: product.slug, name: product.name, pricePesewas: price, image: product.image }, qty);
            setAdded(true);
          }}
        >
          Add to cart
        </button>
      </div>
      {added && (
        <p role="status" className="mt-5 text-[13px] text-warm">
          Added.{" "}
          <Link href="/cart" className="border-b border-ink/50 text-ink">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
