"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from rest_framework import routers
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
import os
router = routers.DefaultRouter()
urlpatterns = router.urls
schema_view = get_schema_view(
    openapi.Info(
        title="Blango API",
        default_version="v1",
        description="API for Blango Blog",
    ),
    url=f"https://127.0.0.1:8000/",
    public=True,
)
urlpatterns += [
    path('admin/', admin.site.urls),
    path('users/',include('users.urls')),
    path('admins/',include('admins.urls')),
    path('users/orders/',include('users_order.urls')),
    path('users/cart/',include('users_cart.urls')),
    path('users/feedback/',include('user_feedback.urls')),
    path("admins/chat/", include("chatbot.urls")),
    path("admins/", include("admins.urls")),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    
]