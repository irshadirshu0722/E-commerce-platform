# Generated by Django 4.2.10 on 2024-04-19 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0004_rename_paymentmode_adminpaymentmode'),
    ]

    operations = [
        migrations.RenameField(
            model_name='orderstatus',
            old_name='_refund_date',
            new_name='_refunded_date',
        ),
    ]
