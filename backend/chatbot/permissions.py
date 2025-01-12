from rest_framework.permissions import BasePermission

class IsUserRoom(BasePermission):
  def has_permission(self, request, view):
    try:
      room_name = view.kwargs.get('room_name')
      user = request.user
      return room_name == user.username
    except:
      return False