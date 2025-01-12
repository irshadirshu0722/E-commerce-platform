import traceback
from rest_framework.permissions import BasePermission
from admins.models import *
from django.shortcuts import get_object_or_404

class IsOrderAuther(BasePermission):
  def has_permission(self, request, view):
    try:
      order_id = view.kwargs.get('id')
      return  Order.objects.get(id=order_id).user == request.user
    except:
      traceback.print_exc()
      return False
class IsOriginalOrderAuther(BasePermission):
  def has_permission(self, request, view):
    order_id = request.data.get('main_order_id')
    if order_id is None:  
        return False
    try:
      return  get_object_or_404(Order, id=order_id).user == request.user
    except:

      return False
    