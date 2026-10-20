// Layout for policy pages. Wording is supplied by Alanyo Group; keep edits to formatting only.
export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-stone py-10 md:grid-cols-12 md:gap-8">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.22em] text-warm md:col-span-3">{title}</h2>
      <div className="space-y-4 text-[15px] font-light leading-[1.8] text-ink/80 md:col-span-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_ul]:mt-2">
        {children}
      </div>
    </section>
  );
}
