from django.db import migrations, models

import apps.orders.models as order_models


def fill_codes(apps, schema_editor):
    """Give every existing order its own collection code before the column becomes unique."""
    Order = apps.get_model("orders", "Order")
    used = set()
    for order in Order.objects.filter(code__isnull=True):
        code = order_models.new_code()
        while code in used:
            code = order_models.new_code()
        used.add(code)
        order.code = code
        order.save(update_fields=["code"])


class Migration(migrations.Migration):
    dependencies = [("orders", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="order",
            name="code",
            field=models.CharField(editable=False, max_length=8, null=True),
        ),
        migrations.RunPython(fill_codes, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="order",
            name="code",
            field=models.CharField(editable=False, max_length=8, unique=True),
        ),
        migrations.AddField(
            model_name="order",
            name="fulfilment",
            field=models.CharField(
                choices=[("delivery", "Delivery"), ("pickup", "Showroom pickup")],
                db_index=True,
                default="delivery",
                max_length=10,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="pickup_showroom",
            field=models.CharField(
                blank=True,
                choices=[("weija", "Weija showroom"), ("east-legon", "East Legon showroom")],
                db_index=True,
                max_length=12,
            ),
        ),
        migrations.AddField(
            model_name="order",
            name="collected_at",
            field=models.DateTimeField(blank=True, help_text="When the customer collected a pickup order.", null=True),
        ),
        migrations.AlterField(model_name="order", name="address", field=models.CharField(blank=True, max_length=300)),
        migrations.AlterField(model_name="order", name="city", field=models.CharField(blank=True, max_length=100)),
        migrations.AlterField(model_name="order", name="region", field=models.CharField(blank=True, max_length=100)),
    ]
