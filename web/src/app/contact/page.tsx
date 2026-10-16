import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Contact — Alanyo Group" };

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        kicker="Contact"
        title="Let us help you compose the room."
        intro="Tell us about your project and we will come back to you."
      />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <ContactForm />
      </div>
    </main>
  );
}
