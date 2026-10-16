"use client";

import { ButtonLink } from "@/components/PageHeader";
import { Field, TextArea } from "@/components/Field";
import { useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/catalog";

export function CheckoutForm() {
  const { lines, subtotalPesewas } = useCart();

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
    <form
      className="grid gap-12 md:grid-cols-12 md:gap-8"
      onSubmit={(e) => {
        // Payment is wired in the payments step: the server creates the order, re-prices it,
        // and initialises Paystack. Nothing is sent from here yet.
        e.preventDefault();
      }}
    >
      <div className="space-y-10 md:col-span-7">
        <fieldset className="space-y-8">
          <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Contact</legend>
          <Field label="Full name" name="name" autoComplete="name" required />
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" autoComplete="email" required hint="Your confirmation is sent here." />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" required hint="For delivery coordination." />
          </div>
        </fieldset>

        <fieldset className="space-y-8">
          <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Delivery</legend>
          <Field label="Address" name="address" autoComplete="street-address" required />
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label="Town or city" name="city" autoComplete="address-level2" required />
            <Field label="Region" name="region" autoComplete="address-level1" required />
          </div>
          <TextArea label="Delivery notes" name="notes" />
        </fieldset>
      </div>

      <aside className="md:col-span-4 md:col-start-9">
        <div className="bg-stone p-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Your order</h2>
          <ul className="mt-6 space-y-3 text-[14px] font-light">
            {lines.map((l) => (
              <li key={l.slug} className="flex justify-between gap-4">
                <span>
                  {l.name} × {l.qty}
                </span>
                <span>{formatGHS(l.pricePesewas * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-ink/15 pt-6 text-[15px] font-light">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatGHS(subtotalPesewas)}</dd>
            </div>
            <div className="flex justify-between text-warm">
              <dt>Delivery</dt>
              <dd>To be confirmed</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled
            className="mt-8 w-full cursor-not-allowed border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain opacity-40"
          >
            Pay with Paystack
          </button>
          <p className="mt-5 text-[12px] leading-[1.7] text-warm">
            Payment is not switched on yet. When it is, you will pay securely with Paystack and your order is
            confirmed only after our server verifies the payment.
          </p>
        </div>
      </aside>
    </form>
  );
}
