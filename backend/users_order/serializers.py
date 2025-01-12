import traceback
from django.conf import settings
from rest_framework import serializers
from django.contrib.auth.models import User
from admins.models import *
from admins.utils import get_order_control_data
from .utils import build_status_track
from user_feedback.serializers import ProductFeedbackSerializer
from users.serializers import AddressSerializer,ProductSerializer
from users_cart.serializers import CouponCodeSerializer
from users.exceptions import *
from users.signals import create_missing_addresses_signal
from mail_senter.tasks import send_mail_to_user
from .tasks import auto_cancel_order
# from mail_senter.email_utils import send_mail_to_user
class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = ('amount','method','payment_at',)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        method = data.get('method', '').lower()
        
        if 'cash' in method:
            data["image_url"] = settings.PAYMENT_MODE_IMAGE.get('cash', '')
        elif 'bank' in method:
            data["image_url"] = settings.PAYMENT_MODE_IMAGE.get('bank', '')
        elif 'online' in method:
            data["image_url"] = settings.PAYMENT_MODE_IMAGE.get('online', '')
        else:
            data["image_url"] = settings.DEFAULT_IMAGE  # Or provide a default image URL
        return data
class OrderItemSerializer(serializers.ModelSerializer):
    feedback = ProductFeedbackSerializer(read_only=True)
    product_image_url = serializers.SerializerMethodField()
    return_item_order_id = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ('id','product_name', 'product_price', 'quantity', 'total', 'product_id', 'is_returned', 'main_order_item', 'is_product_exist', 'has_feedback','feedback','product_image_url','return_item_order_id',)
    def get_product_image_url(self,obj):
        return obj.product_image_url
    def get_return_item_order_id(self,obj):
        try:
            return_order_item = obj.return_order_item
            if return_order_item:
                order = return_order_item.order
                if order:
                    return order.id
            return None
        except:
            pass

class OrderShippingSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = OrderShipping
        fields = ['address']
class OrderBillingSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    class Meta:
        model = OrderBilling
        fields = ['address']
class BankDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminContactDetails
        fields = '__all__'
class OrderStatusSerializer(serializers.ModelSerializer):
    received_date = serializers.SerializerMethodField()
    confirmed_date = serializers.SerializerMethodField()
    shipped_date = serializers.SerializerMethodField()
    completed_date = serializers.SerializerMethodField()
    cancelled_date = serializers.SerializerMethodField()
    status_track = serializers.SerializerMethodField()
    request_received_date = serializers.SerializerMethodField()
    request_confirmed_date = serializers.SerializerMethodField()
    product_received_date = serializers.SerializerMethodField()
    replacement_date = serializers.SerializerMethodField()
    refund_date = serializers.SerializerMethodField()
    resolved_date = serializers.SerializerMethodField()
    class Meta:
        model = OrderStatus
        fields = ('received_date', 'confirmed_date', 'shipped_date', 'completed_date', 'cancelled_date', 'status','status_track','request_received_date', 'request_confirmed_date', 'product_received_date', 'replacement_date', 'refund_date', 'resolved_date',)
    def get_received_date(self, obj):
        # Logic to get received_date from the object
        return obj.received_date
    def get_status_track(self, obj):
        # Logic to get received_date from the object
        return obj.status_track

    def get_confirmed_date(self, obj):
        # Logic to get confirmed_date from the object
        return obj.confirmed_date

    def get_shipped_date(self, obj):
        # Logic to get shipped_date from the object
        return obj.shipped_date

    def get_completed_date(self, obj):
        # Logic to get completed_date from the object
        return obj.completed_date

    def get_cancelled_date(self, obj):
        # Logic to get cancelled_date from the object
        return obj.cancelled_date
    def get_request_received_date(self, obj):
        return obj.request_received_date
    
    def get_request_confirmed_date(self, obj):
        return obj.request_confirmed_date
    
    def get_product_received_date(self, obj):
        return obj.product_received_date
    
    def get_replacement_date(self, obj):
        return obj.replacement_date
    
    def get_refund_date(self, obj):
        return obj.refund_date
    
    def get_resolved_date(self, obj):
        return obj.resolved_date


