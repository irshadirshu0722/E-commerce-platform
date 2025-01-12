import traceback
from django.db.models.signals import post_save,pre_delete,pre_save,post_delete
from django.dispatch import receiver
from admins.models import OrderStatus,AdminContactDetails,AdminDeliveryDetails
from mail_senter.tasks import send_mail_to_user
from .serializers import OrderSerializer
from users.serializers import AdminContactDetailsSerializer
from .tasks import auto_disable_can_return,auto_complete_order
from django.conf import settings
from admins.utils import get_order_control_data
@receiver(pre_save,sender=OrderStatus)
def sent_mail(sender,instance,**kwargs):
    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        old_instance = None
    order = instance.get_order
    if order and old_instance and old_instance.status != instance.status:
        try:
            admin_contact_data = None
            if instance.status =='request_confirmed'  or instance.status == 'replacement':
                admin_contact_data = AdminContactDetailsSerializer(AdminContactDetails.objects.first()).data
            send_mail_to_user.apply_async((OrderSerializer(order).data,instance.status,order.user.username,order.user.email,admin_contact_data))
        except Exception as e:
            traceback.print_exc()
            print('Error while sending mail')
    if order and old_instance and old_instance.status != 'completed' and instance.status =='completed':
        return_days,_ = get_order_control_data()
        auto_disable_can_return.apply_async((order.id,), countdown=return_days*24*60*60)
        delivery_details = AdminDeliveryDetails.objects.first().max_delivery_days
        auto_complete_order.apply_async((order.id,), countdown=60)



