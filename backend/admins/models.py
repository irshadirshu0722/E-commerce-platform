from datetime import date, timedelta
import datetime
from typing import Iterable
from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from admins.exceptions import *
from django.http import JsonResponse
from django.contrib.auth.models import AbstractUser
from cloudinary.models import CloudinaryField
from users_order.utils import to_html_p
from django.utils import timezone  
# Create your models here.
class LocalizedDateTimeField(models.DateTimeField):
    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return timezone.localtime(value)
class Address(models.Model):
    KERALA_DISTRICTS = (
        ('Alappuzha', 'Alappuzha'),
        ('Ernakulam', 'Ernakulam'),
        ('Idukki', 'Idukki'),
        ('Kannur', 'Kannur'),
        ('Kasaragod', 'Kasaragod'),
        ('Kollam', 'Kollam'),
        ('Kottayam', 'Kottayam'),
        ('Kozhikode', 'Kozhikode'),
        ('Malappuram', 'Malappuram'),
        ('Palakkad', 'Palakkad'),
        ('Pathanamthitta', 'Pathanamthitta'),
        ('Thiruvananthapuram', 'Thiruvananthapuram'),
        ('Thrissur', 'Thrissur'),
        ('Wayanad', 'Wayanad'),
    )

    INDIAN_STATES = (
        ('Andhra Pradesh', 'Andhra Pradesh'),
        ('Arunachal Pradesh', 'Arunachal Pradesh'),
        ('Assam', 'Assam'),
        ('Bihar', 'Bihar'),
        ('Chhattisgarh', 'Chhattisgarh'),
        ('Goa', 'Goa'),
        ('Gujarat', 'Gujarat'),
        ('Haryana', 'Haryana'),
        ('Himachal Pradesh', 'Himachal Pradesh'),
        ('Jharkhand', 'Jharkhand'),
        ('Karnataka', 'Karnataka'),
        ('Kerala', 'Kerala'),
        ('Madhya Pradesh', 'Madhya Pradesh'),
        ('Maharashtra', 'Maharashtra'),
        ('Manipur', 'Manipur'),
        ('Meghalaya', 'Meghalaya'),
        ('Mizoram', 'Mizoram'),
        ('Nagaland', 'Nagaland'),
        ('Odisha', 'Odisha'),
        ('Punjab', 'Punjab'),
        ('Rajasthan', 'Rajasthan'),
        ('Sikkim', 'Sikkim'),
        ('Tamil Nadu', 'Tamil Nadu'),
        ('Telangana', 'Telangana'),
        ('Tripura', 'Tripura'),
        ('Uttar Pradesh', 'Uttar Pradesh'),
        ('Uttarakhand', 'Uttarakhand'),
        ('West Bengal', 'West Bengal'),
        ('Andaman and Nicobar Islands', 'Andaman and Nicobar Islands'),
        ('Chandigarh', 'Chandigarh'),
        ('Dadra and Nagar Haveli', 'Dadra and Nagar Haveli'),
        ('Daman and Diu', 'Daman and Diu'),
        ('Lakshadweep', 'Lakshadweep'),
        ('Delhi', 'Delhi'),
        ('Puducherry', 'Puducherry'),
    )
    first_name = models.CharField(max_length=100, default="",blank=True,null=True)
    last_name = models.CharField(max_length=100, default="",blank=True,null=True)
    address = models.CharField(max_length=250, default="",blank=True,null=True)
    landmark = models.CharField(max_length=250, default="",blank=True,null=True)
    city = models.CharField(max_length=100, default="",blank=True,null=True)
    pincode = models.CharField(max_length=100,default="",blank=True,null=True)
    district = models.CharField(max_length=100,default="",blank=True,choices=KERALA_DISTRICTS,null=True)
    state = models.CharField(max_length=100,default="",blank=True,choices=INDIAN_STATES,null=True)
    country = models.CharField(max_length=100, default="india",blank=True,editable=False,null=True)
    phone_number = models.CharField(max_length=100, default="",blank=True,null=True)
    email = models.CharField(max_length=100, default="",blank=True,null=True)
    created_at = LocalizedDateTimeField(auto_now_add=True,null=True)
    updated_at = LocalizedDateTimeField(auto_now=True,null=True,blank=True)
    def __str__(self) -> str:
        return f"Name : {self.first_name} {self.last_name} District:{self.district} state:{self.state}"
