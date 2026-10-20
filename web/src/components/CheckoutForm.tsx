"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Field, Select, TextArea } from "@/components/Field";
import { ButtonLink } from "@/components/PageHeader";
import { useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/catalog";
import {
  GHANA_REGIONS,
  type CheckoutFields,
  type FieldErrors,
  startCheckout,
  validateFields,
} from "@/lib/checkout";

const EMPTY: CheckoutFields = {
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

export function CheckoutForm() {
  const { lines, subtotalPesewas } = useCart();
  const [fields, setFields] = useState<CheckoutFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  // One key per attempt. A double click or retry returns the same order instead of creating a second one.
  // Created on first submit, not during render, so pre-rendering stays deterministic.
  const key = useRef<string | null>(null);

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

  const set = <K extends keyof CheckoutFields>(name: K, value: CheckoutFields[K]) => {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMessage(null);
    setUnavailable([]);

    const found = validateFields(fields);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setMessage("Please check the highlighted details.");
      document.getElementById(Object.keys(found)[0])?.focus();
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

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-12 md:grid-cols-12 md:gap-8">
      <div className="space-y-10 md:col-span-7">
        <fieldset className="space-y-8">
          <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Contact</legend>
          <Field
            label="Full name"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            error={errors.name}
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              hint="Your receipt is sent here."
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              error={errors.email}
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={30}
              hint="Our team calls to confirm delivery."
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={errors.phone}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-8">
          <legend className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Delivery</legend>
          <Field
            label="Address"
            name="address"
            autoComplete="street-address"
            required
            maxLength={300}
            value={fields.address}
            onChange={(e) => set("address", e.target.value)}
            error={errors.address}
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Field
              label="Town or city"
              name="city"
              autoComplete="address-level2"
              required
              maxLength={100}
              value={fields.city}
              onChange={(e) => set("city", e.target.value)}
              error={errors.city}
            />
            <Select
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
          <TextArea
            label="Delivery notes"
            name="notes"
            maxLength={500}
            value={fields.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </fieldset>

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

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[14px] font-light leading-[1.7] text-ink/80">
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
              <dd>
                <Link href="/delivery" className="border-b border-ink/30 hover:border-ink">
                  See shipping policy
                </Link>
              </dd>
            </div>
          </dl>

          <div aria-live="polite">
            {message && (
              <div role="alert" className="mt-6 border border-ink/40 p-4 text-[13px] leading-[1.6]">
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
            className="mt-8 w-full border border-ink bg-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-porcelain transition-colors duration-500 ease-quiet hover:bg-transparent hover:text-ink disabled:cursor-wait disabled:opacity-50"
          >
            {busy ? "Connecting to Paystack…" : `Pay ${formatGHS(subtotalPesewas)} with Paystack`}
          </button>
          <p className="mt-5 text-[12px] leading-[1.7] text-warm">
            You will pay on Paystack&rsquo;s secure page. We never see or store your card or mobile money details. The
            final amount is confirmed by our server, and your order is confirmed only after the payment is verified.
          </p>
        </div>
      </aside>
    </form>
  );
}
