# Generated by Django 4.2.10 on 2024-04-18 14:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0002_adminordercontrol'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='EmailProvider',
            new_name='AdminEmailProvider',
        ),
    ]