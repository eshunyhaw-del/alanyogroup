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
    name: "Freestanding Baths",
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
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  /** Price in pesewas (1 GHS = 100 pesewas). null means the price is not yet confirmed. */
  pricePesewas: number | null;
  image?: string;
  imageAlt?: string;
  /** True for development-only demo entries. They never ship to production. */
  isSample?: boolean;
};

// Demo entries exist only in development so the cart and checkout can be exercised. Their
// names, summaries and prices are NOT real catalogue data. In production this list is empty
// until the Django catalogue API supplies products.
const sampleProducts: Product[] = [
  {
    slug: "sample-water-closet",
    name: "Sample Water Closet",
    categorySlug: "water-closets",
    summary: "Demonstration entry for layout testing. Not a real product.",
    pricePesewas: 100000,
    image: "/images/col-water-closets.webp",
    imageAlt: "Atmosphere photograph of a wall-hung water closet",
    isSample: true,
  },
  {
    slug: "sample-vanity-cabinet",
    name: "Sample Vanity Cabinet",
    categorySlug: "vanity-cabinets",
    summary: "Demonstration entry for layout testing. Not a real product.",
    pricePesewas: 250000,
    image: "/images/col-vanities.webp",
    imageAlt: "Atmosphere photograph of a walnut vanity",
    isSample: true,
  },
  {
    slug: "sample-freestanding-bath",
    name: "Sample Freestanding Bath",
    categorySlug: "freestanding-baths",
    summary: "Demonstration entry with no confirmed price. Not a real product.",
    pricePesewas: null,
    image: "/images/col-baths.webp",
    imageAlt: "Atmosphere photograph of a freestanding bath",
    isSample: true,
  },
];

export function getProducts(): Product[] {
  return process.env.NODE_ENV === "development" ? sampleProducts : [];
}

export function getProduct(slug: string) {
  return getProducts().find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function formatGHS(pesewas: number) {
  return new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(pesewas / 100);
}
