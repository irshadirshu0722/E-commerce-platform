from rest_framework import serializers
from django.contrib.auth.models import User
from django.conf import settings
from admins.models import *
from .exceptions import *
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from django.db.models import Max
from .utils import *

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        exclude = ('created_at','updated_at','id')
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Change all keys to camelCase
        data =snake_to_camel(data)
        return  data
    
    # this will convert the camel to snake format before validation
    def to_internal_value(self, data):
        data = camel_to_snake(data)
        return super().to_internal_value(data)

class LoginSerializer(serializers.ModelSerializer):
    auth_token = serializers.SerializerMethodField()
    cart_quantity = serializers.SerializerMethodField()
    room_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['email', 'password', 'auth_token','username','cart_quantity','room_name']
        extra_kwargs = {
            'password': {'write_only': True},
            'username':{'read_only':True}
        }
    def get_auth_token(self, obj):
        user = obj
        token, created = Token.objects.get_or_create(user=user)
        return token.key
    def get_cart_quantity(self, obj):
        user_cart = obj.cart
        return user_cart.quantity
    def get_room_name(self,obj):
        room  = obj.chat_room
        return room.name
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if email and password:
            is_user = User.objects.filter(email=email).first()
            if not is_user:
                raise UserNotExist
            if not is_user.check_password(password):
                raise UserNotExist
        else:
            raise UserNotExist
        return is_user

class Registerserializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','password']
    def validate(self, attrs):
        is_email_already_exist = User.objects.filter(email=attrs['email']).first()
        if is_email_already_exist:
            raise EmailAlreadyExist
        is_username_exist = User.objects.filter(username=attrs['username']).first()
        if is_username_exist:
            raise UsernameAlreadyExist
        return super().validate(attrs)

class CategoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryImage
        fields = ('image_url',)

class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_name','id']

class CategorySerializer(serializers.ModelSerializer):
    image = CategoryImageSerializer(read_only=True)
    class Meta:
        model = Category
        fields = ['category_name', 'image','id']
    def to_representation(self, instance):
        data =  super().to_representation(instance)
        if data['image']:
            data['image_url'] = data['image']['image_url']
        else:
            data['image_url'] = settings.DEFAULT_IMAGE
        data.pop('image')
        return data

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image_url',)

class ProductRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRating
        exclude = ['id','product']

class ProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields='__all__'

class ProductSpecialisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecialisation
        fields='__all__'

class ProductPackageContainSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPackageContain
        fields='__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    rating = ProductRatingSerializer()
    brand = ProductBrandSerializer()
    specializations = ProductSpecialisationSerializer(many=True)
    package_contains = ProductPackageContainSerializer(many=True)
    class Meta:
        model = Product
        exclude =['created_at','updated_at','tags']
    def to_internal_value(self, data):
        data= super().to_internal_value(data)
        images = data['images']
        if len(images)==0:
            images.append({'image_url':settings.DEFAULT_IMAGE})
        data['images'] = images
        return data

class HighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Highlight
        fields = ['image_url']
    def to_representation(self, instance):
        data =  super().to_representation(instance)
        data['banner_text'],data['description'] = getBannerPhrases()
        return data

class AdminContactDetailsSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = AdminContactDetails
        fields = '__all__'

class AdminPaymentModeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminPaymentMode
        fields = '__all__'

class AdminDeliveryDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminDeliveryDetails
        fields = '__all__'

class OfferImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfferImage
        fields = ('image_url',)

class TagSerializer(serializers.ModelSerializer):
    search_name = serializers.CharField(source='name')  # Specify 'search_name' as the field name
    image = OfferImageSerializer()
    class Meta:
        model = Tag
        fields = ['search_name','image']
    def to_representation(self, instance):
        offer_products = instance.products.all()
        max_offer_percent = offer_products.aggregate(Max('offer'))['offer__max']
        data = super().to_representation(instance)
        data['display_text'] = getOfferPhrase(max_offer_percent)
        if data['image']:
            data['image_url'] = data['image']['image_url']
        else:
            data['image_url'] = settings.DEFAULT_IMAGE
        data.pop('image')
        return data
        
class ShippingAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    address = AddressSerializer()
    class Meta:
        model = ShippingAddress
        exclude = ('created_at','updated_at','id')

class BillingAddressSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = ShippingAddress
        exclude = ('created_at','updated_at')
    def save(self, **kwargs):
        return super().save(**kwargs)
# password reset serializer
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OfferHighlightSerializer(serializers.ModelSerializer):

    class Meta:
        model = Offer
        exclude = ['_end_date','_start_date']


class OfferSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Offer
        fields = ['offer_name', 'discount_type', 'discount', 'start_date','image_url', 'end_date', 'highlight','search_key']

class ProductListSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    offer = OfferSerializer()
    brand = ProductBrandSerializer()
    rating = serializers.SerializerMethodField()
    total_rating = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ('id','name','price','actual_price','offer','images','stock','brand','rating','total_rating')
    def get_rating(self,obj):
        if obj.rating and obj.rating.overall is not None:
            return obj.rating.overall
        return None
    def get_total_rating(self,obj):
        total = 0
        if obj.rating:
            rating = obj.rating
            total+=rating.one_star or 0
            total+=rating.two_star or 0
            total+=rating.three_star or 0
            total+=rating.four_star or 0
            total+=rating.five_star or 0
        return total
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        images = representation.pop('images')
        if len(images)!=0:
            representation['image_url'] = (images[-1]).get('image_url')
        else:
            representation['image_url'] = settings.DEFAULT_IMAGE 
        return representation