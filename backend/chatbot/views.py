import datetime
from time import sleep
from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse,HttpResponse,HttpResponseRedirect
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .permissions import IsUserRoom
from .serializers import ChatRoomSerializer,ChatMessageSerializer,ChatViewRoomSerializer,ChatViewMessageerializer
from admins.models import ChatRoom,ChatMessage
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
import traceback
from django.contrib.auth import logout
from django.db.models import Count
from django.utils import timezone  
from django.db.models import Count,Sum,Avg,IntegerField,Case,When,Value,Max,Subquery, OuterRef,F
from .utils import formatDate
# Create your views here.
class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request,room_name,days,is_admin):
        try:
            # Get or create chat room for the authenticated user
            
            room, created = ChatRoom.objects.get_or_create(
                name=room_name,
                defaults={'slug': request.user.username,'user':request.user}
            )
            if is_admin.lower() =='true':
                ChatMessage.objects.filter(room=room,admin_seen=False).update(admin_seen=True)
            # Get today's and yesterday's dates
            today = timezone.now().date()
            yesterday = today - timezone.timedelta(days=1)
            last_week = today - timezone.timedelta(days=7)
            last_year = today - timezone.timedelta(days=365)
            # Get messages grouped by date
            messages_by_date = (
                ChatMessage.objects
                .filter(room=room)
                .values('date')
                .annotate(messages_count=Count('id'))
                .order_by('-date')
            )
            # Initialize variables
            total_messages = 0
            messages = []
            has_today = False
            # Iterate through each date
            for i in range(days,len(messages_by_date)):
                msg_date = messages_by_date[i]
                date = msg_date['date']
                messages_count = msg_date['messages_count']
                if not date or not messages_count:
                    continue
                # Filter messages for the current date
                date_messages = room.messages.filter(date=date)
                date_messages_serialized = ChatMessageSerializer(date_messages, many=True).data
                # Check if the date is today or yesterday
                if date == today:
                    formatted_date = 'Today'
                    has_today = True
                elif date == yesterday:
                    formatted_date = 'Yesterday'
                elif date > last_week:
                    formatted_date = date.strftime("%A")
                else:
                    if(date > last_year):
                        formatted_date = date.strftime("%a, %d %b")
                    else:
                        formatted_date = date.strftime("%d %b %Y")
                # Add date and corresponding messages to the list
                messages.append({'date': formatted_date,
                "messages":date_messages_serialized                 
                })
                # Update total messages count
                total_messages += messages_count
                if days == 0:
                    if total_messages >= 10:
                        break
                else: break
            return JsonResponse({'messages': messages[::-1],'has_today':has_today}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            traceback.print_exc()
            return JsonResponse({'error': f'Object does not exist: {e}'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': f'Bad request: {e}'}, status=status.HTTP_400_BAD_REQUEST)


class ChatContactView(APIView):
    permission_classes = [IsAdminUser]
    def get(self,request):
        try:
            latest_message_subquery = ChatMessage.objects.filter(room=OuterRef('room')).order_by('-date')[:1]   
            seen_message_condition = When(admin_seen=False,then=Value(1))
            grouped_data = list(ChatMessage.objects.annotate(room_name = F('room__name'),username=F('room__user__username')).values('room_name','username').annotate(
                total_unseen_messages=Sum(Case(seen_message_condition,default=Value(0),output_field=IntegerField())),
                last_message_date = Max('_message_at'),
                latest_message=Subquery(latest_message_subquery.values('message')[:1])
            ).order_by('-last_message_date'))
            m = ChatMessage.objects.first()
            
            for item in grouped_data:
                if 'last_message_date' in item:
                    item['last_message_date'] = formatDate(item['last_message_date'],False)
            return JsonResponse({'contacts':grouped_data},status=status.HTTP_200_OK)
        except Exception as e:
            traceback.print_exc()
            return HttpResponse(status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# def chatRoomsVIew(request):
#     if not request.user or not request.user.is_superuser :
#         logout(request)
#         return HttpResponseRedirect('/admin/login/')
    
    
#     return render(request,'chatbot/index.html',{'rooms':data})

def singleChatRoomView(request,room_name):
    if not request.user or not request.user.is_superuser :
        logout(request)
        return HttpResponseRedirect('/admin/login/')
    room = ChatRoom.objects.filter(name=room_name).first()
    username = room.user.username
    if not room:
        return render('admin-view-chat-rooms')
    messages = room.messages.all()
    data = ChatViewMessageerializer(messages,many=True).data
    return render(request,'chatbot/room.html',{'messages':data,'room_name':room_name,'username':username})
