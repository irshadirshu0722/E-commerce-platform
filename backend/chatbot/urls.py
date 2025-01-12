from django.urls import path

from . import views


urlpatterns = [
    path("<str:room_name>/<int:days>/<str:is_admin>/", views.ChatMessageView.as_view() ,name="user-chat"),
    # path("reply/", views.chatRoomsVIew, name="admin-view-chat-rooms"),
    path("reply/<str:room_name>/", views.singleChatRoomView, name="index"),
    path("contact/", views.ChatContactView.as_view(), name="index"),
]