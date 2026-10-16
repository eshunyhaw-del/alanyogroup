import type { Metadata } from "next";
import { PendingPage } from "@/components/PendingPage";

export const metadata: Metadata = { title: "Delivery — Alanyo Group" };

export default function Page() {
  return <PendingPage kicker="Support" title="Delivery" />;
}
