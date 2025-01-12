import traceback
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.views import APIView
from .permissions import *
from .serializers import *
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from admins.models import *
from rest_framework.generics import RetrieveAPIView
from users_cart.serializers import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.response import Response

# Create your views here.

class OrdersView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderListSerializer
    def get(self, request,type,page):
        try:
            if type=='order':
                queryset = Order.objects.filter(user=request.user,is_return_order=False).order_by('-_order_at')
            elif type == 'return_order':
                queryset = Order.objects.filter(user=request.user,is_return_order=True).order_by('-_order_at')
            else:
                queryset = Order.objects.filter(user=request.user).order_by('-_order_at')
            paginator = Paginator(queryset, 12)  # Create a Paginator object with 10 items per 
            try:
                items = paginator.page(page)
            except PageNotAnInteger:
                items = paginator.page(1)
            except EmptyPage:
                items = paginator.page(paginator.num_pages)
            orders = self.serializer_class(items, many=True)
            data = {
                'order_icon':settings.ORDER_ICON_IMAGE_COLOR,
                "orders": orders.data,
                "pagination":{
                    "currentPage":items.number,
                    'totalPages':paginator.num_pages,
                }
            }
            return JsonResponse(data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return JsonResponse({'message': "No orders found for the user"}, status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
            return JsonResponse({'message':"sufficient data not present"},status=status.HTTP_400_BAD_REQUEST)
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated,IsOrderAuther]
    serializer_class = OrderSerializer
    def get(self, request, id):
        try:    
            order_instance = Order.objects.filter(user=request.user, id=id).first()
            
            if order_instance:
                order_serializer = self.serializer_class(order_instance)
                serialized_data = order_serializer.data
                return JsonResponse({'data': serialized_data}, status=status.HTTP_200_OK)
        except :
            traceback.print_exc()
            return JsonResponse({'message': "No orders found for the user"}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({'message': "No orders found for the user"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self,request,id):
        try:
            order = Order.objects.get(id=id)
            if not order or not order.can_cancel:
                raise "cannot cancel this order or not found"
            order_status = order.status
            order_status._cancelled_date = datetime.datetime.now()
            order_status.status = 'cancelled'
            order_status.save()
            order.save()
            return JsonResponse({'message':"Order cancelled "},status=status.HTTP_200_OK)
        except:
            traceback.print_exc()
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
class PlaceOrderView(APIView):
    permission_classes=[IsAuthenticated]
    serializer_class = OrderSerializer
    #====================== check cart for placeorder ======================
    def get(self,request):
        try:
            cart  = request.user.cart
            cart_items = cart.cart_items.all()
            out = cart.check_cart_items()
            if out:
                return HttpResponse(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            if(not cart):
                raise CartNotExist
            if(not cart_items):
                raise CartItemsNotExist
            order_details = PlaceOrderDetailsSerializer(cart,context={'request': request,'cart_items':cart_items}).data
            contact_details = AdminContactDetails.objects.first()
            if contact_details:
                contact_details = ContactDetailsSerializer(contact_details).data
            else:
                contact_details = {'whatsapp_number':7025359287,"email":"klelectronics@gmail.com"} 
            deliverycharge_detail = AdminDeliveryDetails.objects.first()
            if deliverycharge_detail:
                deliverycharge_detail = DeliveryChargeDetailsSerializer(deliverycharge_detail).data
            payment_modes =  AdminPaymentMode.objects.first()
            payment_modes_data = None
            if payment_modes:
                payment_modes_data = AdminPaymentModesSerializer(payment_modes).data
            cart_details = CartSerializer(cart).data
            json = {
                'place_order_data':{
                        'bankdetails':contact_details,
                        'delivery_details':deliverycharge_detail,
                        'cart':cart_details,
                        'payment_modes':payment_modes_data
                },
                'order_details':order_details
                
            }
            return JsonResponse({'data': json, 'message': "Cart verified. Proceed to checkout."}, status=status.HTTP_200_OK)
        except Exception as e :
            print(e)
            traceback.print_exc()
            return JsonResponse({'message':"sufficient data not present"},status=status.HTTP_400_BAD_REQUEST)

#====================== PlaceOrder ============================
    def post(self,request):
        serializer = self.serializer_class(data=request.data,context={'request': request})
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                bank_details = BankDetailSerializer(AdminContactDetails.objects.first()).data
                data=serializer.data
                return JsonResponse({'order':data,"bank_details":bank_details},status=status.HTTP_201_CREATED)
        except Exception as e :
            traceback.print_exc()
            print(e)
            return JsonResponse({'message':"sufficient data not present"},status=status.HTTP_400_BAD_REQUEST)
    
class ReturnOrderView(APIView):
    permission_classes=[IsAuthenticated,IsOriginalOrderAuther]
    serializer_class = ReturnOrderSerializer
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return JsonResponse({'message':'Return order placed'},status=status.HTTP_201_CREATED)
        except:
            traceback.print_exc()
            return JsonResponse({'message':"sufficient data not present"},status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({'message':"sufficient data not present"},status=status.HTTP_400_BAD_REQUEST)

    








