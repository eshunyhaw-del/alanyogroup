# Catalogue import review

58 products imported from `wc-product-export-16-10-2026-1792162130197.csv`. Items below need a human decision.

## Assumptions to confirm
- Prices are in Ghana cedis (GHS) and the *sale price* is the selling price; the regular price is shown struck through.
- Stock comes only from the in-stock flag; quantities were not imported.
- Titles were shortened by removing SEO filler (`Buy`, `in Accra`, taglines after the dash).

## Products per category
- freestanding-baths: 5
- kitchen: 4
- rainfall-showers: 12
- vanity-cabinets: 17
- wash-basins: 3
- water-closets: 15
- water-heaters: 2

## Issues
- [261] Two-Piece Toilet: title duplicates another product; slug made unique with its ID.
- [285] Luxury Chrome Shower: title duplicates another product; slug made unique with its ID.
- [295] Modern Bathtub (1700 × 800 × 600 mm): stock quantity `1000` looks implausible.
- [5605] Luxurious Egg Model Water Closet: title duplicates another product; slug made unique with its ID.
- [5749] Name looks like a URL slug, not a title: `4-in-1-shower-aluminum-ghana`. Needs a proper name.
- [5755] 4-in-1 Shower Set with LED Display: title duplicates another product; slug made unique with its ID.
- [5757] 4-in-1 Shower Set: title duplicates another product; slug made unique with its ID.
- [5821] Luxury Bathroom Vanity Set (90CM): tagged `Shower > Bathtub, Wash Hand Basin` (includes Bathtub); mapped to Vanity Cabinets by name.
- [5824] Luxury Bathroom Vanity Set (120CM): SKU looks wrong: `:N-2536-120CM`.
- [5825] Luxury Bathroom Vanity Set (120CM): title duplicates another product; slug made unique with its ID.
- [5828] Luxury Bathroom Vanity Set: title duplicates another product; slug made unique with its ID.
- [5834] Luxury Bathroom Vanity Set: title duplicates another product; slug made unique with its ID.
- [5842] SUS304 Stainless Steel Kitchen Sink: SKU had stray whitespace (cleaned): `'7546\xa0'`.
- [5842] SUS304 Stainless Steel Kitchen Sink: title duplicates another product; slug made unique with its ID.
- [5900] 10L Electric Water Heater with ELBC Protector: filed under `Wash Hand Basin, Water Closet` in WooCommerce; mapped to Water Heaters by name.
- [5900] 10L Electric Water Heater with ELBC Protector: SKU looks wrong: `000`.
- [5902] Luxury Bathroom Vanity Cabinet Set (90CM): title duplicates another product; slug made unique with its ID.
- [5904] Luxury Bathroom Vanity Cabinet Set (80CM): title duplicates another product; slug made unique with its ID.
- [5909] Luxury Marble Bathroom Vanity Cabinet (80CM): title duplicates another product; slug made unique with its ID.
- [5923] 15L Electric Water Heater with ELBC Protector: filed under `Water Closet` in WooCommerce; mapped to Water Heaters by name.
