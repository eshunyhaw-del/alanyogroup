// One place for the company's contact details, so the footer, contact page and enquiry pages agree.
// Held as parts, never as one "name@domain" string, so it cannot be scraped from the page data.
export type EmailParts = { user: string; domain: string };
export const SALES: EmailParts = { user: "sales", domain: "alanyogroup.com" };
export const PHONE = { display: "053 197 8362", e164: "+233531978362" };
export const WHATSAPP_URL = `https://wa.me/233531978362?text=${encodeURIComponent(
  "Hello Alanyo Group, I would like to ask about your products.",
)}`;
export const WHATSAPP_NUMBER_E164 = "233531978362"; // wa.me format: no plus sign or spaces
