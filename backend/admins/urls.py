from django.urls import path
from django.contrib import admin
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from . import views


urlpatterns = [
    path('add-products/',views.add_products,name='add-products'),
    path('add-products-images/',views.add_products_images,name='add-products-images'),
    path('dashboard/',views.AdminDashBoardView.as_view()),
    path('new-feature/', views.new_feature, name='new_feature'),
    path('verify/', views.AdminVerifyView.as_view(), name='admin-verify'),
]