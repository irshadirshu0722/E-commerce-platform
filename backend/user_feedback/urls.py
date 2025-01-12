

from django.urls import path
from .views import ProductFeedbackView

urlpatterns = [
  path('product/',ProductFeedbackView.as_view(),name="order item feedback")
]