# this serilizer used for frotend to share the whole data about ordering data
class PlaceOrderDetailsSerializer(serializers.ModelSerializer):
    coupon_code = CouponCodeSerializer()
    class Meta:
        model=Cart
        exclude = ('id',)
    def to_representation(self, instance):
        data =  super().to_representation(instance)
        new_data = {}
        user  = self.context['request'].user
        cart_items = self.context['cart_items']
        create_missing_addresses_signal.send(sender=None,user=user)
        billing_address_data = BillingAddressSerializer(user.billing_address).data
        shipping_address_data = BillingAddressSerializer(user.shipping_address).data
        new_data['billing_address'] = billing_address_data
        new_data['shipping_address'] = shipping_address_data
        new_data['payment_details'] = {'method': "", 'amount': data['total']}
        new_data['delivery_details'] = {'delivery_charge': 0}
        new_data['profit'] = 0
        new_data['subtotal'] = data['subtotal']
        new_data['quantity'] = data['quantity']
        coupon_code = data['coupon_code']
        if coupon_code:
            new_data['discount_details']={
                "discount_code":coupon_code['code'],
                "discount_rate":coupon_code['discount_rate'],
                "discount_amount":coupon_code['discount_amount']

            }
            # new_data['discount_code'] = coupon_code['code']
            # new_data['discount_rate'] = coupon_code['discount_rate']
            # new_data['discount_amount'] = coupon_code['discount_amount']
        else:
            new_data['discount_details']=None
        new_data['discount'] = data['discount']
        new_data['total'] = data['total']
        new_data['gst'] = f"{round((float(data['subtotal'])/100) * 18,2)}"
        new_data['is_return_order'] = False
        new_data['order_items'] = PlaceOrderItemsSerializer(cart_items,many=True).data
        new_data['is_shipping_address'] = False
        return new_data
    
# this serilizer used for frotend to share the whole data about ordering item data
class PlaceOrderItemsSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = CartItem
        exclude = ('cart',)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        new_data = {}
        product = data['product']
        new_data['product_name'] = product['name']
        new_data['product_price'] = product['price']
        new_data['quantity'] = data['quantity']
        new_data['total'] = data['total']
        new_data['product_id'] = product['id']
        new_data['is_returned'] = False
        new_data['cart_item'] = data['id']
        return new_data

class OrderListSerializer(serializers.ModelSerializer):
    status = OrderStatusSerializer()
    order_at = serializers.SerializerMethodField()
    class Meta:
        model = Order
        fields = ('order_id','id','total','quantity','discount','is_return_order','status','last_status_update_date','order_at')
    def get_order_at(self,obj):
        return obj.order_at
    def to_representation(self, instance):
        data = super().to_representation(instance)
        status_track = build_status_track(data)
        status_key = status_track[-1].get('choice')
        status_title = status_track[-1].get('title')
        data['status'] = status_title
        try:
            data['status_image_url']  = settings.ORDER_STATUS_IMAGE_URLS_COLOR[status_key]
        except:
            data['status_image_url']  = settings.DEFAULT_IMAGE
        return data
class OrderDiscountDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model=OrderDiscountDetails
        fields = '__all__'

class OrderDeliveryDetailsSerializer(serializers.ModelSerializer):
    estimated_delivery_date = serializers.SerializerMethodField()
    class Meta:
        model=OrderDeliveryDetails
        fields = ('tracking_id','delivery_charge','tracking_url','courier_service','estimated_delivery_date',)
    def get_estimated_delivery_date(self,obj):
        return obj.estimated_delivery_date

