import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Checkout — Alanyo Group" };

export default function CheckoutPage() {
  return (
    <main>
      <PageHeader kicker="Checkout" title="Guest checkout." intro="No account required. Tell us where to deliver." />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <CheckoutForm />
      </div>
    </main>
  );
}
