from collections.abc import Callable, Sequence
from django.contrib import admin
from django.db.models.fields.related import ForeignKey
from django.http import HttpRequest
from .models import *
from django.contrib import messages
from django.utils.translation import gettext_lazy as _
from .models import Order
from mail_senter.tasks import *
import traceback
from django import forms  # Import the forms module
from .utils import *
from django.contrib import messages
from django.urls import reverse
from django.utils.html import format_html

class ImageInline(admin.TabularInline):
    model = Order
    def get_fields(self, request, obj=None):
        return ['view_order']
    readonly_fields = ['view_order']
    def view_order(self, obj):
        order_change_url = reverse("admin:%s_%s_change" % (Order._meta.app_label, Order._meta.model_name), args=[obj.id])
        return format_html('<a href="{}"> View Order </a>', order_change_url)
    view_order.short_description = 'Order Item'
class OrderStatusAdmin(admin.ModelAdmin):
    list_per_page = 20
    list_display = ('status','get_order',)
    search_fields = ['status']
    ordering = ['status']
    inlines = [
        ImageInline,
    ]
    def save_model(self, request, obj, form, change):
        if change: 
            original_instance = self.model.objects.get(pk=obj.pk)
            status_date = f"_{obj.status}_date"
            if obj.status and getattr(obj, status_date) is None:
                setattr(obj,status_date,datetime.datetime.now())
            if original_instance.status == 'Cancelled' and obj.status != 'Cancelled':
                self.message_user(request, _("Cancelled orders cannot be changed."), level=messages.ERROR)
                return
            elif original_instance.status !="Cancelled" and obj.status == 'Cancelled':
                for item in obj.order.order_items.all():
                    try:
                        product = Product.objects.get(id=item.product_id)
                        if product:
                            product.stock+=item.quantity
                            product.save()
                    except:
                        pass
            elif original_instance.status != 'replacement' and obj.status == 'replacement':
                order = original_instance.order
                main_order = order.main_order
                while main_order.is_return_order:
                    main_order = main_order.main_order
                delivery_details_main = main_order.delivery_details
                delivery_details_return = order.delivery_details
                if not delivery_details_return:
                    delivery_details_return = OrderDeliveryDetails.objects.create()
                    order.delivery_details = delivery_details_return
                if delivery_details_main and delivery_details_return:
                    delivery_details_return.delivery_charge =  delivery_details_main.delivery_charge
                    delivery_details_return.save()
            
        super().save_model(request, obj, form, change)
    
    def get_readonly_fields(self, request, obj=None):
        # Add your condition to determine if the form should be read-only
        if obj:
            status = obj.status
            order = getattr(obj,'order')
            return get_ready_only_fields(status,order.is_return_order,obj)
        else:
            return []
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        try:
            if obj:
                order = obj.order
                status = obj.status
                hide_inputs = get_hide_inputs(status,order.is_return_order,obj)
                for input in hide_inputs:
                    form.base_fields[input].widget = forms.HiddenInput()
                form.base_fields['status'].choices = get_status_select_values(status)
            pass
            
        except:
            traceback.print_exc()
        return form
    @admin.display(description="Address")
    def address_report(self, instance):
        return 'hi'
admin.site.register(OrderStatus, OrderStatusAdmin)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name','actual_price','stock','category','offer','price',)
    def save_model(self, request, obj, form, change):
        if(obj.offer):
            product_price = obj.actual_price
            offer = obj.offer
            if(offer.discount_type=='amount' and product_price<offer.discount):
                self.message_user(request,_("Amount Offer discount must less than product actuall price"),level=messages.ERROR)
                return
        super().save_model(request, obj, form, change)
    
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = [field.name for field in OrderItem._meta.fields]
    can_delete = False
    verbose_name_plural = 'Order Items'

    def has_add_permission(self, request, obj):
        return False

    def view_order(self, obj):
        order_item_change_url = reverse("admin:%s_%s_change" % (OrderItem._meta.app_label, OrderItem._meta.model_name), args=[obj.id])
        return format_html('<a href="{}">View Order Item</a>', order_item_change_url)
    view_order.short_description = 'Order Item'


