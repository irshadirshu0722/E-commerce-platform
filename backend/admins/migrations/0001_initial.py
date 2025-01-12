# Generated by Django 4.2.10 on 2024-04-18 13:40

import cloudinary.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('last_name', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('address', models.CharField(blank=True, default='', max_length=250, null=True)),
                ('landmark', models.CharField(blank=True, default='', max_length=250, null=True)),
                ('city', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('pincode', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('district', models.CharField(blank=True, choices=[('Alappuzha', 'Alappuzha'), ('Ernakulam', 'Ernakulam'), ('Idukki', 'Idukki'), ('Kannur', 'Kannur'), ('Kasaragod', 'Kasaragod'), ('Kollam', 'Kollam'), ('Kottayam', 'Kottayam'), ('Kozhikode', 'Kozhikode'), ('Malappuram', 'Malappuram'), ('Palakkad', 'Palakkad'), ('Pathanamthitta', 'Pathanamthitta'), ('Thiruvananthapuram', 'Thiruvananthapuram'), ('Thrissur', 'Thrissur'), ('Wayanad', 'Wayanad')], default='', max_length=100, null=True)),
                ('state', models.CharField(blank=True, choices=[('Andhra Pradesh', 'Andhra Pradesh'), ('Arunachal Pradesh', 'Arunachal Pradesh'), ('Assam', 'Assam'), ('Bihar', 'Bihar'), ('Chhattisgarh', 'Chhattisgarh'), ('Goa', 'Goa'), ('Gujarat', 'Gujarat'), ('Haryana', 'Haryana'), ('Himachal Pradesh', 'Himachal Pradesh'), ('Jharkhand', 'Jharkhand'), ('Karnataka', 'Karnataka'), ('Kerala', 'Kerala'), ('Madhya Pradesh', 'Madhya Pradesh'), ('Maharashtra', 'Maharashtra'), ('Manipur', 'Manipur'), ('Meghalaya', 'Meghalaya'), ('Mizoram', 'Mizoram'), ('Nagaland', 'Nagaland'), ('Odisha', 'Odisha'), ('Punjab', 'Punjab'), ('Rajasthan', 'Rajasthan'), ('Sikkim', 'Sikkim'), ('Tamil Nadu', 'Tamil Nadu'), ('Telangana', 'Telangana'), ('Tripura', 'Tripura'), ('Uttar Pradesh', 'Uttar Pradesh'), ('Uttarakhand', 'Uttarakhand'), ('West Bengal', 'West Bengal'), ('Andaman and Nicobar Islands', 'Andaman and Nicobar Islands'), ('Chandigarh', 'Chandigarh'), ('Dadra and Nagar Haveli', 'Dadra and Nagar Haveli'), ('Daman and Diu', 'Daman and Diu'), ('Lakshadweep', 'Lakshadweep'), ('Delhi', 'Delhi'), ('Puducherry', 'Puducherry')], default='', max_length=100, null=True)),
                ('country', models.CharField(blank=True, default='india', editable=False, max_length=100, null=True)),
                ('phone_number', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('email', models.CharField(blank=True, default='', max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='AdminDeliveryDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inside_kerala', models.DecimalField(decimal_places=2, max_digits=10)),
                ('outside_kerala', models.DecimalField(decimal_places=2, max_digits=10)),
                ('min_delivery_days', models.IntegerField(blank=True, null=True, verbose_name='Minimum Delivery Days')),
                ('max_delivery_days', models.IntegerField(blank=True, null=True, verbose_name='Maximum Delivery Days')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('free_delivery_over', models.DecimalField(decimal_places=2, default=None, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subtotal', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('quantity', models.IntegerField(blank=True, default=0, null=True)),
                ('total', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('gst', models.CharField(blank=True, max_length=100, null=True)),
                ('discount', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.CharField(blank=True, max_length=250, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CouponCode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=100)),
                ('discount_rate', models.IntegerField(default=0)),
                ('min_order', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('discount_amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EmailProvider',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('api_key', models.CharField(max_length=200)),
                ('secret_key', models.CharField(max_length=200)),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='ForgotPasswordToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(blank=True, max_length=120, null=True, unique=True)),
                ('token', models.CharField(blank=True, max_length=120, null=True)),
                ('expiration', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Highlight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='Image')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Offer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='Image')),
                ('offer_name', models.CharField(max_length=100)),
                ('discount_type', models.CharField(choices=[('amount', 'Amount'), ('percentage', 'Percentage')], max_length=10)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('_start_date', models.DateField(auto_now_add=True)),
                ('_end_date', models.DateField()),
                ('highlight', models.BooleanField(default=False, verbose_name='Need to highlight on homepage')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('_order_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('profit', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('subtotal', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('quantity', models.IntegerField(blank=True, null=True)),
                ('discount', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('total', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('gst', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('is_return_order', models.BooleanField(default=False, null=True)),
                ('can_return', models.BooleanField(default=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderDeliveryDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tracking_id', models.CharField(blank=True, max_length=100, null=True)),
                ('delivery_charge', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('tracking_url', models.CharField(blank=True, max_length=200, null=True)),
                ('courier_service', models.CharField(blank=True, max_length=50, null=True)),
                ('_estimated_delivery_date', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderDiscountDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('discount_code', models.CharField(blank=True, max_length=100, null=True)),
                ('discount_rate', models.IntegerField(blank=True, default=0, null=True)),
                ('discount_amount', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('min_order', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('product_name', models.CharField(blank=True, max_length=100, null=True)),
                ('product_price', models.FloatField(blank=True, null=True)),
                ('quantity', models.IntegerField(blank=True, null=True)),
                ('total', models.FloatField(blank=True, null=True)),
                ('product_id', models.IntegerField(blank=True, null=True)),
                ('is_returned', models.BooleanField(default=False)),
                ('main_order_item', models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='return_order_item', to='admins.orderitem')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='admins.order')),
            ],
        ),
        migrations.CreateModel(
            name='OrderStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('request_received', 'Return Request Received'), ('request_confirmed', 'Return Request Confirmed'), ('product_received', 'Return Product Received'), ('replacement', 'Replacement'), ('refunded', 'Refunded'), ('resolved', 'Return Resolved'), ('received', 'Received'), ('confirmed', 'Confirmed'), ('shipped', 'Shipped'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], max_length=20, null=True)),
                ('_request_received_date', models.DateTimeField(blank=True, null=True)),
                ('_request_confirmed_date', models.DateTimeField(blank=True, null=True)),
                ('_product_received_date', models.DateTimeField(blank=True, null=True)),
                ('_replacement_date', models.DateTimeField(blank=True, null=True)),
                ('_refund_date', models.DateTimeField(blank=True, null=True)),
                ('_resolved_date', models.DateTimeField(blank=True, null=True)),
                ('_received_date', models.DateTimeField(blank=True, null=True)),
                ('_confirmed_date', models.DateTimeField(blank=True, null=True)),
                ('_shipped_date', models.DateTimeField(blank=True, null=True)),
                ('_completed_date', models.DateTimeField(blank=True, null=True)),
                ('_cancelled_date', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField(blank=True, null=True)),
                ('method', models.CharField(max_length=250)),
                ('payment_id', models.CharField(max_length=250, null=True)),
                ('_payment_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaymentMode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cash_on_delivery', models.BooleanField(default=False)),
                ('direct_bank_transfer', models.BooleanField(default=False)),
                ('online_payment', models.BooleanField(default=False)),
                ('cash_on_delivery_txt', models.CharField(blank=True, default='Cash On Delivery', editable=False, max_length=100)),
                ('direct_bank_transfer_txt', models.CharField(blank=True, default='Direct Bank Transfer ', editable=False, max_length=100)),
                ('online_payment_txt', models.CharField(blank=True, default='Online Payment', editable=False, max_length=100)),
                ('cash_on_delivery_description', models.TextField(blank=True, null=True)),
                ('direct_bank_transfer_description', models.TextField(blank=True, null=True)),
                ('online_payment_description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Policy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('privacy', models.TextField(blank=True, null=True)),
                ('refund', models.TextField(blank=True, null=True)),
                ('terms_and_condition', models.TextField(blank=True, null=True)),
                ('shipping', models.TextField(blank=True, null=True)),
                ('cookie', models.TextField(blank=True, null=True)),
                ('faq', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=250, null=True)),
                ('actual_price', models.DecimalField(decimal_places=2, default=0.0, max_digits=10, verbose_name='Price')),
                ('stock', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('description', models.TextField(blank=True, default='', null=True)),
                ('price', models.DecimalField(decimal_places=2, default=0.0, editable=False, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='ProductBrand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='ProductNotifyUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=100)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ProductPackageContain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default='', max_length=100)),
                ('value', models.CharField(default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ProductSpecialisation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default='', max_length=100)),
                ('value', models.CharField(default='', max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='ShippingAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='shipping_address', to='admins.address')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='shipping_address', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProductRating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('one_star', models.IntegerField(default=0)),
                ('two_star', models.IntegerField(default=0)),
                ('three_star', models.IntegerField(default=0)),
                ('four_star', models.IntegerField(default=0)),
                ('five_star', models.IntegerField(default=0)),
                ('one_star_percentage', models.FloatField(default=0)),
                ('two_star_percentage', models.FloatField(default=0)),
                ('three_star_percentage', models.FloatField(default=0)),
                ('four_star_percentage', models.FloatField(default=0)),
                ('five_star_percentage', models.FloatField(default=0)),
                ('overall', models.DecimalField(decimal_places=1, default=0.0, max_digits=10, null=True)),
                ('product', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='rating', to='admins.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='Image')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='admins.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductFeedback',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('star_rating', models.IntegerField(choices=[(0, '0'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], default=0)),
                ('order_item', models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='feedback', to='admins.orderitem')),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='feedbacks', to='admins.product')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='product_feedback', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='product',
            name='brand',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='admins.productbrand'),
        ),
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='admins.category'),
        ),
        migrations.AddField(
            model_name='product',
            name='notify',
            field=models.ManyToManyField(blank=True, to='admins.productnotifyuser'),
        ),
        migrations.AddField(
            model_name='product',
            name='offer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='admins.offer'),
        ),
        migrations.AddField(
            model_name='product',
            name='package_contains',
            field=models.ManyToManyField(related_name='products', to='admins.productpackagecontain'),
        ),
        migrations.AddField(
            model_name='product',
            name='specializations',
            field=models.ManyToManyField(related_name='products', to='admins.productspecialisation'),
        ),
        migrations.AddField(
            model_name='product',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='products', to='admins.tag'),
        ),
        migrations.CreateModel(
            name='OrderShipping',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_shipping', to='admins.address')),
            ],
        ),
        migrations.CreateModel(
            name='OrderBilling',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_billing', to='admins.address')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='billing_address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='admins.orderbilling'),
        ),
        migrations.AddField(
            model_name='order',
            name='delivery_details',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='admins.orderdeliverydetails'),
        ),
        migrations.AddField(
            model_name='order',
            name='discount_details',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to='admins.orderdiscountdetails'),
        ),
        migrations.AddField(
            model_name='order',
            name='main_order',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='return_orders', to='admins.order'),
        ),
        migrations.AddField(
            model_name='order',
            name='payment_details',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='admins.paymentdetails'),
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='admins.ordershipping'),
        ),
        migrations.AddField(
            model_name='order',
            name='status',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order', to='admins.orderstatus'),
        ),
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='OfferImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='Image')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('tag', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='image', to='admins.tag')),
            ],
        ),
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='chat_room', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ChatMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('is_admin', models.BooleanField(default=False)),
                ('admin_seen', models.BooleanField(default=False)),
                ('_message_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('date', models.DateField(auto_now_add=True, null=True)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='admins.chatroom')),
            ],
            options={
                'ordering': ('_message_at',),
            },
        ),
        migrations.CreateModel(
            name='CategoryImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255, verbose_name='Image')),
                ('category', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='image', to='admins.category')),
            ],
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(blank=True, null=True)),
                ('total', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True)),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cart_items', to='admins.cart')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cart_product', to='admins.product')),
            ],
        ),
        migrations.AddField(
            model_name='cart',
            name='coupon_code',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='admins.couponcode'),
        ),
        migrations.AddField(
            model_name='cart',
            name='user',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='BillingAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('address', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='billing_address', to='admins.address')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='billing_address', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AdminContactDetails',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bank_name', models.CharField(blank=True, max_length=100, null=True)),
                ('account_number', models.CharField(max_length=100)),
                ('ifsc_code', models.CharField(max_length=100)),
                ('upi_id', models.CharField(max_length=100)),
                ('whatsapp_number', models.CharField(max_length=100)),
                ('email', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('address', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='admins.address')),
            ],
        ),
    ]