class ShippingAddress(models.Model):
    address = models.OneToOneField(Address,on_delete=models.CASCADE,related_name='shipping_address',null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='shipping_address')
    created_at = LocalizedDateTimeField(auto_now_add=True,null=True)
    updated_at = LocalizedDateTimeField(auto_now=True,null=True,blank=True)

class BillingAddress(models.Model):
    address = models.OneToOneField(Address,on_delete=models.CASCADE,related_name='billing_address',null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='billing_address')
    created_at = LocalizedDateTimeField(auto_now_add=True,null=True)
    updated_at = LocalizedDateTimeField(auto_now=True,null=True,blank=True)

class OrderShipping(models.Model):
    address = models.OneToOneField(Address,on_delete=models.CASCADE,related_name='order_shipping',null=True)

class OrderBilling(models.Model):
    address = models.OneToOneField(Address,on_delete=models.CASCADE,related_name='order_billing',null=True)
class PaymentDetails(models.Model):
    STATUS_CHOICES = [
        
        ("Pending", 'Pending'),
        ('Failed', 'Failed'),
        ("Completed", 'Completed'),

    ]
    amount = models.FloatField(null=True,blank=True)
    method = models.CharField(max_length=250, null=False)
    payment_id = models.CharField(max_length=250, null=True)
    _payment_at = LocalizedDateTimeField(auto_now_add=True,null=True, blank=True)
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True, blank=True)
    @property
    def payment_at(self):
        return self._payment_at.strftime("%B %d, %Y")
    @property
    def is_direct_bank_transfer(self):
        if self.method.lower().replace(" ", "") == 'directbanktransfer':
            return True
        return False
