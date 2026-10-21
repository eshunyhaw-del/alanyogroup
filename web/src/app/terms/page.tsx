import type { Metadata } from "next";
import { PendingPage } from "@/components/PendingPage";

export const metadata: Metadata = { title: "Terms | Alanyo Group" };

export default function Page() {
  return <PendingPage kicker="Legal" title="Terms" />;
}
