from django.shortcuts import render
from admins.models import *
from django.http import JsonResponse,HttpResponse
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from users.serializers import ProductSerializer
from django.shortcuts import get_object_or_404
import traceback
import json
from admins.exceptions import *
# Create your views here.

class CartTempView(APIView):
  # temp user
  def post(self,request):
    products = []
    for cart_item in request.data.get('cart_items',[]):
      products.append({"product":ProductSerializer(Product.objects.get(id=cart_item.get('id',1))).data,
      'quantity':cart_item.get('quantity',1),
      'total':cart_item.get('total',1),
    })

    return JsonResponse({'cart_items':products},status=status.HTTP_200_OK)
  
class CartView(APIView):
  permission_classes = (IsAuthenticated,)
  serializer = CartSerializer

  # ============= Get Cart details ==================
  def get(self,request):
    cart = request.user.cart
    serializer = self.serializer(cart)
    return JsonResponse({'cart':serializer.data},status=status.HTTP_200_OK)
  #================ Add to cart ==============================
  def post(self,request):
    try:
      try:
        cart = request.user.cart
        print(request.data.get('id'))
        product = get_object_or_404(Product,id=request.data.get('id'))
        quantity = request.data.get('quantity')
        is_already_exist=cartitem = cart.cart_items.filter(product=product).first()
        if is_already_exist:
          cartitem.quantity+=quantity
        else:
          cartitem = CartItem(cart=cart,quantity=quantity,product=product)
        cartitem.save()
        cart.save()
      except StockNotAvailable:
        return JsonResponse({'error': 'Stock not available. Already in cart'}, status=status.HTTP_410_GONE)
      return JsonResponse({'quantity':cart.quantity,'message':"Product added to cart"},status=status.HTTP_201_CREATED)
    except Exception as e:
      traceback.print_exc()
      return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    
class CartItemDeleteView(APIView):
  permission_classes = (IsAuthenticated,)

#================ Cart Item Delete ==============================
  def delete(self,request,id):
    try:
      cart = request.user.cart
      cart_item = cart.cart_items.get(id=id)
      if cart_item:
        cart_item.delete()
      cart.save()
    except:
      return JsonResponse({'error':"id not given"},status=status.HTTP_400_BAD_REQUEST)
    
    return HttpResponse(status=status.HTTP_204_NO_CONTENT)

class CartItemsUpdateView(APIView):
  permission_classes = (IsAuthenticated,)

  #================ Cart Update ==============================
  def put(self,request):
    try:
      cartitems = request.data.get('cart_items')
      cart = request.user.cart
      is_stock_exception_occutred = False
      for cartitem in cartitems:
        try:
          current_cartitem = cart.cart_items.get(id=cartitem.get('id'))
          quantity = cartitem.get('quantity')

          if isinstance(quantity,int) and current_cartitem.quantity !=cartitem.get('quantity'):
            current_cartitem.quantity = quantity
            current_cartitem.save()
        except CartItem.DoesNotExist:
          print('cart items doesnt exist')
        except StockNotAvailable:
          is_stock_exception_occutred = True
      cart.save()
    except Exception as e:
      print(traceback.print_exc())
      return JsonResponse({"error":"read error"},status=status.HTTP_400_BAD_REQUEST)
    if is_stock_exception_occutred:
      return HttpResponse(status=status.HTTP_204_NO_CONTENT)
    else:
      return JsonResponse({'message':"Cart updated"},status=status.HTTP_200_OK)


class CouponCodeView(APIView):
  permission_classes = (IsAuthenticated,)
  #================ Coupon Code add ==============================
  def post(self,request):
    try:
      user_code = request.data.get('code')
      cart = request.user.cart
      code = CouponCode.objects.filter(code=user_code).first()
      if not code:
        raise CouponCode.DoesNotExist 
      if code.min_order <= cart.subtotal:
        cart.coupon_code = code
        cart.save()
      else:
        return JsonResponse({"error": f"Order must exceed {code.min_order}."}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    except CouponCode.DoesNotExist:
      return JsonResponse({"error": "Coupon code not found."}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    return JsonResponse({'message':"Coupon code added"},status=status.HTTP_200_OK)
  #================ Coupon code delete ==============================
  def delete(self,request):
    try:
      cart = request.user.cart
      cart.coupon_code = None
      cart.save()
    except:
      return JsonResponse({"error":"read error"},status=status.HTTP_400_BAD_REQUEST)
    return HttpResponse(status=status.HTTP_204_NO_CONTENT)








