"""Convert a WooCommerce product export (CSV) into the storefront catalogue JSON.

Usage:
    python tools/import_woocommerce.py <export.csv>

Writes:
    web/src/data/catalog.json      cleaned products for the storefront
    tools/catalog-review.md        data problems a human should confirm

This is an interim bridge. The same cleaning rules move into the Django importer when the
catalogue API is built. Nothing here invents data: prices, stock flags, brands and text come
from the export. Cleaning only strips emoji and SEO filler from titles, and maps
WooCommerce categories onto the storefront's seven.
"""

import csv
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "web" / "src" / "data" / "catalog.json"
REVIEW = ROOT / "tools" / "catalog-review.md"

SEP = "–"  # the export separates product name from tagline with an en dash
EMOJI = re.compile("[🀀-🫿☀-➿️‍]+")
SKIP_ATTRS = {"years"}  # internal tag, not customer-facing


def slugify(text: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return text or "product"


def clean_title(raw: str) -> str:
    t = html.unescape(raw).strip()
    # Keep the product name before the tagline.
    t = t.split(" " + SEP + " ")[0]
    t = t.split(" | ")[0].strip()
    t = re.sub(r"^(Buy|Shop)\s+", "", t, flags=re.I)
    t = re.sub(r"\s+(in|for sale in)\s+(Ghana|Accra)\b.*$", "", t, flags=re.I)
    t = re.sub(r"([a-z])([A-Z][a-z])", r"\1 \2", t)  # fixes run-together words such as "SetTranQ"
    t = re.sub(r"\s{2,}", " ", t).strip(" -–—")
    return t[:1].upper() + t[1:] if t else t


def strip_html(s: str) -> str:
    s = s.replace("\\n", "\n")
    s = re.sub(r"<\s*br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</(p|li|h\d|div|tr)>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace(" ", " ")
    s = EMOJI.sub("", s)
    s = re.sub(r"[ \t\xa0]+", " ", s)
    return re.sub(r"\n\s*\n+", "\n", s).strip()


def features(short_html: str) -> list[str]:
    items = re.findall(r"<li[^>]*>(.*?)</li>", short_html.replace("\\n", " "), flags=re.S | re.I)
    out = []
    for i in items:
        t = strip_html(i).replace("\n", " ").strip(" :")
        if t:
            out.append(t)
    return out


def category_for(name: str, cats: str) -> str:
    n = name.lower()
    c = [x.strip().lower() for x in cats.split(",")]
    if "water heater" in n:
        return "water-heaters"
    if "vanity" in n or "mirror cabinet" in n or "cabinet" in c:
        return "vanity-cabinets"
    if "shower > bathtub" in c or "bathtub" in n:
        return "freestanding-baths"
    if "water closet" in c or "toilet" in n or " wc" in n or n.endswith("wc"):
        return "water-closets"
    if "kitchen sink" in c or "kitchen sink tap" in c:
        return "kitchen"
    if "shower" in c:
        return "rainfall-showers"
    if "wash hand basin" in c:
        return "wash-basins"
    return "uncategorised"


def money(x: str):
    try:
        return round(float(x) * 100)
    except ValueError:
        return None


def main(path: str):
    rows = list(csv.DictReader(open(path, encoding="utf-8-sig", newline="")))
    products, issues = [], []
    seen: dict[str, int] = {}

    for r in rows:
        raw_name = r["Name"]
        name = clean_title(raw_name)
        pid = r["ID"]
        sku = r["SKU"].replace(" ", " ").strip()

        if re.fullmatch(r"[a-z0-9-]+", name) and "-" in name:
            issues.append(f"[{pid}] Name looks like a URL slug, not a title: `{raw_name}`. Needs a proper name.")
            name = name.replace("-", " ").title()

        regular, sale = money(r["Regular price"]), money(r["Sale price"])
        price = sale if sale is not None else regular
        compare = regular if sale is not None and regular and regular > sale else None
        if price is None:
            issues.append(f"[{pid}] {name}: no price.")

        cat = category_for(raw_name, r["Categories"])
        original_cats = r["Categories"]
        if cat == "uncategorised":
            issues.append(f"[{pid}] {name}: could not map category `{original_cats}`.")

        # Flag likely miscategorisation relative to the original WooCommerce tags.
        oc = original_cats.lower()
        if cat == "water-heaters":
            issues.append(f"[{pid}] {name}: filed under `{original_cats}` in WooCommerce; mapped to Water Heaters by name.")
        if cat == "vanity-cabinets" and "shower > bathtub" in oc:
            issues.append(f"[{pid}] {name}: tagged `{original_cats}` (includes Bathtub); mapped to Vanity Cabinets by name.")

        if sku and (not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9 ._/-]*", sku) or sku in {"000"}):
            issues.append(f"[{pid}] {name}: SKU looks wrong: `{r['SKU']}`.")
        if r["SKU"] != r["SKU"].strip() or " " in r["SKU"]:
            issues.append(f"[{pid}] {name}: SKU had stray whitespace (cleaned): `{r['SKU']!r}`.")

        stock_raw = r["Stock"].strip()
        if stock_raw not in ("", "0", "1"):
            issues.append(f"[{pid}] {name}: stock quantity `{stock_raw}` looks implausible.")
        in_stock = r["In stock?"].strip() == "1"

        attrs = []
        for i in range(1, 9):
            an, av = r.get(f"Attribute {i} name", ""), r.get(f"Attribute {i} value(s)", "")
            if an and av and an.strip().lower() not in SKIP_ATTRS:
                attrs.append({"name": an.strip().title() if an.islower() else an.strip(), "value": strip_html(av)})

        desc = strip_html(r["Description"])
        paras = [p.strip() for p in desc.split("\n") if len(p.strip()) > 40]
        summary = paras[0] if paras else ""
        if len(summary) > 260:
            summary = summary[:257].rsplit(" ", 1)[0] + "…"

        images = [i for i in r["Images"].split(", ") if i.startswith("http")]
        if not images:
            issues.append(f"[{pid}] {name}: no images in export.")

        slug = slugify(name)
        seen[slug] = seen.get(slug, 0) + 1
        if seen[slug] > 1 or any(p["slug"] == slug for p in products):
            slug = f"{slug}-{pid}"
            issues.append(f"[{pid}] {name}: title duplicates another product; slug made unique with its ID.")

        products.append(
            {
                "id": int(pid),
                "slug": slug,
                "name": name,
                "sku": sku or None,
                "categorySlug": cat,
                "pricePesewas": price,
                "compareAtPesewas": compare,
                "inStock": in_stock,
                "summary": summary,
                "features": features(r["Short description"])[:10],
                "specs": attrs,
                "description": paras[:6],
                # Source URLs from the old site, kept for reference only. The storefront shows no
                # product photography until the supplied images are added.
                "legacyImageCount": len(images),
            }
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(products, indent=1, ensure_ascii=False), encoding="utf-8")

    by_cat: dict[str, int] = {}
    for p in products:
        by_cat[p["categorySlug"]] = by_cat.get(p["categorySlug"], 0) + 1
    lines = [
        "# Catalogue import review",
        "",
        f"{len(products)} products imported from `{Path(path).name}`. Items below need a human decision.",
        "",
        "## Assumptions to confirm",
        "- Prices are in Ghana cedis (GHS) and the *sale price* is the selling price; the regular price is shown struck through.",
        "- Stock comes only from the in-stock flag; quantities were not imported.",
        "- Titles were shortened by removing SEO filler (`Buy`, `in Accra`, taglines after the dash).",
        "",
        "## Products per category",
        *[f"- {k}: {v}" for k, v in sorted(by_cat.items())],
        "",
        "## Issues",
        *[f"- {i}" for i in issues],
        "",
    ]
    REVIEW.write_text("\n".join(lines), encoding="utf-8")
    print(f"{len(products)} products, {len(issues)} issues -> {OUT.relative_to(ROOT)}, {REVIEW.relative_to(ROOT)}")


if __name__ == "__main__":
    main(sys.argv[1])
