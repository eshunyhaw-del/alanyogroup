import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { PHONE, SALES } from "@/lib/contact";
import { SOCIAL } from "@/lib/social";
import { ProtectedEmail } from "@/components/ProtectedEmail";

const columns = [
  { title: "Collections", links: categories.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })) },
  {
    title: "Alanyo Group",
    links: [
      { label: "About", href: "/about" },
      { label: "Showrooms", href: "/showroom" },
      { label: "Customers Abroad", href: "/abroad" },
      { label: "Major Projects", href: "/projects" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Delivery", href: "/delivery" },
      { label: "Returns", href: "/returns" },
      { label: "5-Year Warranty", href: "/warranty" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-porcelain text-ink">
      <div className="mx-auto max-w-[1800px] px-5 pb-10 pt-20 sm:px-8 lg:px-14 lg:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image src="/brand/logo-colour.png" alt="Alanyo Group" width={953} height={675} className="h-32 w-auto" />
            <p className="mt-6 max-w-xs text-[15px] font-light leading-[1.8] text-ink/75">
              The Art of Refined Living. Luxury sanitaryware and fixtures for the bathroom and kitchen.
            </p>
            <div className="mt-6 text-[14px] font-light leading-[1.8]">
              <ProtectedEmail address={SALES} className="block border-b border-transparent hover:border-ink w-fit" />
              <a href={`tel:${PHONE.e164}`} className="block border-b border-transparent hover:border-ink w-fit">
                {PHONE.display}
              </a>
            </div>

            <nav aria-label="Social media" className="mt-8">
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">Follow us</h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.18em]">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity hover:opacity-60"
                      >
                        {s.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="text-warm/70" aria-disabled="true">
                        {s.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {columns.map((c, i) => (
            <nav
              key={c.title}
              aria-label={c.title}
              className={i === 0 ? "md:col-span-3 md:col-start-7" : "md:col-span-2"}
            >
              <h2 className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">
                {c.title}
              </h2>
              <ul className="space-y-3 text-[15px] font-light">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-opacity hover:opacity-60">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-stone pt-8 text-[11px] uppercase tracking-[0.16em] text-warm sm:flex-row sm:justify-between">
          <p>© 2026 Alanyo Group. All rights reserved.</p>
          <ul className="flex gap-8">
            <li>
              <Link href="/privacy" className="transition-opacity hover:opacity-60">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-opacity hover:opacity-60">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
