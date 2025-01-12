import traceback
from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from admins.models import *
from .serializers import *
from users_order.serializers import OrderItemSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOrderItemAuther
from .utils import update_order_feedback
# Create your views here.

class ProductFeedbackView(APIView):
  permission_classes = [IsAuthenticated,IsOrderItemAuther]
  def post(self,request):
    order_items_data = request.data.get('order_items')
    if not order_items_data:
        return JsonResponse({"message": "No order items provided"}, status=status.HTTP_400_BAD_REQUEST)
    feedback_data_list = [order_item['feedback'] for order_item in order_items_data]
    try:
      update_order_feedback(feedback_data_list)
      return  JsonResponse({"message":f'Feedback submitted successfully'},status=status.HTTP_200_OK,safe=False)
    except BaseException as e:
        traceback.print_exc()
        return JsonResponse({"message":f'Bad request{e}'},status=status.HTTP_400_BAD_REQUEST,safe=False)






