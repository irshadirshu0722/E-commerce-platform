from django.urls import path
from .views import *
urlpatterns=[
path('temp/',CartTempView.as_view(),name='cart-temp-items'),
path('',CartView.as_view(),name='cart-items'),
path('delete/<int:id>/',CartItemDeleteView.as_view(),name='cart-items-delete'),
path('update/',CartItemsUpdateView.as_view(),name='cart-items-update'),
path('coupon_code/',CouponCodeView.as_view(),name='cart-coupon'),
]