class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('_order_at','user','discount','total','quantity', 'profit','status',)
    # Custom method to get the URL of the related status instance

    # def status_url(self, obj):
    #     if obj.status:
    #         return reverse('admin:admins_orderstatus_change', args=[obj.status.id])
    #     return None
    # def status_link(self, obj):
    #     url = self.status_url(obj)
    #     status = obj.status.status
    #     if url:
    #         return format_html('<a href="{}">{}</a>', url,status,)
    #     return obj.status
    # status_link.allow_tags = True
    # list_display_links = ('status_link','_order_at')
    def get_readonly_fields(self, request: HttpRequest, obj):
        if request.user.is_superuser:
            return []
        if request.user.is_staff:
            return [field.name for field in Order._meta.fields if field.name!='profit']
admin.site.register(Order,OrderAdmin)



@admin.register(Tag)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(ForgotPasswordToken)
admin.site.register(Policy)
admin.site.register(ProductRating)
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('room','message','is_admin','admin_seen','_message_at',)
admin.site.register(ChatRoom)



@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('image_url',)

@admin.register(ProductFeedback)
class ProductFeedbackAdmin(admin.ModelAdmin):
    list_display = ('user','product','star_rating','order_item',)

@admin.register(PaymentDetails)
class PaymentDetailsAdmin(admin.ModelAdmin):
    list_display = ('amount','method','payment_id',)
    def get_readonly_fields(self, request: HttpRequest, obj) :
        if request.user.is_superuser:
            return []
        return [field.name for field in Order._meta.fields if field.name!='payment_id']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    model = Address
    list_display =('first_name','last_name','state','district','phone_number')

@admin.register(AdminContactDetails)
class AdminContactDetailsAdmin(admin.ModelAdmin):
    list_display =('bank_name','upi_id','whatsapp_number','email')

@admin.register(AdminDeliveryDetails)
class AdminDeliveryDetailsAdmin(admin.ModelAdmin):
    list_display =('inside_kerala','outside_kerala','min_delivery_days','max_delivery_days','free_delivery_over')


@admin.register(AdminOrderControl)
class AdminOrderControlAdmin(admin.ModelAdmin):
    list_display = ('return_days','lazy_confirmation_cancel_days',)

@admin.register(BillingAddress)
class BillingAddressAdmin(admin.ModelAdmin):
    list_display =('user','address',)
@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user','quantity','subtotal','discount','total','coupon_code')
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id','quantity','total','cart','product')
@admin.register(CategoryImage)
class CategoryImageAdmin(admin.ModelAdmin):
    list_display = ('category','image_url',)
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('category_name','created_at','updated_at',)

@admin.register(CouponCode)
class CouponCodeAdmin(admin.ModelAdmin):
    list_display = ('code','discount_rate','discount_amount','min_order','created_at','updated_at',)

@admin.register(AdminEmailProvider)
class AdminEmailProviderAdmin(admin.ModelAdmin):
    list_display = ('email','api_key','secret_key',)


@admin.register(Highlight)
class HighlightAdmin(admin.ModelAdmin):
    list_display = ('image_url',)

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('offer_name','discount_type','discount','_start_date','end_date','highlight',)

@admin.register(OrderBilling)
class OrderBillingAdmin(admin.ModelAdmin):
    list_display = ('address',)

@admin.register(OrderDeliveryDetails)
class Admin(admin.ModelAdmin):
    list_display = ('id','tracking_id','delivery_charge','tracking_url','courier_service','_estimated_delivery_date')
    def get_readonly_fields(self, request, obj) :
        if not request.user.is_staff:
            return ('delivery_charge',)
        return ()
    
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product_name','product_price','quantity','total','product_id','order','is_returned','main_order_item')

@admin.register(OrderShipping)
class OrderShippingAdmin(admin.ModelAdmin):
    list_display = ('address',)

@admin.register(ShippingAddress)
class OrderShippingAdmin(admin.ModelAdmin):
    list_display = ('address',)
@admin.register(AdminPaymentMode)
class AdminPaymentModeAdmin(admin.ModelAdmin):
    list_display = ('id','cash_on_delivery','direct_bank_transfer','online_payment',)

@admin.register(ProductPackageContain)
class ProductPackageContain(admin.ModelAdmin):
    list_display = ('id','key','value',)


@admin.register(ProductSpecialisation)
class ProductPackageContain(admin.ModelAdmin):
    list_display = ('id','key','value',)


admin.site.register(ProductNotifyUser)