class OrderSerializer(serializers.ModelSerializer):
    payment_details = PaymentDetailsSerializer()
    order_items = serializers.ListField(write_only=True)
    shipping_address = OrderShippingSerializer(allow_null=True,required=False)
    billing_address = OrderBillingSerializer()
    original_order = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), allow_null=True, required=False)
    is_shipping_address = serializers.BooleanField(required=True,write_only=True)
    order_at = serializers.SerializerMethodField()
    order_id = serializers.SerializerMethodField()
    status = OrderStatusSerializer(required=False)
    order_items = OrderItemSerializer(many=True)
    discount_details = OrderDiscountDetailsSerializer(required=False,allow_null=True)
    delivery_details = OrderDeliveryDetailsSerializer(required=False,allow_null=True)
    is_completed  = serializers.SerializerMethodField(required=False,read_only=True)
    can_cancel  = serializers.SerializerMethodField(required=False,read_only=True)
    class Meta:
        model = Order
        exclude = ('_order_at',)
        read_only_fields = ('user','main_order')
    def get_order_at(self,obj):
        return obj.order_at
    def get_order_id(self,obj):
        return obj.order_id
    def get_is_completed(self,obj):
        return obj.is_completed
    def get_can_cancel(self,obj):
        return obj.can_cancel
    def create(self, validated_data):
        billing_address = validated_data.pop('billing_address',None)
        shipping_address = validated_data.pop('shipping_address',None)
        is_shipping_address = validated_data.pop('is_shipping_address',False)
        payment_details = validated_data.pop('payment_details',None)
        order_items = validated_data.pop('order_items',[])
        discount_details = validated_data.pop('discount_details',None)
        delivery_details = validated_data.pop('delivery_details',None)
        if not order_items:
            raise CartItemsNotExist
        if billing_address is None and not billing_address['address']:
            raise serializers.ValidationError({'billing_address': 'Billing address is required.'})
        if payment_details is None:
            raise serializers.ValidationError({'payment_details': 'Payment details is required.'})
        if billing_address:
            address_billing = Address.objects.create(**billing_address['address'])
            billing_address_instance = OrderBilling.objects.create(address = address_billing)
            validated_data['billing_address'] = billing_address_instance
        if is_shipping_address:
            address_shipping = Address.objects.create(**shipping_address['address'])
            shipping_address_instance = OrderShipping.objects.create(address = address_shipping)
            validated_data['shipping_address'] = shipping_address_instance
        if payment_details:
            payment_details_instance = PaymentDetails.objects.create(**payment_details)
            validated_data['payment_details'] = payment_details_instance
        if discount_details:
            discount_details_instance = OrderDiscountDetails.objects.create(**discount_details) 
            validated_data['discount_details'] = discount_details_instance
        if delivery_details:
            delivery_details_instance = OrderDeliveryDetails.objects.create(**delivery_details) 
            validated_data['delivery_details'] = delivery_details_instance
        user = self.context['request'].user
        user_cart = user.cart
        validated_data['user'] = user
        order_status = OrderStatus.objects.create(status='received',_received_date=datetime.datetime.now())
        validated_data['status'] = order_status
        order_instance = super().create(validated_data)

        if order_instance.payment_details.is_direct_bank_transfer:
            _,days = get_order_control_data()
            #here order will automatically cancel this order after 3 days if and if the order hasn't confirmed
            auto_cancel_order.apply_async((order_instance.id,), countdown=days*24*60*60)
        
        for item in order_items:
            if 'product_id' in item and 'product_id' in item:
                product_id = item['product_id']
                cart_product_id = item['product_id']
                OrderItem.objects.create(
                    product_name=item.get('product_name', ''),  # Assuming these keys exist in your dictionary
                    product_price=item.get('product_price', 0),
                    quantity=item.get('quantity', 0),
                    total=item.get('total', 0),
                    product_id=product_id,
                    order=order_instance,
                )
                
                # Assuming product and cart_item are related to the product_id and cart_item_id respectively
                product = Product.objects.get(id=product_id)
                cart_item = CartItem.objects.filter(product_id=cart_product_id,cart=user_cart).first()
                if cart_item:
                    cart_item.delete()
                product.stock -= item.get('quantity', 0)
                product.save()
        user_cart.save()
        order_instance.save()
        send_mail_to_user.apply_async((OrderSerializer(order_instance).data,order_status.status,order_instance.user.username,order_instance.user.email))
        return order_instance
    def to_representation(self, instance):
        data= super().to_representation(instance)
        data['status_track'] = build_status_track(data)
        data.pop('status')
        return data