class OrderStatus(models.Model):
    STATUS_CHOICES = (
        ('request_received', 'Return Request Received'),
        ('request_confirmed', 'Return Request Confirmed'),
        ('product_received', 'Return Product Received'),
        ('replacement', 'Replacement'),
        ('refunded', 'Refunded'),
        ('resolved', 'Return Resolved'),
        ('received', 'Received'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,null=True)
    _request_received_date = LocalizedDateTimeField(null=True, blank=True)
    _request_confirmed_date = LocalizedDateTimeField(null=True, blank=True)
    _product_received_date = LocalizedDateTimeField(null=True, blank=True)
    _replacement_date = LocalizedDateTimeField(null=True, blank=True)
    _refunded_date = LocalizedDateTimeField(null=True, blank=True)
    _resolved_date = LocalizedDateTimeField(null=True, blank=True)
    _received_date = LocalizedDateTimeField(null=True,blank=True)
    _confirmed_date = LocalizedDateTimeField(null=True, blank=True)
    _shipped_date = LocalizedDateTimeField(null=True, blank=True)
    _completed_date = LocalizedDateTimeField(null=True, blank=True)
    _cancelled_date = LocalizedDateTimeField(null=True, blank=True)
    @property
    def received_date(self):
        return self._received_date.strftime("%B %d, %Y") if self._received_date else None
    @property
    def confirmed_date(self):
        return self._confirmed_date.strftime("%B %d, %Y") if self._confirmed_date else None
    @property
    def shipped_date(self):
        return self._shipped_date.strftime("%B %d, %Y") if self._shipped_date else None
    @property
    def completed_date(self):
        return self._completed_date.strftime("%B %d, %Y") if self._completed_date else None
    @property
    def cancelled_date(self):
        return self._cancelled_date.strftime("%B %d, %Y") if self._cancelled_date else None
    @property
    def request_received_date(self):
        return self._request_received_date.strftime("%B %d, %Y") if self._request_received_date else None
    @property
    def request_confirmed_date(self):
        return self._request_confirmed_date.strftime("%B %d, %Y") if self._request_confirmed_date else None
    @property
    def product_received_date(self):
        return self._product_received_date.strftime("%B %d, %Y") if self._product_received_date else None
    @property
    def replacement_date(self):
        return self._replacement_date.strftime("%B %d, %Y") if self._replacement_date else None
    @property
    def refund_date(self):
        return self._refunded_date.strftime("%B %d, %Y") if self._refunded_date else None
    @property
    def resolved_date(self):
        return self._resolved_date.strftime("%B %d, %Y") if self._resolved_date else None
    @property
    def get_order(self):
        order = None
        try:
            order = self.order
        except:
            pass
        finally:
            return order

    @property
    def status_track(self):
        order = self.order
        tracking_id  = order.delivery_details.tracking_id
        tracking_link = order.delivery_details.tracking_url
        courier_service = order.delivery_details.courier_service
        status_list = [
        {"description": "Request received", "date": self.request_received_date,'choice':'request_received','title':'Request received'},
        {"description": "Request confirmed", "date": self.request_confirmed_date,'choice':'request_confirmed','title':'Request confirmed'},
        {"description": "Product received", "date": self.product_received_date,'choice':'product_received','title':'Product received'},
        {"description": "Replacement Confirmed", "date": self.replacement_date,'choice':'replacement','title':'Replacement'},
        {"description": "Refunded", "date": self.refund_date,'choice':'refund','title':'Refunded'},
        {"description": "Resolved", "date": self.resolved_date,'choice':'resolved','title':'Resolved'},
        {"description": "Order received", "date": self.received_date,'choice':'received','title':'Received'},
        {"description": "Order confirmed", "date": self.confirmed_date,'choice':'confirmed','title':'Confirmed'},
        {"description": f"{to_html_p(f'Order shipped | Tracking ID :{tracking_id} ')} {to_html_p(f'Courier: {courier_service}')} <a class='link' href='{tracking_link}'> track shippment </a>",
"date": self.shipped_date, 'choice': 'shipped', 'title': 'Shipped'},

        {"description": "Order completed", "date": self.completed_date,'choice':'completed','title':'Completed'},
        {"description": "Order cancelled", "date": self.cancelled_date,'choice':'cancelled','title':'Cancelled'},
        ]
        return [status for status in status_list if status["date"] is not None]
    
    def __str__(self):
        return f"{self.status}"


class OrderDiscountDetails(models.Model):
    discount_code = models.CharField(max_length=100, null=True,blank=True)
    discount_rate = models.IntegerField(default=0,null=True,blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
class OrderDeliveryDetails(models.Model):
    tracking_id = models.CharField(max_length=100,null=True, blank=True)
    delivery_charge = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    tracking_url = models.CharField(max_length=200,null=True, blank=True)
    courier_service = models.CharField(max_length=50,null=True, blank=True)
    _estimated_delivery_date = LocalizedDateTimeField(null=True,blank=True)
    @property
    def estimated_delivery_date(self):
        return self._estimated_delivery_date.strftime("%B %d, %Y") if self._estimated_delivery_date else None
class Order(models.Model):
    _order_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    status = models.OneToOneField(OrderStatus,on_delete=models.CASCADE,related_name='order',null=True,blank=True,default=None)
    profit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    quantity = models.IntegerField(null=True,blank=True)
    discount_details = models.ForeignKey(OrderDiscountDetails,on_delete = models.SET_NULL,related_name = 'orders',null=True,blank=True)
    delivery_details = models.OneToOneField(OrderDeliveryDetails,on_delete=models.CASCADE,related_name='order',null=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    gst = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='orders')
    shipping_address = models.ForeignKey(OrderShipping, on_delete=models.CASCADE, null=True,blank=True,related_name='order')
    billing_address = models.ForeignKey(OrderBilling, on_delete=models.CASCADE, null=True,blank=True,related_name='order')
    payment_details = models.ForeignKey(PaymentDetails, on_delete=models.CASCADE, null=True,blank=True,related_name='order')
    is_return_order = models.BooleanField(default=False,null=True)
    main_order = models.ForeignKey('self',on_delete=models.CASCADE,default=None,null=True,blank=True,related_name='return_orders')
    # can_cancel = models.BooleanField(default=True,null=True)
    can_return = models.BooleanField(default=True,null=True)
    @property
    def order_at(self):
        return self._order_at.strftime("%B %d, %Y") if self._order_at else None
    @property
    def order_id(self):
        total_zero = 5
        id_length = len(str(self.pk))
        order_id_zeros = total_zero - id_length
        return f"KL{'0'*order_id_zeros}{self.pk}"
    @property
    def last_status_update_date(self):
        dates = []
        if not self.is_return_order:
            dates = [self.status.received_date,self.status.confirmed_date,self.status.shipped_date,self.status.completed_date,self.status.cancelled_date]
        else:
            dates = []
        last_data = None
        for date in dates:
            if date:
                last_data = date
        return last_data.strftime("%B %d, %Y")
    @property
    def is_completed(self):
        status = self.status
        if status and status._completed_date!=None:
            return True
        return False
    @property
    def can_cancel(self):
        status = self.status
        if self.is_return_order :
            if (self.status.product_received_date!=None or self.status.cancelled_date!=None):
                return False
            else:
                return True
        if status and (status._shipped_date != None or status._cancelled_date!=None):
            return False
        return True
    def save(self, *args, **kwargs):
        if self.delivery_details and self._order_at:
            delivery_details = AdminDeliveryDetails.objects.first()
            max_days = delivery_details.max_delivery_days
            self.delivery_details._estimated_delivery_date = self._order_at + timedelta(days=max_days)
            self.delivery_details.save()
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    product_name = models.CharField(max_length=100, null=True,blank=True)
    product_price = models.FloatField(null=True,blank=True)
    quantity = models.IntegerField(null=True,blank=True)
    total = models.FloatField(null=True,blank=True)
    product_id = models.IntegerField(null=True,blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE,related_name='order_items')
    is_returned = models.BooleanField(default=False)
    main_order_item = models.OneToOneField('self',on_delete = models.CASCADE,default=None,null=True,blank=True,related_name="return_order_item")
    @property
    def is_product_exist(self):
        return Product.objects.filter(id=self.product_id).exists()
    @property
    def has_feedback(self):
        return self.feedback.star_rating!=0
    @property
    def product_image_url(self):
        product = Product.objects.filter(id=self.product_id).first()
        if product:
            images = product.images.all()
            if len(images) !=0:
                return images[0].image_url
            return settings.DEFAULT_IMAGE 
    def __str__(self) -> str:
        return f"{self.order.id}"
class Category(models.Model):
    category_name = models.CharField(max_length=250, null=True,blank=True)
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True,blank=True)
    def __str__(self):
        return self.category_name
class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
class Offer(models.Model):
    DISCOUNT_TYPE_CHOICES = (
        ('amount', 'Amount'),
        ('percentage', 'Percentage'),
    )
    image = CloudinaryField(
    "Image",
    folder="offers/images",
    overwrite=True,
    resource_type="image",
    transformation={"quality": "auto:eco"},
    format="jpg",
    null=True,blank=True
    )
    offer_name = models.CharField(max_length=100)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    _start_date = models.DateField(auto_now_add=True)  # Set start_date automatically on creation
    _end_date = models.DateField()
    highlight = models.BooleanField(default=False,verbose_name='Need to highlight on homepage')  
    def calculate_discounted_price(self, actual_price):
        if self.discount_type == 'amount':
            return actual_price - self.discount
        elif self.discount_type == 'percentage':
            return  round(actual_price - actual_price/100 * self.discount,2) 
        else:
            raise ValueError("Invalid discount type")
    @property
    def search_key(self):
        return f"offer-highlight id:{self.pk}"
    @property
    def start_date(self):
        return self._start_date.strftime("%b %d %Y")
    @property
    def end_date(self):
        return self._end_date.strftime("%b %d %Y")
    @property
    def image_url(self):
        return self.image.url
    def __str__(self):
        return f"{self.offer_name} - Type:{self.discount_type}  - Discount {self.discount}"

class ProductBrand(models.Model):
    name = models.CharField(max_length=50)

class ProductSpecialisation(models.Model):
    key = models.CharField(max_length=100,default="")
    value = models.CharField(max_length=100,default="")
    def __str__(self) -> str:
        return f"{self.key} ->  {self.value}    id{self.id}"
class ProductPackageContain(models.Model):
    key = models.CharField(max_length=100,default="")
    value = models.CharField(max_length=100,default="") 
    def __str__(self) -> str:
        return f"{self.key} ->  {self.value}"
class ProductNotifyUser(models.Model):
    email = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
class Product(models.Model):
    name = models.CharField(max_length=250, null=True,blank=True)
    actual_price = models.DecimalField(max_digits=10, decimal_places=2,default=0.0, verbose_name='Price')
    stock = models.IntegerField(null=True,blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True,blank=True,related_name='products')
    package_contains = models.ManyToManyField(ProductPackageContain,related_name='products')
    specializations = models.ManyToManyField(ProductSpecialisation,related_name='products')
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True,blank=True)
    tags = models.ManyToManyField(Tag, related_name='products', blank=True)
    brand = models.ForeignKey(ProductBrand,on_delete=models.SET_NULL,related_name = 'products',null=True,blank=True)
    description = models.TextField(null=True,blank=True,default='')
    offer = models.ForeignKey(Offer, on_delete=models.SET_NULL, related_name='products',null=True,blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2,default=0.0,editable=False)
    notify = models.ManyToManyField(ProductNotifyUser, blank=True)
    def add_user_to_notify(self, user):
        if len(self.notify.all()) > 20:
            return # Limit reached, do not add more users
        if not self.notify.filter(pk=user.pk).exists():
            self.notify.add(user)
    def clear_notify(self):
        self.notify.clear()
    def save(self, *args, **kwargs):
        if self.offer:
            self.price = self.offer.calculate_discounted_price(self.actual_price)
        else:
            self.price = self.actual_price
            
        super(Product, self).save(*args, **kwargs)
    def __str__(self):
        return f"{self.name}   stock = {self.stock}"

