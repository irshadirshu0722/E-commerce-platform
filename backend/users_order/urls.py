from django.urls import path

from . import views


urlpatterns = [
    path('list/<str:type>/<int:page>/',views.OrdersView.as_view(),name='user-order'),
    path('<int:id>/',views.OrderDetailView.as_view(),name='user-order-details'),
    path('placeorder/',views.PlaceOrderView.as_view(),name='user-order-place'),
    path('return/',views.ReturnOrderView.as_view(),name='return-order-view'),
]