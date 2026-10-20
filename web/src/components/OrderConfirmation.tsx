"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/PageHeader";
import { useCart } from "@/lib/cart";
import { formatGHS } from "@/lib/catalog";
import { ORDER_REFERENCE, type OrderStatus, verifyOrder } from "@/lib/checkout";

type View = { kind: "checking" } | { kind: "order"; order: OrderStatus } | { kind: "unreachable" };

const MAX_ATTEMPTS = 6;
const RETRY_MS = 3000;

export function OrderConfirmation() {
  const params = useSearchParams();
  // Paystack returns the customer with ?reference=...&trxref=...
  const reference = params.get("reference") ?? params.get("trxref") ?? "";
  const { clear } = useCart();
  const [view, setView] = useState<View>({ kind: "checking" });
  const cleared = useRef(false);

  const valid = ORDER_REFERENCE.test(reference);

  useEffect(() => {
    if (!valid) return;
    let live = true;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout>;

    const run = async () => {
      attempt += 1;
      const order = await verifyOrder(reference);
      if (!live) return;
      if (order === null) {
        setView({ kind: attempt >= 2 ? "unreachable" : "checking" });
      } else {
        setView({ kind: "order", order });
        if (order.status === "paid" && !cleared.current) {
          cleared.current = true;
          clear(); // the order is safely recorded and paid, so the cart can be emptied
        }
        if (order.status !== "pending") return;
      }
      if (attempt < MAX_ATTEMPTS) timer = setTimeout(run, RETRY_MS);
    };
    run();
    return () => {
      live = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, valid]);

  if (!valid) {
    return (
      <Notice title="We could not find that order." body="The link may be incomplete. If you have just paid, our team will confirm your order by phone." />
    );
  }
  if (view.kind === "checking") {
    return <Notice title="Confirming your payment…" body="Please keep this page open for a moment." busy />;
  }
  if (view.kind === "unreachable") {
    return (
      <Notice
        title="We could not confirm your payment yet."
        body="Please do not pay again. If money has left your account, our team will confirm your order by phone."
      />
    );
  }

  const { order } = view;
  if (order.status === "paid") {
    return (
      <div className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Order {order.reference}</p>
        <h2 className="mt-4 text-2xl font-light tracking-tight">Thank you for your order.</h2>
        <p className="mt-6 text-[15px] font-light leading-[1.8] text-ink/80">
          Your payment has been received. A receipt has been sent to your email, and our customer support team will call
          you to confirm your delivery address. When your order arrives, the driver will ask for your name and order
          number.
        </p>
        <ul className="mt-8 divide-y divide-stone border-y border-stone text-[15px] font-light">
          {order.items.map((i) => (
            <li key={i.name} className="flex justify-between gap-6 py-3">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatGHS(i.line_total_pesewas)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-6 py-3 text-ink">
            <span>Total paid</span>
            <span>{formatGHS(order.total_pesewas)}</span>
          </li>
        </ul>
        <div className="mt-10">
          <ButtonLink href="/collections">Continue browsing</ButtonLink>
        </div>
      </div>
    );
  }
  if (order.status === "failed") {
    return (
      <Notice
        title="Your payment did not go through."
        body="You have not been charged for this order. You can return to your cart and try again."
        action={<ButtonLink href="/cart">Back to cart</ButtonLink>}
      />
    );
  }
  if (order.status === "review") {
    return (
      <Notice
        title="We are checking your payment."
        body={`Order ${order.reference}. Our team is reviewing this payment and will contact you shortly. Please do not pay again.`}
      />
    );
  }
  return (
    <Notice
      title="Your payment is still pending."
      body={`Order ${order.reference}. If you completed the payment, it can take a few minutes to confirm. You can also return to your cart.`}
      action={
        <Link href="/cart" className="border-b border-ink/50 pb-1 text-[11px] uppercase tracking-[0.2em]">
          Back to cart
        </Link>
      }
    />
  );
}

function Notice({
  title,
  body,
  busy,
  action,
}: {
  title: string;
  body: string;
  busy?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="max-w-xl" role="status" aria-busy={busy}>
      <h2 className="text-2xl font-light tracking-tight">{title}</h2>
      <p className="mt-4 text-[15px] font-light leading-[1.8] text-ink/80">{body}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
