// FAQ answers restate what the company has already published in its policies and showroom details.
// Do not add claims here that are not on the policy pages; update both together.

export type Faq = { q: string; a: string };

export const deliveryFaqs: Faq[] = [
  {
    q: "Is delivery free?",
    a: "Orders of GHS 16,000 or more qualify for free delivery within Greater Accra. Orders below GHS 16,000 are subject to a delivery fee.",
  },
  {
    q: "How long does delivery take in Accra?",
    a: "Orders within Accra are normally processed and delivered within 24 to 48 hours of being placed. Processing takes place on the first day, and delivery on the second. Public holidays and periods of high demand may cause slight delays.",
  },
  {
    q: "Do you deliver outside Accra?",
    a: "Yes. We deliver within Accra and to locations outside Accra.",
  },
  {
    q: "How are orders delivered?",
    a: "Large orders are delivered by our trucks and small orders by trusted third-party motorcycle couriers. After you place an order, our customer support team calls you to confirm your exact delivery address and arrange the delivery.",
  },
  {
    q: "Can I pay online and collect my order from a showroom?",
    a: "Yes. You can pay online and collect your order from either our Weija or East Legon showroom. Pickup is free. After you pay, you receive a collection code on screen and by email. Bring the code and a valid form of ID when you collect.",
  },
];

export const returnsFaqs: Faq[] = [
  {
    q: "Can I return an item?",
    a: "We accept returns only when an item is broken, damaged or faulty. Please contact us within 7 days of delivery or collection. We cannot accept returns for a change of mind.",
  },
  {
    q: "How do I report a broken item?",
    a: "Contact us within 7 days of delivery or collection by phone or WhatsApp on 053 197 8362, or by email. Give us your order number or collection code, with clear photos or a short video showing the problem. Please do not send the item back until we have agreed to the return.",
  },
  {
    q: "Will I get a replacement or a refund?",
    a: "If we approve your return, we will offer a replacement or, where applicable, a refund.",
  },
  {
    q: "What if my order is lost or damaged during delivery?",
    a: "Please contact us immediately. We will investigate and take appropriate action, which may include a replacement or, where applicable, a refund.",
  },
];

export const warrantyFaqs: Faq[] = [
  {
    q: "How long is the warranty?",
    a: "Your purchase is covered by a 5-year warranty from the date of purchase.",
  },
  {
    q: "What does the 5-year warranty cover?",
    a: "Faults caused by defects in materials or manufacture that arise when the product is used normally and correctly.",
  },
  {
    q: "What is not covered by the warranty?",
    a: "Misuse, abuse or neglect, incorrect installation, accidental damage, normal wear and tear, and repairs or changes made by anyone we have not authorised.",
  },
  {
    q: "How do I make a warranty claim?",
    a: "Contact us by phone or WhatsApp on 053 197 8362, or by email. Give us your order number or collection code, describe the problem and send clear photos or a short video showing the fault. We will tell you what happens next.",
  },
];

export const showroomFaqs: Faq[] = [
  {
    q: "Where are the Alanyo Group showrooms?",
    a: "We have two showrooms in Accra: one in Weija (Gbawe) and one in East Legon.",
  },
  {
    q: "What are the showroom opening hours?",
    a: "Both showrooms are open Monday to Saturday, 8 am to 5 pm. They are closed on Sunday.",
  },
  {
    q: "How do I contact the showrooms?",
    a: "Call or WhatsApp 053 197 8362. Each showroom also has its own email address, listed on the Showrooms page.",
  },
];

export const projectFaqs: Faq[] = [
  {
    q: "Do you supply fixtures for larger projects?",
    a: "Yes. We work with home builders and owners, real estate developers, hotels and serviced apartments, and offices and commercial buildings. Talk to us early in your project.",
  },
  {
    q: "What should I send when I enquire about a project?",
    a: "The type of project and where it is, the products or collections you need with quantities if you know them, your timeline, and plans or drawings if you have them. Our team will review them and come back to you with pricing and availability.",
  },
];

export const generalFaqs: Faq[] = [
  {
    q: "Do I need an account to order?",
    a: "No. You can check out as a guest. You only need your name, phone number and delivery or pickup details.",
  },
  {
    q: "How do I pay?",
    a: "You pay online at checkout, in Ghana cedis (GHS), through Paystack. Your order is confirmed once your payment is confirmed.",
  },
];

export const allFaqGroups: { title: string; href: string; faqs: Faq[] }[] = [
  { title: "Ordering and payment", href: "/cart", faqs: generalFaqs },
  { title: "Delivery and pickup", href: "/delivery", faqs: deliveryFaqs },
  { title: "Returns", href: "/returns", faqs: returnsFaqs },
  { title: "5-year warranty", href: "/warranty", faqs: warrantyFaqs },
  { title: "Showrooms", href: "/showroom", faqs: showroomFaqs },
  { title: "Major projects", href: "/projects", faqs: projectFaqs },
];
