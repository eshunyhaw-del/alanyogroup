import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Order confirmation — Alanyo Group",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <main>
      <PageHeader kicker="Order" title="Your order." />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <Suspense fallback={<p className="text-[15px] font-light text-ink/80">Confirming your payment…</p>}>
          <OrderConfirmation />
        </Suspense>
      </div>
    </main>
  );
}
