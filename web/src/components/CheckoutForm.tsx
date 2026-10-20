"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BoxField, BoxSelect, BoxTextArea } from "@/components/Field";
import { ButtonLink } from "@/components/PageHeader";
import { type CartLine, useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/catalog";
import {
  GHANA_REGIONS,
  type CheckoutFields,
  type FieldErrors,
  type Fulfilment,
  startCheckout,
  validateFields,
} from "@/lib/checkout";
import { showroomHours, showrooms } from "@/lib/showrooms";

// From the Shipping Policy: orders of GHS 16,000 or more qualify for free delivery within Greater Accra.
const FREE_DELIVERY_PESEWAS = 16000 * 100;

const EMPTY: CheckoutFields = {
  fulfilment: "delivery",
  pickup_showroom: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  region: "",
  notes: "",
  consent: false,
  website: "",
};

function deliveryNote(
  fulfilment: Fulfilment,
  region: string,
  subtotal: number,
): { label: string; detail: string } {
  if (fulfilment === "pickup") {
    return {
      label: "Pickup · Free",
      detail:
        "Your order is available for collection once your payment is confirmed. Bring your collection code and a valid ID.",
    };
  }
  if (region === "Greater Accra" && subtotal >= FREE_DELIVERY_PESEWAS) {
    return { label: "Free", detail: "Free delivery within Greater Accra on orders of GHS 16,000 or more." };
  }
  return {
    label: region ? "Confirmed by our team" : "Enter your address",
    detail: "A delivery fee applies to orders below GHS 16,000 or outside Greater Accra. Our team confirms it when they call.",
  };
}

function OrderSummary({
  lines,
  subtotal,
  fulfilment,
  region,
}: {
  lines: CartLine[];
  subtotal: number;
  fulfilment: Fulfilment;
  region: string;
}) {
  const shipping = deliveryNote(fulfilment, region, subtotal);
  return (
    <div>
      <ul className="space-y-5">
        {lines.map((l) => (
          <li key={l.slug} className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 border border-stone bg-white">
              {l.image && <Image src={l.image} alt="" fill sizes="64px" className="object-contain p-1" />}
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] text-porcelain">
                {l.qty}
              </span>
            </div>
            <p className="flex-1 text-[14px] font-light leading-snug">{l.name}</p>
            <p className="shrink-0 text-[14px] font-light">{formatGHS(l.pricePesewas * l.qty)}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-8 space-y-3 text-[14px] font-light">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatGHS(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt>{fulfilment === "pickup" ? "Collection" : "Delivery"}</dt>
          <dd className="text-right text-warm">{shipping.label}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-stone pt-4 text-[17px]">
          <dt>Total</dt>
          <dd>
            <span className="mr-2 text-[11px] text-warm">GHS</span>
            {formatGHS(subtotal).replace(/^GH₵/, "")}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-[12px] leading-[1.7] text-warm">
        <Link href="/cart" className="border-b border-ink/30 hover:border-ink">
          Edit cart
        </Link>
        . The final amount is confirmed by our server when you pay.
      </p>
    </div>
  );
}

export function CheckoutForm() {
  const { lines, subtotalPesewas } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(EMPTY);
  const [names, setNames] = useState({ first: "", last: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  // One key per attempt. A double click or retry returns the same order instead of creating a second one.
  // Created on first submit, not during render, so pre-rendering stays deterministic.
  const key = useRef<string | null>(null);

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1800px] px-5 pb-32 pt-16 sm:px-8 lg:px-14">
        <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-light tracking-[-0.02em]">Checkout</h1>
        <div className="mt-10 max-w-xl border-t border-stone pt-10">
          <p className="text-[15px] font-light leading-[1.8] text-ink/75">Your cart is empty.</p>
          <div className="mt-8">
            <ButtonLink href="/collections">Browse collections</ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const set = <K extends keyof CheckoutFields>(name: K, value: CheckoutFields[K]) => {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const setName = (part: "first" | "last", value: string) => {
    const next = { ...names, [part]: value };
    setNames(next);
    set("name", `${next.first} ${next.last}`.trim());
  };

  const pickup = fields.fulfilment === "pickup";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMessage(null);
    setUnavailable([]);

    const found = validateFields(fields);
    if (!names.first.trim()) found.name = "Enter your first name.";
    else if (!names.last.trim()) found.name = "Enter your last name.";
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setMessage("Please check the highlighted details.");
      const firstKey = Object.keys(found)[0];
      const target =
        firstKey === "name" ? (names.first.trim() ? "last" : "first") : firstKey === "pickup_showroom" ? "showroom-weija" : firstKey;
      document.getElementById(target)?.focus();
      return;
    }

    setBusy(true);
    key.current ??= crypto.randomUUID();
    const result = await startCheckout(
      lines.map((l) => ({ slug: l.slug, quantity: l.qty })),
      fields,
      key.current,
    );
    if (result.ok) {
      // Hand over to Paystack's own page. Card and mobile money details are never entered on this site.
      window.location.assign(result.authorizationUrl);
      return;
    }
    if (result.rotateKey) key.current = null;
    setErrors(result.fieldErrors ?? {});
    setUnavailable(result.unavailable ?? []);
    setMessage(result.message);
    setBusy(false);
  }

  const shipping = deliveryNote(fields.fulfilment, fields.region, subtotalPesewas);
  const sectionTitle = "text-[17px] font-normal tracking-tight";
  const choose = (value: Fulfilment) => {
    setFields((f) => ({ ...f, fulfilment: value }));
    setErrors({});
    setMessage(null);
  };

  return (
    <form noValidate onSubmit={onSubmit} className="min-h-[calc(100svh-5rem)] md:grid md:grid-cols-2">
      {/* Phones: the order summary folds away at the top, as on most payment pages. */}
      <details className="border-b border-stone bg-white px-5 py-4 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[14px]">
          <span>Order summary</span>
          <span>{formatGHS(subtotalPesewas)}</span>
        </summary>
        <div className="pt-6">
          <OrderSummary lines={lines} subtotal={subtotalPesewas} fulfilment={fields.fulfilment} region={fields.region} />
        </div>
      </details>

      {/* Form */}
      <div className="bg-porcelain px-5 pb-20 pt-10 sm:px-8 md:px-10 md:pt-14">
        <div className="mx-auto max-w-[34rem] md:ml-auto md:mr-0 lg:mr-6">
          <Link href="/cart" className="text-[12px] text-warm hover:text-ink">
            ← Back to cart
          </Link>
          <h1 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-light tracking-[-0.02em]">Checkout</h1>

          <section className="mt-10 space-y-3" aria-labelledby="contact-title">
            <h2 id="contact-title" className={sectionTitle}>
              Contact
            </h2>
            <BoxField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              hint="Your receipt and collection or order code are sent here."
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
            />
            <BoxField
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={30}
              hint={pickup ? "Our team may call you about your order." : "Our team calls to confirm your delivery."}
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
            />
            <div className="grid grid-cols-2 gap-3">
              <BoxField
                label="First name"
                name="first"
                autoComplete="given-name"
                required
                maxLength={60}
                value={names.first}
                onChange={(e) => setName("first", e.target.value)}
                error={errors.name && !names.first.trim() ? errors.name : undefined}
              />
              <BoxField
                label="Last name"
                name="last"
                autoComplete="family-name"
                required
                maxLength={60}
                value={names.last}
                onChange={(e) => setName("last", e.target.value)}
                error={errors.name && names.first.trim() ? errors.name : undefined}
              />
            </div>
            {pickup && (
              <p className="text-[12px] text-warm">Please use your name exactly as it appears on your ID.</p>
            )}
          </section>

          <section className="mt-10" aria-labelledby="delivery-title">
            <h2 id="delivery-title" className={sectionTitle}>
              Delivery
            </h2>

            <div role="radiogroup" aria-label="How would you like to receive your order?" className="mt-3 grid grid-cols-2 gap-1 bg-stone p-1">
              {(
                [
                  ["delivery", "Delivery"],
                  ["pickup", "Pickup"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={fields.fulfilment === value}
                  onClick={() => choose(value)}
                  className={`px-4 py-3 text-[14px] transition-colors ${
                    fields.fulfilment === value ? "bg-white text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {pickup ? (
              <fieldset className="mt-5">
                <legend className="mb-3 text-[12px] text-warm">Collect from</legend>
                <div className="space-y-2">
                  {showrooms.map((s) => {
                    const selected = fields.pickup_showroom === s.slug;
                    return (
                      <label
                        key={s.slug}
                        htmlFor={`showroom-${s.slug}`}
                        className={`flex cursor-pointer items-start gap-3 border bg-white px-4 py-3 transition-colors ${
                          selected ? "border-ink" : "border-ink/25 hover:border-ink/60"
                        }`}
                      >
                        <input
                          id={`showroom-${s.slug}`}
                          type="radio"
                          name="pickup_showroom"
                          value={s.slug}
                          checked={selected}
                          onChange={() => set("pickup_showroom", s.slug)}
                          className="mt-1 h-4 w-4 shrink-0 accent-ink"
                        />
                        <span className="text-[14px] leading-snug">
                          <span className="block">{s.name}</span>
                          <span className="mt-0.5 block text-[12px] font-light text-warm">
                            {s.addressLine} · {showroomHours[0].days}, {showroomHours[0].time}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.pickup_showroom && (
                  <p role="alert" className="mt-2 text-[12px] text-ink">
                    {errors.pickup_showroom}
                  </p>
                )}
              </fieldset>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="border border-ink/25 bg-stone/40 px-3 pb-2 pt-2">
                  <span className="block text-[11px] text-warm">Country / region</span>
                  <span className="mt-0.5 block text-[15px] font-light">Ghana</span>
                </div>
                <BoxField
                  label="Address"
                  name="address"
                  autoComplete="street-address"
                  required
                  maxLength={300}
                  value={fields.address}
                  onChange={(e) => set("address", e.target.value)}
                  error={errors.address}
                />
                <div className="grid grid-cols-2 gap-3">
                  <BoxField
                    label="Town or city"
                    name="city"
                    autoComplete="address-level2"
                    required
                    maxLength={100}
                    value={fields.city}
                    onChange={(e) => set("city", e.target.value)}
                    error={errors.city}
                  />
                  <BoxSelect
                    label="Region"
                    name="region"
                    autoComplete="address-level1"
                    required
                    options={GHANA_REGIONS}
                    value={fields.region}
                    onChange={(e) => set("region", e.target.value)}
                    error={errors.region}
                  />
                </div>
              </div>
            )}

            <div className="mt-3">
              <BoxTextArea
                label={pickup ? "Order notes" : "Delivery notes"}
                name="notes"
                maxLength={500}
                value={fields.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
          </section>

          <section className="mt-10" aria-labelledby="shipping-title">
            <h2 id="shipping-title" className={sectionTitle}>
              {pickup ? "Collection method" : "Delivery method"}
            </h2>
            <div className="mt-3 border border-ink bg-white px-4 py-3">
              <div className="flex items-baseline justify-between gap-4 text-[14px]">
                <span>{pickup ? "Showroom pickup" : "Standard delivery"}</span>
                <span className="text-right">{shipping.label}</span>
              </div>
              <p className="mt-1 text-[12px] leading-[1.6] text-warm">{shipping.detail}</p>
            </div>
            <p className="mt-2 text-[12px] text-warm">
              Read our{" "}
              <Link href="/delivery" target="_blank" className="border-b border-ink/30 hover:border-ink">
                Shipping Policy
              </Link>
              .
            </p>
          </section>

          <div className="mt-8">
            <label className="flex cursor-pointer items-start gap-3 text-[13px] font-light leading-[1.7] text-ink/80">
              <input
                id="consent"
                type="checkbox"
                checked={fields.consent}
                onChange={(e) => set("consent", e.target.checked)}
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "consent-error" : undefined}
                className="mt-1.5 h-4 w-4 shrink-0 accent-ink"
              />
              <span>
                I have read and accept the{" "}
                <Link href="/privacy" target="_blank" className="border-b border-ink/40 hover:border-ink">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/delivery" target="_blank" className="border-b border-ink/40 hover:border-ink">
                  Shipping Policy
                </Link>
                , and agree to be contacted about this order.
              </span>
            </label>
            {errors.consent && (
              <p id="consent-error" role="alert" className="mt-2 text-[12px] text-ink">
                {errors.consent}
              </p>
            )}
          </div>

          {/* Honeypot: invisible to people and to screen readers; bots tend to fill it in. */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Leave this field empty
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={fields.website}
                onChange={(e) => set("website", e.target.value)}
              />
            </label>
          </div>

          <div aria-live="polite">
            {message && (
              <div role="alert" className="mt-6 border border-ink/40 bg-white p-4 text-[13px] leading-[1.6]">
                <p>{message}</p>
                {unavailable.length > 0 && (
                  <ul className="mt-2 list-disc pl-5">
                    {unavailable.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full border border-ink bg-ink px-8 py-5 text-[13px] font-medium tracking-[0.04em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink disabled:cursor-wait disabled:opacity-50"
          >
            {busy ? "Please wait…" : `Pay now · ${formatGHS(subtotalPesewas)}`}
          </button>
          <p className="mt-4 text-center text-[12px] leading-[1.7] text-warm">
            Your order is confirmed once your payment is received.
          </p>

          <nav aria-label="Policies" className="mt-10 flex gap-6 border-t border-stone pt-6 text-[12px]">
            <Link href="/privacy" target="_blank" className="border-b border-ink/30 hover:border-ink">
              Privacy
            </Link>
            <Link href="/delivery" target="_blank" className="border-b border-ink/30 hover:border-ink">
              Shipping
            </Link>
            <Link href="/returns" target="_blank" className="border-b border-ink/30 hover:border-ink">
              Returns
            </Link>
          </nav>
        </div>
      </div>

      {/* Summary */}
      <aside className="hidden border-l border-stone bg-white md:block" aria-label="Order summary">
        <div className="sticky top-20 max-w-[28rem] px-10 py-14 lg:ml-6">
          <OrderSummary lines={lines} subtotal={subtotalPesewas} fulfilment={fields.fulfilment} region={fields.region} />
        </div>
      </aside>
    </form>
  );
}