class CouponCode(models.Model):
    code = models.CharField(max_length=100, null=False)
    discount_rate = models.IntegerField(default=0)
    min_order = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_amount =models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True,blank=True)
    def __str__(self) -> str:
        return f"{self.code } - Rate:{self.discount_rate} - Amount:{self.min_order} - MinOrder:{self.min_order} " 
class Cart(models.Model):
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    quantity = models.IntegerField(null=True,blank=True, default=0)
    coupon_code = models.OneToOneField(CouponCode, on_delete=models.SET_NULL, null=True, blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True,blank=True)
    gst = models.CharField(max_length=100, null=True,blank=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    def check_cart_items(self):
        cart_items = self.cart_items.all()
        is_stock_exception_occurred=False
        for item in cart_items:
            if item.quantity > item.product.stock:
                is_stock_exception_occurred=True
                item.quantity = item.product.stock
                item.save()
        self.save()
        return is_stock_exception_occurred
class CartItem(models.Model): 
    product = models.ForeignKey(Product, on_delete=models.CASCADE,related_name='cart_product')
    quantity = models.IntegerField(null=True,blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE,related_name='cart_items')
class CategoryImage(models.Model):
    image = CloudinaryField(
    "Image",
    folder="categories/images",
    overwrite=True,
    resource_type="image",
    transformation={"quality": "auto:eco"},
    format="jpg",
    )
    category = models.OneToOneField(Category,on_delete = models.CASCADE,related_name='image')
    @property
    def image_url(self):
        return self.image.url
class ProductImage(models.Model):
    image = CloudinaryField(
    "Image",
    folder="product/images",
    overwrite=True,
    resource_type="image",
    transformation={"quality": "auto:eco"},
    format="jpg",
)
    product = models.ForeignKey(Product,on_delete = models.CASCADE,related_name='images')
    def __str__(self):
        return self.product.name
    @property
    def image_url(self):
        return self.image.url
class ForgotPasswordToken(models.Model):
    email = models.CharField(max_length=120, unique=True, null=True,blank=True)
    token = models.CharField(max_length=120, null=True,blank=True)
    expiration = LocalizedDateTimeField(null=True,blank=True)



class Highlight(models.Model):
    image = CloudinaryField(
    "Image",
    folder="highlights/images",
    overwrite=True,
    resource_type="image",
    transformation={"quality": "auto:eco"},
    format="jpg",
    )
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    @property
    def image_url(self):
        return self.image.url
    
class AdminContactDetails(models.Model):
    bank_name = models.CharField(max_length=100, null=True,blank=True)
    account_number = models.CharField(max_length=100, null=False)
    ifsc_code = models.CharField(max_length=100, null=False)
    upi_id = models.CharField(max_length=100, null=False)
    whatsapp_number = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=100, null=True,blank=True)
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True,blank=True)

    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self) -> str:
        return f"{self.email}  {self.whatsapp_number}"

