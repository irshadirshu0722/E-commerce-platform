from rest_framework.permissions import BasePermission
from admins.models import *
from django.shortcuts import get_object_or_404
class IsOrderItemAuther(BasePermission):
  def has_permission(self, request, view):
    try:
      order_items = request.data.get('order_items')
      for item in order_items:
          order = OrderItem.objects.get(id=item.get('id')).order
          if order.user != request.user:
            return False        
    except Exception as e:
      print(e)
      return False
    return True 
