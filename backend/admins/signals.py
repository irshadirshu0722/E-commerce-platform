from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from admins.models import Cart

# @receiver(pre_save, sender=Order)
# def order_updated(sender, instance, **kwargs):
#     if instance.pk is not None:  # Check if the instance already exists
#         original_instance = Order.objects.get(pk=instance.pk)
#         if original_instance.status == 'Cancelled' and instance.status != 'Cancelled':
#             # Store the error message temporarily using a custom solution
#             instance._cancelled_order_error = _("Cancelled orders cannot be changed.")
#             # Prevent the save operation by raising an exception
#             raise ValueError("Cancelled orders cannot be changed.")
