import type { Metadata } from "next";
import { ButtonLink, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Order confirmation — Alanyo Group" };

// Placeholder shell. Once the API exists this page looks the order up by reference and shows
// "paid" only when the server has verified the Paystack payment, never from the redirect alone.
export default function ConfirmationPage() {
  return (
    <main>
      <PageHeader
        kicker="Order"
        title="Thank you."
        intro="Order confirmation will appear here once payments are switched on. A payment is confirmed only after our server has verified it."
      />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <ButtonLink href="/collections">Continue browsing</ButtonLink>
      </div>
    </main>
  );
}
