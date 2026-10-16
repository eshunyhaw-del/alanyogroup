const columns = [
  {
    title: "Collections",
    links: ["Water Closets", "Vanity Cabinets", "Freestanding Baths", "Rainfall Showers", "Wash Basins", "Kitchen", "Water Heaters"],
  },
  { title: "Alanyo", links: ["About", "Showroom", "Materials", "Journal"] },
  { title: "Support", links: ["Contact", "Delivery", "Returns", "Warranty"] },
];

// Support links are placeholders: delivery, returns and warranty policies are the client's to supply.
export function Footer() {
  return (
    <footer className="bg-porcelain text-ink">
      <div className="mx-auto max-w-[1800px] px-5 pb-10 pt-20 sm:px-8 lg:px-14 lg:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[13px] font-semibold uppercase tracking-[0.42em]">Alanyo</p>
            <p className="mt-6 max-w-xs text-[15px] font-light leading-[1.8] text-ink/75">
              The Art of Refined Living. Luxury sanitaryware and fixtures for the bathroom and kitchen.
            </p>
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
                  <li key={l}>
                    <a href="#" className="transition-opacity hover:opacity-60">
                      {l}
                    </a>
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
              <a href="#" className="transition-opacity hover:opacity-60">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="transition-opacity hover:opacity-60">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
