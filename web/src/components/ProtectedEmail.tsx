"use client";

import type { EmailParts } from "@/lib/contact";
import { useHydrated } from "@/lib/useHydrated";

/**
 * An email address that scrapers reading the raw page cannot pick up. The server-rendered HTML contains only
 * "name [at] domain [dot] com". In a real browser it becomes a normal clickable mailto link as soon as the page
 * loads. The address is also never held as one string in the page's data, only as two parts.
 */
export function ProtectedEmail({ address, className }: { address: EmailParts; className?: string }) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return (
      <span className={className}>
        {address.user} [at] {address.domain.split(".").join(" [dot] ")}
      </span>
    );
  }
  const email = `${address.user}@${address.domain}`;
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
