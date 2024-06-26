# Generated by Django 4.2.6 on 2024-06-09 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="punto_planifica",
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
                ("titulo", models.CharField(max_length=255)),
                ("name", models.CharField(max_length=255)),
            ],
        ),
    ]
