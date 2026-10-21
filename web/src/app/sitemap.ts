import type { MetadataRoute } from "next";
import { categories, getProducts } from "@/lib/catalog";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://alanyogroup.vercel.app").replace(/\/$/, "");

// Cart, checkout and order pages are deliberately left out: they are private to the customer.
const pages = ["", "/about", "/showroom", "/abroad", "/projects", "/faqs", "/delivery", "/returns", "/warranty", "/privacy", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}` })),
    ...categories.map((c) => ({ url: `${SITE}/collections/${c.slug}` })),
    ...getProducts().map((p) => ({ url: `${SITE}/products/${p.slug}` })),
  ];
}
