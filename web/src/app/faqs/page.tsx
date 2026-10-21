import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, FaqList } from "@/components/Faq";
import { PageHeader } from "@/components/PageHeader";
import { allFaqGroups } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs | Alanyo Group",
  description:
    "Answers about ordering, delivery in Accra, showroom pickup, returns, the 5-year warranty and our Weija and East Legon showrooms.",
  alternates: { canonical: "/faqs" },
};

export default function FaqsPage() {
  return (
    <main>
      <PageHeader
        kicker="Support"
        title="Frequently asked questions"
        intro="Quick answers about ordering, delivery, returns, the warranty and our showrooms. Can't find what you need? Contact us and we will help."
      />
      <FaqJsonLd faqs={allFaqGroups.flatMap((g) => g.faqs)} />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        {allFaqGroups.map((g) => (
          <FaqList key={g.title} faqs={g.faqs} title={g.title} schema={false} />
        ))}
        <p className="border-t border-stone pt-10 text-[15px] font-light text-ink/80">
          Still have a question?{" "}
          <Link href="/contact" className="border-b border-ink/40 text-ink hover:border-ink">
            Contact us
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
