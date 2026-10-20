"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/PageHeader";
import { useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/catalog";

export function CartView() {
  const { lines, subtotalPesewas, setQty, remove } = useCart();

  if (lines.length === 0) {
    return (
      <div className="max-w-xl border-t border-stone pt-10">
        <p className="text-[15px] font-light leading-[1.8] text-ink/75">Your cart is empty.</p>
        <div className="mt-8">
          <ButtonLink href="/collections">Browse collections</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-8">
      <ul className="divide-y divide-stone border-y border-stone md:col-span-8">
        {lines.map((l) => (
          <li key={l.slug} className="flex gap-5 py-6">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-white">
              {l.image && <Image src={l.image} alt="" fill sizes="96px" className="object-contain p-1" />}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-4">
                <Link href={`/products/${l.slug}`} className="text-lg font-light tracking-tight">
                  {l.name}
                </Link>
                <span className="text-[15px]">{formatGHS(l.pricePesewas * l.qty)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center border border-ink/30" role="group" aria-label={`Quantity for ${l.name}`}>
                  <button type="button" aria-label="Decrease quantity" className="h-10 w-10" onClick={() => setQty(l.slug, l.qty - 1)}>
                    −
                  </button>
                  <span className="w-7 text-center text-[14px]">{l.qty}</span>
                  <button type="button" aria-label="Increase quantity" className="h-10 w-10" onClick={() => setQty(l.slug, l.qty + 1)}>
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.18em] text-warm hover:text-ink"
                  onClick={() => remove(l.slug)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="md:col-span-4 md:col-start-9">
        <div className="bg-stone p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Summary</h2>
          <dl className="mt-6 space-y-3 text-[15px] font-light">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatGHS(subtotalPesewas)}</dd>
            </div>
            <div className="flex justify-between text-warm">
              <dt>Delivery</dt>
              <dd>
                <Link href="/delivery" className="border-b border-ink/30 hover:border-ink">
                  See shipping policy
                </Link>
              </dd>
            </div>
          </dl>
          <div className="mt-8">
            <ButtonLink href="/checkout">Checkout</ButtonLink>
          </div>
          <p className="mt-6 text-[12px] leading-[1.7] text-warm">
            Orders of GHS 16,000 or more qualify for free delivery within Greater Accra. No account needed. Final prices are confirmed by our server when you pay.
          </p>
        </div>
      </aside>
    </div>
  );
}
