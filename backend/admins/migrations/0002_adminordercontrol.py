# Generated by Django 4.2.10 on 2024-04-18 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminOrderControl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('return_days', models.IntegerField(default=7)),
                ('lazy_confirmation_cancel_days', models.IntegerField(default=5)),
            ],
        ),
    ]
