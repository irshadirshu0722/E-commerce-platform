from decimal import Decimal
from time import sleep
import traceback
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from .tasks import send_password_reset_email_celery
from .serializers import *
from django.http import JsonResponse,HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from admins.models import *
from .serializers import *
from rest_framework.generics import RetrieveAPIView
from rest_framework.authentication import BasicAuthentication
# from tasks import send_mail_func
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import datetime
from django.db.models import Q ,Count
from django.db.models.functions import Length
from users.signals import create_missing_addresses_signal
from django.db import IntegrityError
from django.db.models import Max, Min
from .utils import custom_get_or_create 
# Create your views here.

def send_mail(request):
    # send_mail_func()
    return HttpResponse('<h1> HI email is just send</h1>')

class SampleView(APIView):
    def get(self,request):
        sleep(3)
        return JsonResponse({"message":'response is ok'},status=status.HTTP_503_SERVICE_UNAVAILABLE)

class LoginApiView(APIView):
    serializer_class = LoginSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            if serializer.is_valid():
                return JsonResponse(serializer.data,status=status.HTTP_200_OK)
        except UserNotExist:
            return JsonResponse({'error':'Email or Password is incorrect'},status=status.HTTP_401_UNAUTHORIZED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterApiView(APIView):
    serializer_class = Registerserializer
    def post(self, request):
            serializer = self.serializer_class(data=request.data)
            try:
                if serializer.is_valid(raise_exception=True):
                    new_user = serializer.save()
                    new_user.set_password(request.data.get('password'))
                    new_user.save()
                    return JsonResponse({'message': 'User registered successfully'}, status=200)
                else:
                    error_message = 'There are some errors in the registration data'
                    return JsonResponse({'error': error_message}, status=400)
            except EmailAlreadyExist:
                traceback.print_exc()
                error_message = 'Email address already exists'
                return JsonResponse({'error': error_message}, status=409)
            except IntegrityError :
                traceback.print_exc()
                print("enter in error")
                return JsonResponse({'error': "Username already exists"}, status=409)
            except Exception as e :
                traceback.print_exc()
                if 'username already exists' in str(e).lower():
                    error_message = 'Username already exists'
                    return JsonResponse({'error': error_message}, status=409)
                else:
                    # Handle other IntegrityError cases if needed
                    return JsonResponse({'error': 'An error occurred during registration'}, status=500)

class TokenVerificationView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        email = request.user.email
        username = request.user.username
        cart_quantity = request.user.cart.quantity
        room_name = request.user.chat_room.name
        return JsonResponse({'email':email,"username":username,"quantity":cart_quantity,'room_name':room_name,'is_admin':request.user.is_superuser}, status=status.HTTP_200_OK)

class PasswordChangeView(APIView):
    permission_classes   = (IsAuthenticated,)

    def put(self,request):
        username = request.user.username
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        user = authenticate(username=username, password = current_password)
        if not user:
            return JsonResponse({'error':"Invalid current password"},status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            user.set_password(new_password)
            user.save()
            return JsonResponse({"message":"Password updated"},status=status.HTTP_200_OK)

class AddressView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AddressSerializer
    def get(self,request):
        user = request.user
        create_missing_addresses_signal.send(sender=None,user=user)
        shipping_instance = user.shipping_address.address
        billing_instance = user.billing_address.address
        shipping_address_serializer = self.serializer_class(shipping_instance)
        billing_address_serializer = self.serializer_class(billing_instance)
        return JsonResponse({'shipping_address':shipping_address_serializer.data,"billing_address":billing_address_serializer.data},status = status.HTTP_200_OK)
    def put(self, request):
        try:
            address_type = request.data.get('type', None)
            if not address_type:
                raise ValueError("Type not mentioned")
            user = request.user
            create_missing_addresses_signal.send(sender=None, user=user)
            if 'shipping' in address_type:
                shipping_address_data = request.data.get('address', None)
                if not shipping_address_data:
                    raise ValueError("Shipping address does not exist")
                shipping_instance = user.shipping_address.address
                serializer = self.serializer_class(instance=shipping_instance, data=shipping_address_data) 
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return JsonResponse({'shipping_address': serializer.data}, status=status.HTTP_200_OK)
                else:
                    raise ValueError("Validation error")
            elif 'billing' in address_type:
                billing_address_data = request.data.get('address', None)
                if not billing_address_data:
                    raise ValueError("Billing address does not exist")
                billing_instance = user.billing_address.address
                serializer = self.serializer_class(instance=billing_instance, data=billing_address_data) 
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return JsonResponse({'billing_address': serializer.data}, status=status.HTTP_200_OK)
                else:
                    raise ValueError("Validation error")
        except ValueError as e:
            traceback.print_exc()
            return JsonResponse({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
# data 
class HomeView(APIView):
    def get(self,request):
        # return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
        categories = Category.objects.all()
        highlight = Highlight.objects.all().first()
        if not highlight:
            highlight = Highlight.objects.create()
            highlight.image = settings.DEFAULT_HIGHLIGHT_IMAGE
            highlight.save()

        latest_products = Product.objects.order_by('-created_at')
        if latest_products.exists():
            latest_products = latest_products[:8]
        else:
            latest_products = []
        offers = Offer.objects.filter(highlight=True).all()
        category_serializer = CategorySerializer(categories, many=True)
        highlight_serializer = HighlightSerializer(highlight)
        latest_product_serializer = ProductListSerializer(latest_products, many=True)
        offers_serializer = OfferSerializer(offers,many=True)
        data = {
            "categories": category_serializer.data,
            "highlight": highlight_serializer.data,
            'latest_offers':offers_serializer.data,
            'latest_products':latest_product_serializer.data,
        }
        return JsonResponse(data, status=status.HTTP_200_OK,safe=False)

class CategoryItemsView(APIView):
    def get(self,request,pk,page_no):
        try:
            category_id = pk
            queryset = Category.objects.get(id=category_id)
            if not queryset:
                raise CategoryNotExist
            queryset = queryset.products.all()
            paginator = Paginator(queryset, 12)  
            try:
                items = paginator.page(page_no)
            except PageNotAnInteger:
                items = paginator.page(1)
            except EmptyPage:
                items = paginator.page(paginator.num_pages)
            products = ProductListSerializer(items, many=True)
            categories_query = Category.objects.all()
            categories = CategoryListSerializer(categories_query,many=True)
            data = {
                "products": products.data,
                "pagination":{
                    "totalPages":paginator.num_pages,
                    'currentPage':items.number,
                },
                'categories':categories.data
            }
        
            return JsonResponse(data, status=status.HTTP_200_OK,safe=False)

        except Exception as e:
            print(e)
            return HttpResponse(status = status.HTTP_400_BAD_REQUEST) 

class ProductDetailView(APIView):
    serializer_class = ProductSerializer
    def get(self,request,pk):
        product = Product.objects.get(id=pk)
        if not product:
            return JsonResponse({"message":"product not exist"},status=status.HTTP_404_NOT_FOUND)
        product_serializer = self.serializer_class(product)
        category_products = product.category.products.all()
        category_products = category_products.exclude(id=pk)
        related_product = category_products[:10] if len(category_products)>10 else category_products
        related_product_serializer = ProductListSerializer(related_product,many=True)
        products_data = product_serializer.data
        data={
            "product":products_data,
            'related_products':related_product_serializer.data
        }
        
        return JsonResponse(data,status=status.HTTP_200_OK)

class SerachProduct(APIView):

    def post(self,request,search_name,page_no):
        try:
            filter_details = request.data.get('filterDetails', {})
            queryset = get_filtered_queryset(search_name, filter_details)
            paginator = Paginator(queryset, 15)
            page_items = get_page_items(paginator, page_no)
            products = ProductListSerializer(page_items, many=True).data
            filter_details = get_filter_details(filter_details, queryset)
            data = get_response_data(products, paginator, filter_details,page_items)
            return JsonResponse({"data": data}, status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):
    def post(self,request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            if user:
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                token = default_token_generator.make_token(user)
                reset_link = f'{settings.FRONTEND_URL}/password-reset?uid={uid}&token={token}'
                send_password_reset_email_celery.apply_async( args=[email, reset_link])
                return HttpResponse(status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self,request,uidb64,token):
        
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        if user and default_token_generator.check_token(user, token):
            password = request.data.get('password')
            user.set_password(password)
            user.save()
            return HttpResponse( status=status.HTTP_200_OK)
        return JsonResponse({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class NotifyProductView(APIView):
    def post(self,request):
        data = request.data
        try:
            product_id = data.get('product_id',None)
            name = data.get('name',None)
            email = data.get('email',None)
            if not product_id or not name or not email:
                raise "Bad request"
            product = Product.objects.get(id=product_id)
            if not product:
                raise "product not exist"
            notify_user = ProductNotifyUser.objects.create(name=name,email=email)
            product.add_user_to_notify(notify_user)
            return JsonResponse({'message':"Successfully"},status = status.HTTP_200_OK)
        except :
            return HttpResponse(status = status.HTTP_400_BAD_REQUEST)
        
class GlobalDataView(APIView):
    def get(self,request):
        try :
            print('request comes')
            contact_details = AdminContactDetails.objects.first()
            payment_modes = PaymentDetails.objects.first()
            delivery_details = AdminDeliveryDetails.objects.first()
            contact_details_serializer = AdminContactDetailsSerializer(contact_details)
            payment_modes_serializer = AdminPaymentModeSerializer(payment_modes)
            delivery_details_serializer = AdminDeliveryDetailsSerializer(delivery_details)
            return JsonResponse({"contact_details":contact_details_serializer.data,"payment_mode":payment_modes_serializer.data,'delivery_details':delivery_details_serializer.data},status=status.HTTP_200_OK)
        except (AdminContactDetails.DoesNotExist,PaymentDetails.DoesNotExist,AdminDeliveryDetails.DoesNotExist):
            return HttpResponse(status=status.HTTP_404_NOT_FOUND)

