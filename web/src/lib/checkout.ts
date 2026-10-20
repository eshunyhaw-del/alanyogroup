// Browser side of checkout. It sends only product slugs and quantities: prices are decided by the server,
// and an order is "paid" only when the server has verified it with Paystack.

export const ORDER_REFERENCE = /^ALY-[0-9A-F]{24}$/;

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Central",
  "Eastern",
  "Western",
  "Western North",
  "Volta",
  "Oti",
  "Northern",
  "Savannah",
  "North East",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
];

export type Fulfilment = "delivery" | "pickup";

export type CheckoutFields = {
  fulfilment: Fulfilment;
  /** Slug of the showroom to collect from. Only used for pickup. */
  pickup_showroom: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  notes: string;
  consent: boolean;
  /** Honeypot. A real visitor never sees or fills this. */
  website: string;
};

export type FieldErrors = Partial<Record<keyof CheckoutFields | "items", string>>;

export type CheckoutResult =
  | { ok: true; authorizationUrl: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors; unavailable?: string[]; rotateKey: boolean };

/** Paystack's hosted page is the only place a customer is ever sent to pay. */
export function isPaystackUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.paystack.com";
  } catch {
    return false;
  }
}

export function validateFields(f: CheckoutFields): FieldErrors {
  const errors: FieldErrors = {};
  const phone = f.phone.replace(/[\s\-().]/g, "");
  if (f.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^(0\d{9}|233\d{9}|\+[1-9]\d{7,14})$/.test(phone)) errors.phone = "Enter a valid phone number, for example 053 197 8362.";
  if (f.fulfilment === "pickup") {
    if (!f.pickup_showroom) errors.pickup_showroom = "Choose which showroom you will collect from.";
  } else {
    if (f.address.trim().length < 5) errors.address = "Enter your delivery address.";
    if (f.city.trim().length < 2) errors.city = "Enter your town or city.";
    if (!GHANA_REGIONS.includes(f.region)) errors.region = "Choose your region.";
  }
  if (!f.consent) errors.consent = "Please accept the policies to continue.";
  return errors;
}

export async function startCheckout(
  items: { slug: string; quantity: number }[],
  fields: CheckoutFields,
  idempotencyKey: string,
): Promise<CheckoutResult> {
  let response: Response;
  try {
    response = await fetch("/api/v1/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({ items, ...fields }),
      credentials: "omit",
    });
  } catch {
    return { ok: false, message: "We could not reach the server. Check your connection and try again.", rotateKey: false };
  }

  let body: Record<string, unknown> = {};
  try {
    body = await response.json();
  } catch {
    /* non-JSON error page */
  }

  if (response.ok) {
    const url = typeof body.authorization_url === "string" ? body.authorization_url : "";
    if (url && isPaystackUrl(url)) return { ok: true, authorizationUrl: url };
    return { ok: false, message: "This order could not be started. Please try again.", rotateKey: true };
  }
  if (response.status === 400) {
    const fieldErrors: FieldErrors = {};
    for (const [key, value] of Object.entries(body)) {
      if (Array.isArray(value) && typeof value[0] === "string") fieldErrors[key as keyof FieldErrors] = value[0];
    }
    return { ok: false, message: "Please check the highlighted details.", fieldErrors, rotateKey: false };
  }
  if (response.status === 409) {
    const unavailable = Array.isArray(body.unavailable) ? (body.unavailable as string[]) : [];
    return { ok: false, message: "Some items are no longer available to buy online.", unavailable, rotateKey: false };
  }
  if (response.status === 429) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again.", rotateKey: false };
  }
  return { ok: false, message: "We could not start the payment. Please try again in a moment.", rotateKey: true };
}

export type OrderStatus = {
  reference: string;
  /** Short code the customer quotes: shown at a showroom for pickup, sent on WhatsApp for delivery. */
  code: string;
  fulfilment: Fulfilment;
  pickup_showroom: string;
  status: "pending" | "paid" | "failed" | "review";
  currency: string;
  total_pesewas: number;
  items: { name: string; quantity: number; line_total_pesewas: number }[];
};

/** Ask our server to verify the order with Paystack. The page never decides the outcome itself. */
export async function verifyOrder(reference: string): Promise<OrderStatus | null> {
  if (!ORDER_REFERENCE.test(reference)) return null;
  try {
    const response = await fetch(`/api/v1/orders/${reference}/verify`, { method: "POST", credentials: "omit" });
    if (response.status === 404) return null;
    return (await response.json()) as OrderStatus;
  } catch {
    return null;
  }
}
