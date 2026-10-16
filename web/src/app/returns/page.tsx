import type { Metadata } from "next";
import { PendingPage } from "@/components/PendingPage";

export const metadata: Metadata = { title: "Returns — Alanyo Group" };

export default function Page() {
  return <PendingPage kicker="Support" title="Returns" />;
}
