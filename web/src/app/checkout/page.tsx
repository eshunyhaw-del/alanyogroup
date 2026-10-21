import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Checkout | Alanyo Group" };

export default function CheckoutPage() {
  return (
    <main className="pt-20">
      <CheckoutForm />
    </main>
  );
}
