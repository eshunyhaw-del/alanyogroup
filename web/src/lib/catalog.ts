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

export function productsIn(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function formatGHS(pesewas: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: 0 }).format(
    pesewas / 100,
  );
}
