from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from admins.models import *
@receiver(post_save, sender=OrderItem)
def update_product_rating(sender, instance, created, **kwargs):
  if created:
    product = Product.objects.get(id=instance.product_id)
    ProductFeedback.objects.create(user = instance.order.user,order_item = instance ,product=product,star_rating=0)