import catalogData from "@/data/catalog.json";

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
};

// Category names come from the business brief. Descriptions stay general: no specifications,
// materials or claims are stated until the client supplies catalogue content.
export const categories: Category[] = [
  {
    slug: "water-closets",
    name: "Water Closets",
    blurb: "Considered forms for the most private room in the house.",
    image: "/images/col-water-closets.webp",
    imageAlt: "A wall-hung water closet and basin in a white marble bathroom",
  },
  {
    slug: "vanity-cabinets",
    name: "Vanity Cabinets",
    blurb: "Cabinetry composed to sit within the architecture of the room.",
    image: "/images/col-vanities.webp",
    imageAlt: "A walnut vanity with twin basins beneath arched mirrors",
  },
  {
    slug: "freestanding-baths",
    name: "Baths",
    blurb: "A quiet centrepiece for the bathroom.",
    image: "/images/col-baths.webp",
    imageAlt: "A freestanding bath beside a tiled wall in soft daylight",
  },
  {
    slug: "rainfall-showers",
    name: "Rainfall Showers",
    blurb: "Showers and shower systems designed as part of the room.",
    image: "/images/col-showers.webp",
    imageAlt: "A rainfall shower head releasing water against a dark wall",
  },
  {
    slug: "wash-basins",
    name: "Wash Basins",
    blurb: "Basins that hold their shape and their light.",
    image: "/images/col-basins.webp",
    imageAlt: "Raking light across the curve of a basin in a warm room",
  },
  {
    slug: "kitchen",
    name: "Kitchen Sinks & Fixtures",
    blurb: "Sinks and taps for a kitchen that is cooked in and lived in.",
    image: "/images/col-kitchen.webp",
    imageAlt: "A stainless sink with a matte black tap in a timber and stone kitchen",
  },
  {
    slug: "water-heaters",
    name: "Water Heaters",
    blurb: "Reliable hot water, quietly installed.",
  },
];

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
  /** Photographs have not been supplied yet. Products render a placeholder until they are. */
  image?: string;
  imageAlt?: string;
};

// Interim source: data/catalog.json is generated from the WooCommerce export by
// tools/import_woocommerce.py. It is replaced by the Django catalogue API later.
const products = catalogData as unknown as Product[];

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
