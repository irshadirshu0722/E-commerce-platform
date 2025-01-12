from rest_framework import serializers
from admins.models  import *
from users.serializers import *



class CartItemsSerializer(serializers.ModelSerializer):
  product = ProductListSerializer( read_only=True)
  class Meta:
    model = CartItem
    fields = '__all__'

class CouponCodeSerializer(serializers.ModelSerializer):
  class Meta:
    model = CouponCode
    exclude = ('created_at','updated_at',)

class CartSerializer(serializers.ModelSerializer):
  cart_items = CartItemsSerializer(many=True, read_only=True, source='cart_items.all')
  coupon_code = CouponCodeSerializer(read_only=True)
  class Meta:
    model = Cart
    fields = '__all__'

class ProductNotifySerializer(serializers.ModelSerializer):

  class Meta:
    model = ProductNotifyUser
    fields = "__all__"
