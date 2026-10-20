import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.catalog.models import Product

DEFAULT_FILE = Path(__file__).resolve().parents[2] / "data" / "catalog.json"


class Command(BaseCommand):
    help = "Create or update products from the catalogue JSON. Safe to run repeatedly."

    def add_arguments(self, parser):
        parser.add_argument("--file", default=str(DEFAULT_FILE), help="Path to catalog.json")

    @transaction.atomic
    def handle(self, *args, **options):
        items = json.loads(Path(options["file"]).read_text(encoding="utf-8"))
        created = updated = 0
        for item in items:
            _, was_created = Product.objects.update_or_create(
                external_id=item["id"],
                defaults={
                    "slug": item["slug"],
                    "name": item["name"],
                    "sku": item.get("sku") or "",
                    "category_slug": item["categorySlug"],
                    "price_pesewas": item.get("pricePesewas"),
                    "in_stock": bool(item.get("inStock")),
                },
            )
            created += was_created
            updated += not was_created
        self.stdout.write(self.style.SUCCESS(f"{created} created, {updated} updated ({len(items)} products)."))
