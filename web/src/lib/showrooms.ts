export type Showroom = {
  slug: string;
  name: string;
  area: string;
  /** Google plus code, exactly as supplied. */
  plusCode: string;
  addressLine: string;
  mapsUrl: string;
  /** Local display format and the international form used for tel: links. */
  phone?: { display: string; e164: string };
};

// Opening hours have not been supplied, and neither has the East Legon telephone, so none are shown.
export const showrooms: Showroom[] = [
  {
    slug: "weija",
    name: "Alanyo Group Weija Showroom",
    area: "Weija",
    plusCode: "HM2F+RCG",
    addressLine: "Gbawe, Weija",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=5.552011%2C-0.3264081",
    phone: { display: "053 197 8362", e164: "+233531978362" },
  },
  {
    slug: "east-legon",
    name: "Alanyo Group East Legon Showroom",
    area: "East Legon",
    plusCode: "MVMM+X46",
    addressLine: "East Legon, Accra",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=MVMM%2BX46%2C%20Accra",
  },
];
