import datetime
from pprint import pprint
import traceback
from celery import shared_task
from mailjet_rest import Client
from django.template.loader import render_to_string
from admins.models import Order
from admins.models import AdminEmailProvider
from admins.models import Order
@shared_task
def auto_cancel_order(order_id):
  try:
    order = Order.objects.get(id=order_id)
    status = order.status
    if not  status._confirmed_date :
      status.status = 'cancelled'
      status._cancelled_date = datetime.datetime.now()
      status.save()
  except :
    traceback.print_exc()

@shared_task()
def auto_disable_can_return(order_id):
  try:
    order = Order.objects.get(id=order_id)
    order.can_return = False
    order.save()
  except :
    traceback.print_exc()


@shared_task()
def auto_complete_order(order_id):
  try:
    order = Order.objects.get(id=order_id)
    status = order.status
    if status!='completed':
      status.status = 'completed'
      status._completed_date = datetime.datetime.now()
      status.save()
      order.save()
  except :
    traceback.print_exc()