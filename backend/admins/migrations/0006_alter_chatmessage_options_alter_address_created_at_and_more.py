# Generated by Django 4.2.10 on 2024-04-22 14:17

import admins.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0005_rename__refund_date_orderstatus__refunded_date'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='chatmessage',
            options={'ordering': ('-_message_at',)},
        ),
        migrations.AlterField(
            model_name='address',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='admincontactdetails',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='admincontactdetails',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='admindeliverydetails',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='admindeliverydetails',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='billingaddress',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='billingaddress',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='chatmessage',
            name='_message_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='couponcode',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='couponcode',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='forgotpasswordtoken',
            name='expiration',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='highlight',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='offerimage',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='_order_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderdeliverydetails',
            name='_estimated_delivery_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_cancelled_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_completed_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_confirmed_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_product_received_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_received_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_refunded_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_replacement_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_request_confirmed_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_request_received_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_resolved_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='orderstatus',
            name='_shipped_date',
            field=admins.models.LocalizedDateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='paymentdetails',
            name='_payment_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='paymentdetails',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='paymentdetails',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='productfeedback',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='shippingaddress',
            name='created_at',
            field=admins.models.LocalizedDateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='shippingaddress',
            name='updated_at',
            field=admins.models.LocalizedDateTimeField(auto_now=True, null=True),
        ),
    ]