class AdminDeliveryDetails(models.Model):
    inside_kerala = models.DecimalField(max_digits=10, decimal_places=2,null=False)
    outside_kerala = models.DecimalField(max_digits=10, decimal_places=2,null=False)
    min_delivery_days = models.IntegerField(null=True, blank=True, verbose_name="Minimum Delivery Days")
    max_delivery_days = models.IntegerField(null=True, blank=True, verbose_name="Maximum Delivery Days")
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = LocalizedDateTimeField(auto_now=True, null=True, blank=True)
    free_delivery_over = models.DecimalField(max_digits=10,decimal_places=2,default=None,null=True)


class Policy(models.Model):
    privacy = models.TextField(null=True,blank=True)
    refund = models.TextField(null=True,blank=True)
    terms_and_condition = models.TextField(null=True,blank=True)
    shipping = models.TextField(null=True,blank=True)
    cookie = models.TextField(null=True,blank=True)
    faq = models.TextField(null=True,blank=True)

class AdminPaymentMode(models.Model):
    cash_on_delivery = models.BooleanField(default=False)
    direct_bank_transfer = models.BooleanField(default=False)
    online_payment = models.BooleanField(default=False)
    cash_on_delivery_txt = models.CharField(max_length=100,default='Cash On Delivery',editable=False,blank=True)
    direct_bank_transfer_txt = models.CharField(max_length=100,default='Direct Bank Transfer ',editable=False,blank=True)
    online_payment_txt = models.CharField(max_length=100,default='Online Payment',editable=False,blank=True)
    cash_on_delivery_description = models.TextField(blank=True,null=True)
    direct_bank_transfer_description= models.TextField(blank=True,null=True)
    online_payment_description = models.TextField(blank=True,null=True)

