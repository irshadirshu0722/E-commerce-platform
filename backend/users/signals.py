from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from admins.models import*
from django.contrib.auth.models import User
from django.dispatch import Signal


@receiver(post_save, sender=User, weak=False)
def create_token_cart_shipping_billing(sender,instance,created,**kwargs):
  if created:
    Token.objects.create(user = instance)
    Cart.objects.create(user=instance)
    address = Address.objects.create()
    ShippingAddress.objects.create(user=instance,address=address)
    address = Address.objects.create()
    BillingAddress.objects.create(user=instance,address=address)
    ChatRoom.objects.create(user=instance)
create_missing_addresses_signal = Signal()
@receiver(create_missing_addresses_signal)
def create_missing_addresses(sender, user, **kwargs):
    if not BillingAddress.objects.filter(user=user).exists():
        address = Address.objects.create()
        BillingAddress.objects.create(user=user,address=address)

    if not ShippingAddress.objects.filter(user=user).exists():
        address = Address.objects.create()
        ShippingAddress.objects.create(user=user,address=address)

@receiver(post_save, sender=Product, weak=False)
def create_product_rating(sender,instance,created,**kwargs):
  if created:
    ProductRating.objects.create(product=instance)

