"""Match supplied product photographs to catalogue products and prepare them for the web.

Usage:
    python tools/build_product_images.py

Reads   Assets/img/product-images/<category folder>/*  (originals, not committed)
        web/src/data/catalog.json
Writes  web/public/products/<slug>-<n>.webp            (web-sized copies, committed)
        web/src/data/product-images.json               (product id -> ordered image list)
        tools/product-images-review.md                 (unmatched files and products)

Files are named after the original product title, with " 1", " 2" ... for extra shots. The
unnumbered file is the main image. Titles that clean to the same name (e.g. three "Luxury
Bathroom Vanity Set") are told apart with RULES below, using the full original title.
"""

import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

sys.path.insert(0, str(Path(__file__).resolve().parent))
from import_woocommerce import clean_title  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Assets" / "img" / "product-images"
OUT_DIR = ROOT / "web" / "public" / "products"
OUT_JSON = ROOT / "web" / "src" / "data" / "product-images.json"
REVIEW = ROOT / "tools" / "product-images-review.md"
CATALOG = ROOT / "web" / "src" / "data" / "catalog.json"

MAX_PER_PRODUCT = 5
LONG_EDGE = 1400

# (regex on the normalised full title, product id). First match wins.
RULES = [
    (r"sus304.*durable", 5842),
    (r"sus304.*strong", 5839),
    (r"^buy 4-in-1 shower set with led", 5753),
    (r"^4-in-1 shower set with led", 5755),
    (r"^4-in-1 shower set – durable", 5751),
    (r"^buy 4-in-1 shower set – modern", 5757),
    (r"^4-in-1-shower-aluminum-ghana$", 5749),
    (r"^buy luxury chrome shower – modern design & affordable", 285),
    (r"^luxury chrome shower – modern design & reliable", 254),
    (r"^buy luxury bathroom vanity cabinet set \(80cm\) – led mirror & marble", 5904),
    (r"^buy luxury bathroom vanity cabinet set \(80cm\) – mirror cabinet", 5897),
    (r"^buy luxury bathroom vanity set \(120cm\)", 5824),
    (r"^luxury bathroom vanity set \(120cm\)", 5825),
    (r"extra cabinet", 5828),
    (r"double ceramic basin & cabinet \(120cm\)", 5834),
    (r"^buy luxury bathroom vanity set – led mirror, rock slab & double ceramic basins$", 5819),
    (r"^buy luxury marble", 5906),
    (r"^luxury marble", 5909),
    (r"^luxury bathroom vanity cabinet set \(90cm\) – mirror cabinet", 5899),
    (r"model 1204\)", 5584),
    (r"model 1210\)", 5605),
    (r"^buy two-piece toilet", 261),
    (r"^two-piece toilet – tranq", 260),
]


def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip().lower()


def to_rgb(img: Image.Image) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
        bg.alpha_composite(img)
        img = bg
    return img.convert("RGB")


def main():
    prods = json.loads(CATALOG.read_text(encoding="utf-8"))
    by_clean: dict[str, list[dict]] = {}
    for p in prods:
        by_clean.setdefault(p["name"], []).append(p)
    by_id = {p["id"]: p for p in prods}

    groups: dict[str, list[tuple[Path, int]]] = {}
    unmatched_files: list[str] = []
    for f in sorted(p for p in SRC.rglob("*") if p.is_file()):
        m = re.match(r"^(.*?)(?: (\d+))?$", f.stem)
        base, n = m.group(1), int(m.group(2) or 0)
        base = re.sub(r"\s+different$", "", base)
        groups.setdefault(base, []).append((f, n if n else (0 if not f.stem.endswith("different") else 99)))

    matched: dict[int, list[Path]] = {}
    for base, files in groups.items():
        pid = None
        nb = norm(base.replace("  ", " – "))
        nb_plain = norm(base)
        for rx, i in RULES:
            if re.search(rx, nb) or re.search(rx, nb_plain):
                pid = i
                break
        if pid is None:
            hit = by_clean.get(clean_title(base.replace("  ", " – "))) or by_clean.get(clean_title(base))
            if hit and len(hit) == 1:
                pid = hit[0]["id"]
        if pid is None:
            unmatched_files += [str(f.relative_to(SRC)) for f, _ in files]
            continue
        matched.setdefault(pid, []).extend(files)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    result: dict[str, list[dict]] = {}
    for pid, files in sorted(matched.items()):
        p = by_id[pid]
        files = sorted(files, key=lambda t: (t[1], t[0].name))
        seen_names, imgs = set(), []
        for f, _ in files:
            if len(imgs) >= MAX_PER_PRODUCT:
                break
            if f.name in seen_names:
                continue
            seen_names.add(f.name)
            try:
                im = to_rgb(Image.open(f))
            except Exception as e:  # unreadable file: report and move on
                unmatched_files.append(f"{f.name} (unreadable: {e})")
                continue
            im.thumbnail((LONG_EDGE, LONG_EDGE), Image.LANCZOS)
            idx = len(imgs) + 1
            name = f"{p['slug']}-{idx}.webp"
            im.save(OUT_DIR / name, "WEBP", quality=74, method=6)
            imgs.append({"src": f"/products/{name}", "width": im.width, "height": im.height})
        result[str(pid)] = imgs

    OUT_JSON.write_text(json.dumps(result, indent=1), encoding="utf-8")
    without = [f"[{p['id']}] {p['name']} ({p['sku'] or 'no SKU'})" for p in prods if str(p["id"]) not in result]
    REVIEW.write_text(
        "\n".join(
            [
                "# Product image review",
                "",
                f"{len(result)} of {len(prods)} products have images ({sum(len(v) for v in result.values())} files, "
                f"at most {MAX_PER_PRODUCT} per product).",
                "",
                "## Products with no image",
                *[f"- {x}" for x in without],
                "",
                "## Files that could not be matched to a product",
                *[f"- {x}" for x in unmatched_files],
                "",
            ]
        ),
        encoding="utf-8",
    )
    print(f"{len(result)}/{len(prods)} products with images; {len(without)} without; {len(unmatched_files)} unmatched files")


if __name__ == "__main__":
    main()