class AdminEmailProvider(models.Model):
    email = models.EmailField(blank=True)
    api_key = models.CharField(max_length=200)
    secret_key = models.CharField(max_length=200)
    name = models.CharField(max_length=200)

class ProductFeedback(models.Model):
    user = models.ForeignKey(User,on_delete = models.SET_NULL,related_name='product_feedback',null=True)
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="feedbacks",null=True)
    created_at = LocalizedDateTimeField(auto_now_add=True)
    star_rating = models.IntegerField(default=0, choices=[(i, str(i)) for i in range(0, 6)])
    order_item = models.OneToOneField(OrderItem,on_delete=models.SET_NULL,related_name='feedback',null=True)
    @property
    def username(self):
        return self.user.username
    def __str__(self):
        return f"{self.user} {self.id} -> {self.product.pk}"
    
class ProductRating(models.Model):
    product = models.OneToOneField(Product,on_delete=models.CASCADE,related_name='rating')
    one_star = models.IntegerField(default=0)
    two_star = models.IntegerField(default=0)
    three_star = models.IntegerField(default=0)
    four_star = models.IntegerField(default=0)
    five_star = models.IntegerField(default=0)
    one_star_percentage = models.FloatField(default=0)
    two_star_percentage = models.FloatField(default=0)
    three_star_percentage = models.FloatField(default=0)
    four_star_percentage = models.FloatField(default=0)
    five_star_percentage = models.FloatField(default=0)
    overall = models.DecimalField(max_digits=10, decimal_places=1,default=0.0,null=True)
    def save(self, *args, **kwargs):
        total_ratings = self.one_star + self.two_star + self.three_star + self.four_star + self.five_star
        if total_ratings > 0:
            total_stars = (self.one_star * 1) + (self.two_star * 2) + (self.three_star * 3) + (self.four_star * 4) + (self.five_star * 5)
            self.overall = round(total_stars / total_ratings,2)
        else:
            self.overall = 0.0 
        super(ProductRating, self).save(*args, **kwargs)
    def __str__(self) -> str:
        return f"Product ID:{self.product.id}"
