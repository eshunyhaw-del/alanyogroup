import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Cart — Alanyo Group" };

export default function CartPage() {
  return (
    <main>
      <PageHeader kicker="Cart" title="Your selection." />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <CartView />
      </div>
    </main>
  );
}
