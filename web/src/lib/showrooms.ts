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

/** Supplied from the Weija listing and applied to both showrooms at the owner's instruction. */
export const showroomHours = [
  { days: "Monday to Saturday", time: "8 am – 5 pm" },
  { days: "Sunday", time: "Closed" },
];

// The East Legon telephone has not been supplied, so none is shown for it.
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
