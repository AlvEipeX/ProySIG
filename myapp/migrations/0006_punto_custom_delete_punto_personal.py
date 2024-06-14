# Generated by Django 4.2.6 on 2024-06-14 00:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("myapp", "0005_punto_personal"),
    ]

    operations = [
        migrations.CreateModel(
            name="punto_custom",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("coord_lat", models.FloatField()),
                ("coord_lng", models.FloatField()),
                ("name", models.CharField(max_length=255)),
                ("descripcion", models.CharField(max_length=255)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="punto_personal",
        ),
    ]
