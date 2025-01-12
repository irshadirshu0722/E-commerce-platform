from django.db.models.signals import post_save,pre_delete,pre_save,post_delete
from django.dispatch import receiver
from admins.models import *
from .serializers import ProductNotifySerializer
from users.serializers import ProductListSerializer
from users.tasks import sent_mail_product_notify_user
@receiver(pre_save, sender=Cart)
def update_cart_and_discount(sender, instance, **kwargs):
    if instance.pk:
        cart_items = instance.cart_items.all()
        instance.quantity = sum(item.quantity for item in cart_items)
        instance.subtotal = sum(item.total for item in cart_items)
    if instance.coupon_code and instance.subtotal < instance.coupon_code.min_order:
        instance.coupon_code = None
        instance.discount = 0
    if not instance.coupon_code:
        instance.discount = 0
    if instance.coupon_code:
        discount = 0
        if instance.coupon_code.discount_amount:
            discount += instance.coupon_code.discount_amount
        if instance.coupon_code.discount_rate:
            discount += (instance.subtotal / 100) * instance.coupon_code.discount_rate
        instance.discount = discount
    instance.total = instance.subtotal - instance.discount



@receiver(pre_save, sender=CartItem)
def update_cart_item(sender, instance, **kwargs):
    if instance.quantity==0:
        instance.delete()
        return
    current_stock = instance.product.stock
    if instance.quantity > current_stock:
        instance.quantity = current_stock
    else:
        print("product is available")
    instance.total = instance.quantity * instance.product.price


@receiver(post_save,sender=CouponCode)
def updateCartWithNewCoupon(sender,instance,created,**kwargs):
  if not created:
    cart_with_this_coupon = Cart.objects.filter(coupon_code=instance).all()
    for cart in cart_with_this_coupon:
        cart.save()
@receiver(pre_delete, sender=CouponCode)


def delete_cart_discounts(sender, instance, **kwargs):
    carts_with_this_coupon = Cart.objects.filter(coupon_code=instance).all()
    for cart in carts_with_this_coupon:
        cart.coupon_code = None
        cart.save()

@receiver(pre_save, sender=Product)
def sent_mail_notify_user(sender, instance, **kwargs):
    old_instance = Product.objects.get(id=instance.id)
    if old_instance.stock == 0 and instance.stock > 0:
        users = old_instance.notify.all()
        if users:
            sent_mail_product_notify_user.apply_async((ProductNotifySerializer(users,many=True).data,ProductListSerializer(instance).data))
        old_instance.notify.clear()
        old_instance.save()
@receiver(post_save, sender=Product)
def updates_product_details_in_cart(sender, instance, **kwargs):
    product_in_carts = CartItem.objects.filter(product=instance).all()
    users = instance.notify.all()
    users.delete()
    for cartitems in product_in_carts:
        cart = cartitems.cart
        cartitems.save()
        cart.save()

@receiver(pre_delete, sender=Product)
def updates_product_details_in_cart(sender, instance, **kwargs):
    product_in_carts = CartItem.objects.filter(product=instance).all()
    for cartitems in product_in_carts:
        cart = cartitems.cart
        cartitems.delete()
        cart.save()
