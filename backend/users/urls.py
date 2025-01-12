from django.urls import path
from django.contrib import admin
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views


urlpatterns = [
    path('login/',views.LoginApiView.as_view(),name='user-login'),
    path('register/',views.RegisterApiView.as_view(),name='user-regster'),
    path('home/',views.HomeView.as_view(),name='home'),
    path('products/category/<int:pk>/<int:page_no>/',views.CategoryItemsView.as_view(),name='catgegory-items'),
    path('product/<int:pk>/',views.ProductDetailView.as_view(),name='single-product'),
    path('token-verify/',views.TokenVerificationView.as_view(),name='user-token-verify'),
    path('password/reset/',views.PasswordChangeView.as_view(),name='password reset'),
    path('address/',views.AddressView.as_view(),name='user-address'),
    path('products/search/<str:search_name>/<int:page_no>/',views.SerachProduct.as_view(),name='product-search'),
    path('send-mail/',views.send_mail,name='send-mail'),
    path('global-data/',views.GlobalDataView.as_view(),name='send-mail'),
    path('sample/',views.SampleView.as_view(),name='sample'),
    # passsword reset
    path('password/forgot/', views.PasswordResetView.as_view(), name='password_reset'),
    path('password/forgot/confirm/<uidb64>/<token>/', views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('product/notify/', views.NotifyProductView.as_view(), name='product_notify'),

    # password reset end

]