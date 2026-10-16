import Link from "next/link";

export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mx-auto max-w-[1800px] px-5 pb-12 pt-36 sm:px-8 lg:px-14 lg:pb-20 lg:pt-48">
      <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.22em] text-warm">{kicker}</p>
      <h1 className="max-w-4xl text-[clamp(2.5rem,5.4vw,5.25rem)] font-light leading-[1.04] tracking-[-0.025em]">
        {title}
      </h1>
      {intro && (
        <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.8] text-ink/75">{intro}</p>
      )}
    </header>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "solid",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline";
}) {
  const base =
    "inline-block px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-quiet";
  const style =
    variant === "solid"
      ? "border border-ink bg-ink text-porcelain hover:bg-transparent hover:text-ink"
      : "border border-ink/70 hover:bg-ink hover:text-porcelain";
  return (
    <Link href={href} className={`${base} ${style}`}>
      {children}
    </Link>
  );
}
