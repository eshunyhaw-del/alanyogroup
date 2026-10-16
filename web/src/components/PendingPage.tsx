import { ButtonLink, PageHeader } from "@/components/PageHeader";

// Used for legal and policy pages. Alanyo Group supplies the real text; nothing is invented here.
export function PendingPage({ kicker, title }: { kicker: string; title: string }) {
  return (
    <main>
      <PageHeader kicker={kicker} title={title} />
      <div className="mx-auto max-w-[1800px] px-5 pb-32 sm:px-8 lg:px-14">
        <div className="max-w-xl border-t border-stone pt-10">
          <p className="text-[15px] font-light leading-[1.8] text-ink/75">
            This page will be published once Alanyo Group has confirmed its wording. If you have a question
            in the meantime, please get in touch.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact">Contact us</ButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}
