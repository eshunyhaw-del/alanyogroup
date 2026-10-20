export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  /** "contain" shows a product photograph whole on white; the default crops lifestyle photography to fill. */
  fit?: "cover" | "contain";
  /** "dark" for photographs dark enough that the header and WhatsApp icon should switch to light. */
  tone?: "dark";
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
    name: "Bathtubs",
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
    tone: "dark",
  },
  {
    slug: "wash-basins",
    name: "Wash Basins",
    blurb: "Basins that hold their shape and their light.",
    image: "/images/col-basins.webp",
    imageAlt: "Raking light across the curve of a basin in a warm room",
    tone: "dark",
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
    image: "/products/15l-electric-water-heater-with-elbc-protector-1.webp",
    imageAlt: "A white electric water heater with a digital temperature display",
    fit: "contain",
  },
];