class ChatRoom(models.Model):
  name = models.CharField(max_length=100,unique  = True,null=True,blank=True)
  slug = models.SlugField(unique=True,null=True,blank=True)
  user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='chat_room')
  def __str__(self) -> str:
    return self.name
  def save(self, *args, **kwargs):
        self.name = self.user.username
        self.slug = self.user.username
        super(ChatRoom, self).save(*args, **kwargs)

class ChatMessage(models.Model):
  room = models.ForeignKey(ChatRoom,on_delete=models.CASCADE,related_name="messages")
  message = models.TextField()
  is_admin = models.BooleanField(default=False)
  admin_seen = models.BooleanField(default=False)
  _message_at  = LocalizedDateTimeField(auto_now_add=True,null=True)
  date = models.DateField(auto_now_add=True,null=True)
  class Meta:
    ordering=('_message_at',)
  def __str__(self):
      return f"user:{self.room.user.username} -> message:{self.message} -> room:{self.room.name}"
  @property
  def message_at(self):
    return self._message_at.strftime('%I:%M %p %B %d %Y') if self._message_at is not None else None
def offer_upload_to(instance, filename):
    return f"offer/{instance.tag.id}/{filename}"

class OfferImage(models.Model):
    image = CloudinaryField(
    "Image",
    overwrite=True,
    folder="offers/images",
    resource_type="image",
    transformation={"quality": "auto:eco"},
    format="jpg",
    )
    tag = models.OneToOneField(Tag,on_delete =models.CASCADE,related_name = 'image')
    created_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
    @property
    def image_url(self):
        return self.image.url
    


class AdminOrderControl(models.Model):
    return_days = models.IntegerField(default=7)
    lazy_confirmation_cancel_days = models.IntegerField(default=5)


    # def update_cart(self):
    #     if self.pk:
    #         cart_items = self.cart_items.all()
    #         self.quantity = sum(item.quantity for item in cart_items)
    #         self.subtotal = sum(item.total for item in cart_items)

    # def update_discount(self):
    #         if self.coupon_code and self.subtotal < self.coupon_code.min_order:
    #             self.coupon_code=None
    #             self.discount=0
    #         if not self.coupon_code:
    #             self.discount=0
    #         if self.coupon_code:
    #             discount = 0
    #             if(self.coupon_code.discount_amount):
    #                 discount+=self.coupon_code.discount_amount
    #             if(self.coupon_code.discount_rate):
    #                 discount +=(
    #             (self.subtotal/100)*self.coupon_code.discount_rate
    #             )
    #             self.discount = discount
    #         self.total = self.subtotal - self.discount
    # def update_discount_save(self, *args, **kwargs):
    #     self.update_discount()
    #     super(Cart, self).save(*args, **kwargs)
    # def save(self, *args, **kwargs):
    #     self.update_cart()
    #     self.update_discount()
    #     super(Cart, self).save(*args, **kwargs)

# class ReturnOrderItem(models.Model):
#     order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE,related_name='return_order')
    # class ReturnOrder(models.Model):
#     return_at = LocalizedDateTimeField(auto_now_add=True, null=True,blank=True)
#     status = models.OneToOneField(ReturnOrderStatus,on_delete=models.CASCADE,related_name='order',null=True,blank=True,default=None)
#     tracking_id = models.CharField(max_length=100,null=True, blank=True)
#     subtotal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
#     quantity = models.IntegerField(null=True,blank=True)
#     discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
#     total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
#     gst = models.CharField(max_length=100, null=False,default="18%")
#     original_order = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True,related_name="original_order")