class ReturnOrderSerializer(serializers.Serializer):
    main_order_id = serializers.IntegerField()
    return_products = serializers.ListField()
    def create(self, validated_data):
        instance = []
        # { return_quantity:int ,order_item_id:int }
        original_order_id = validated_data.pop('main_order_id',None)
        if not original_order_id:
            raise serializers.ValidationError("original order id not given")
        original_order = Order.objects.get(id=original_order_id)
        if not original_order:
            raise "original order doestn't exist"
        return_products = validated_data.pop('return_products',[])
        if not return_products:
            raise "Return Products not exist"
        
        root_order = original_order
        while root_order and root_order.is_return_order:
            root_order = root_order.main_order
        root_order_discount = root_order.discount
        for item in return_products:
            {
                "order_item_id":1,
                "return_quantity":2,
            }#frontend response 
            main_order_item_id = item.get("order_item_id")
            if not main_order_item_id:
                continue
            main_item_instance = OrderItem.objects.get(id=main_order_item_id)
            if not main_item_instance:
                continue

            quantity = item.get("return_quantity")
            if not quantity or quantity > main_item_instance.quantity:
                continue
            # creating return order instance 

            order_date = datetime.datetime.now()
            status = OrderStatus.objects.create(status='request_received',_request_received_date = order_date)
            return_order_instance = Order.objects.create(
                user = original_order.user,
                billing_address = original_order.billing_address,
                shipping_address = original_order.shipping_address,
                status = status,
                discount_details = original_order.discount_details,
                gst = original_order.gst,
                payment_details = original_order.payment_details,
                is_return_order = True,
                main_order = original_order,
                delivery_details = OrderDeliveryDetails.objects.create(delivery_charge=0),
            )
            return_order_item_instance = OrderItem.objects.create(
                order=return_order_instance,
                main_order_item = main_item_instance,
                total = main_item_instance.product_price * quantity,
                quantity = quantity,
                is_returned = False,
                product_name =main_item_instance.product_name ,
                product_price =main_item_instance.product_price,
                product_id = main_item_instance.product_id,
            )
            # set the main item is returned
            main_item_instance.is_returned=True
            return_order_instance.quantity = return_order_item_instance.quantity
            return_order_instance.subtotal = return_order_item_instance.total
            discount = 0
            total = return_order_item_instance.total
            # finding the main order total quantity to distrubute discount amount
            if return_order_instance.discount_details:
                percent_contribution = return_order_instance.subtotal/root_order.subtotal
                discount = (root_order_discount/100) * percent_contribution
            total -= discount 
            return_order_instance.total = round(total,2)
            return_order_instance.discount = discount
            return_order_instance.save()
            return_order_item_instance.save()
            main_item_instance.save()
            instance.append(return_order_instance)
        return instance

class BillingAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    address  = AddressSerializer()
    class Meta:
        model = BillingAddress
        exclude = ('created_at','updated_at','id')

class ShippingAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = ShippingAddress
        exclude = ('created_at','updated_at','id')
        
class ContactDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminContactDetails
        fields = ('whatsapp_number','email',)

class DeliveryChargeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminDeliveryDetails
        exclude = ('created_at','updated_at','id')

class AdminPaymentModesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminPaymentMode
        fields='__all__'
        



