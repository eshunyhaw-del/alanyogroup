import catalogData from "@/data/catalog.json";
import productImages from "@/data/product-images.json";

import { categories, type Category } from "@/lib/categories";

export { categories };
export type { Category };

export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string | null;
  categorySlug: string;
  /** Selling price in pesewas (1 GHS = 100 pesewas). null means no price is set. */
  pricePesewas: number | null;
  /** The previous price, shown struck through when it is higher than the selling price. */
  compareAtPesewas: number | null;
  inStock: boolean;
  summary: string;
  features: string[];
  specs: { name: string; value: string }[];
  description: string[];
  /** Product photographs in display order; the first is the main image. Empty means none supplied. */
  images: { src: string; width: number; height: number }[];
  /** Main image, for cards and the cart. */
  image?: string;
  imageAlt?: string;
};

// Interim source: data/catalog.json is generated from the WooCommerce export by
// tools/import_woocommerce.py. It is replaced by the Django catalogue API later.
const imageMap = productImages as unknown as Record<string, Product["images"]>;
const products: Product[] = (catalogData as unknown as Omit<Product, "images" | "image" | "imageAlt">[]).map((p) => {
  const images = imageMap[String(p.id)] ?? [];
  return { ...p, images, image: images[0]?.src, imageAlt: p.name };
});

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

// When a collection has too few pieces to fill a "similar products" row, borrow from one that shoppers
// commonly buy alongside it.
const RELATED: Record<string, string[]> = {
  "water-closets": ["wash-basins", "vanity-cabinets"],
  "vanity-cabinets": ["wash-basins", "water-closets"],
  "wash-basins": ["vanity-cabinets", "water-closets"],
  "freestanding-baths": ["rainfall-showers", "wash-basins"],
  "rainfall-showers": ["freestanding-baths", "water-heaters"],
  kitchen: ["water-heaters"],
  "water-heaters": ["rainfall-showers", "kitchen"],
};

/**
 * Products to suggest beside this one: the same collection first (closest in price, in stock before out of
 * stock), then related collections. Never includes the product itself.
 */
export function similarProducts(product: Product, limit = 4): Product[] {
  const byCloseness = (a: Product, b: Product) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    const target = product.pricePesewas ?? 0;
    const gap = (p: Product) => Math.abs((p.pricePesewas ?? target) - target);
    return gap(a) - gap(b) || a.name.localeCompare(b.name);
  };
  const same = products.filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug).sort(byCloseness);
  if (same.length >= limit) return same.slice(0, limit);
  const related = (RELATED[product.categorySlug] ?? []).flatMap((slug) =>
    products.filter((p) => p.categorySlug === slug).sort(byCloseness),
  );
  return [...same, ...related].slice(0, limit);
}

export function productsIn(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function formatGHS(pesewas: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(
    pesewas / 100,
  );
}
