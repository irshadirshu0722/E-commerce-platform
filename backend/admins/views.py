import traceback
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import random
from faker import Faker
import requests

from .utils import salesOverView,toLabelData,toFulldayFormat
from .models import Category, Product,ProductImage
from rest_framework.views import APIView 
from rest_framework.permissions import IsAdminUser
from admins.models import *
from django.db.models import Sum, Count,Case,When,F,Value,FloatField,DecimalField,IntegerField
from django.db.models.functions import Round
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncDay,ExtractDay
from django.shortcuts import render
from io import BytesIO
import cloudinary.uploader

def new_feature(request):
    # Your view logic here
    return render(request, 'admins/new_admin_site.html')  # You may want to create this template
def add_products(request):
    print('hi-1')
    fake = Faker()
    category = Category.objects.all()
    specialisation = [1,2,3,4]
    contains = [1,2]
    for cat in  category:
      for _ in range(5):
          print('hi1')
          num_words = random.randint(3, 6)
          sample_name = ' '.join(fake.words(nb=num_words))
          sample_price = round(random.uniform(10, 100), 2)
          sample_stock = random.randint(0, 100)
          sample_category = cat
          sample_package_contain = {"weight": f"{random.randint(1, 10)} kg", "dimensions": f"{random.randint(5, 20)}x{random.randint(5, 20)}x{random.randint(5, 20)} inches"}
          sample_additional_information = {"manufacturer": f"Manufacturer {_}", "origin": f"Origin {_}"}
          print('hi2')
          # Create a new Product instance and save to the database
          product = Product.objects.create(
              name=sample_name,
              actual_price=sample_price,
              stock=sample_stock,
              category=sample_category,
              created_at=timezone.now(),
              updated_at=timezone.now(),
              price =100
          )
          print('hi3')
          for spec_id in specialisation:
                try:
                    spec = ProductSpecialisation.objects.get(id=spec_id)
                    product.specializations.add(spec)
                except ProductSpecialisation.DoesNotExist:
                    print(f"ProductSpecialisation with ID {spec_id} does not exist.")
          print('hi4')
          for contain_id in contains:
                try:
                    contain = ProductPackageContain.objects.get(id=contain_id)
                    product.package_contains.add(contain)
                except ProductPackageContain.DoesNotExist:
                    print(f"ProductPackageContain with ID {contain_id} does not exist.")
          print('hi5')
          product.save()
    return HttpResponse("Bulk products added successfully.")


def get_random_image_link(width=800, height=600):
    base_url = f"http://res.cloudinary.com/dg3m2vvvs/image/upload/v1712134492/product/images/bdubjmqxiumr4nimfavk.jpg"
    return base_url
    response = requests.get(base_url + endpoint)
    
    if response.status_code == 200:
        return response.content
    else:
        return None

def add_products_images(request):
    products = Product.objects.all()
    for product in products:
        for _ in range(3):
            try:
                image_data = get_random_image_link()
                if not image_data:
                    return HttpResponse("Error fetching image data", status=500)
                # Directly assign the image URL to the ProductImage model
                ProductImage.objects.create(
                    image=get_random_image_link(),
                    product=product
                )
            except cloudinary.exceptions.Error as e:
                traceback.print_exc()
                return HttpResponse(f"Cloudinary error: {e}", status=500)
            except Exception as e:
                traceback.print_exc()
                return HttpResponse(f"Error while fetching or saving images: {e}", status=500)
    
    return HttpResponse("Bulk images added successfully.")


class AdminVerifyView(APIView):
  permission_classes = [IsAdminUser]
  def get(self,request):
      return HttpResponse(status=status.HTTP_200_OK)
class AdminDashBoardView(APIView):
    permission_classes = [IsAdminUser]
    def post(self,request):
      custom_sales_overview_date = request.data.get('custom_sales_overview_date',None)
      best_selling_products_query = OrderItem.objects.values('product_id', 'product_name').annotate(total_amount =Round(Sum('total'), 2),total_quantity = Sum('quantity'),total_orders = Count('product_id')).order_by('-total_orders')
      best_selling_products_data = list(best_selling_products_query)
      all_time_sales_overview = salesOverView()
      custom_sales_overview = salesOverView(date=custom_sales_overview_date)
      order_condition = When(is_return_order=False,then=Value(1))
      return_condition = When(is_return_order=True,then=Value(1))
      total_order_return = Order.objects.aggregate(
          orders=Sum(Case(order_condition,default=Value(0),output_field=IntegerField())),
          return_orders = Sum(Case(return_condition,default=Value(0),output_field=IntegerField()))
      )
      order_status = list(Order.objects.values('status__status').annotate(count=Count('status__status')).all())
      return_order_status = list(Order.objects.values('status__status').annotate(count=Count('status__status')).all())
      order_status_dict = {entry['status__status']: entry['count'] for entry in order_status if entry['status__status'] is not None}
      return_order_status_dict = {entry['status__status']: entry['count'] for entry in return_order_status if entry['status__status'] is not None}
      order_status_data = {
        'confirmed':order_status_dict.get('confirmed',0),
        'received':order_status_dict.get('received',0),
        'shipped':order_status_dict.get('shipped',0),
        'completed':order_status_dict.get('completed',0),
        'cancelled':order_status_dict.get('cancelled',0)+return_order_status_dict.get('cancelled',0),
        'request_received':return_order_status_dict.get('request_received',0),
        'request_confirmed':return_order_status_dict.get('request_confirmed',0),
        'product_received':return_order_status_dict.get('product_received',0),
        'replacement':return_order_status_dict.get('replacement',0),
        'refunded':return_order_status_dict.get('refunded',0),
        'resolved':return_order_status_dict.get('resolved',0),
      }
      last_30_days = timezone.datetime.today() - timedelta(days=30)
      # this will give order  and gross sales 
      orders_bar_chart_data = list(Order.objects.filter(_order_at__gte=last_30_days) \
        .annotate(day=ExtractDay('_order_at')) \
        .values('day') \
        .annotate(orders=Count(Case(order_condition)),
                  sales=Sum('profit',default=Value(0),output_field=DecimalField(max_digits=10, decimal_places=2))))
      orders_bar_chart = toFulldayFormat(last_30_days,orders_bar_chart_data,'orders')
      sales_bar_chart = toFulldayFormat(last_30_days,orders_bar_chart_data,'sales')
      return JsonResponse(data={
            'best_selling_products': best_selling_products_data,
            'all_time_sales_overview': all_time_sales_overview,
            'custom_sales_overview': custom_sales_overview,
            'total_order_return':toLabelData(total_order_return),
            'order_status':toLabelData(order_status_data),
            'orders_bar_chart':orders_bar_chart,
            'sales_bar_chart':sales_bar_chart,
      }, status=status.HTTP_200_OK)
    


