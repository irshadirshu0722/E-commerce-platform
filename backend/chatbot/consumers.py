import datetime
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import User
from admins.models import ChatMessage, ChatRoom
from asgiref.sync import sync_to_async
from django.db.models import Sum,IntegerField,Case,When,Value,F

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        username = text_data_json['username']
        message = text_data_json['message']
        room = text_data_json['room']
        is_admin = text_data_json['is_admin']
        # Send message to room group  
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "chat.message",
                'message': message,
                'username': username,
                'room': room,
                'is_admin': is_admin,
            }
            
        )


        await self.save_message(username, room, message, is_admin) 
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        room = event['room']
        username = event['username']
        is_admin = event['is_admin']
        now = datetime.datetime.now()
        formatted_date = now.strftime('%I:%M %p %B %d %Y')
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'room': room,
            'is_admin': is_admin,
            'message_at': formatted_date,
        }))
        
    @sync_to_async
    def save_message(self, username, room, message, is_admin):
        user = User.objects.filter(username=username).first()
        room, created = ChatRoom.objects.get_or_create(user=user, name=user.username, slug=user.username)
        if created:
            room.name = user.username
            room.save()
        message = ChatMessage.objects.create(message=message, room=room)
        if is_admin:
            message.is_admin = True
            message.admin_seen = True
            message.save()

class ChatContactConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "contacts_history"
        self.room_group_name = f"chat_{self.room_name}"
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
    async def receive(self, text_data):
        data = json.loads(text_data)
        room_name = data['room_name']
        username = data['username']
        latest_message = data['new_message']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'room_name': room_name,
                'username': username,
                'latest_message': latest_message,
            }
        )
    async def chat_message(self, event):
        room_name = event['room_name']
        username = event['username']
        latest_message = event['latest_message']
        now = datetime.datetime.now()
        formatted_date = now.strftime('%I:%M %p')
        last_message_date = formatted_date
        total_unseen_messages = await self.get_unseen_message_count(room_name)
        print({
            'room_name':room_name,
            'username':username,
            'latest_message':latest_message,
            'last_message_date':last_message_date,
            'total_unseen_messages':total_unseen_messages,
        })
        await self.send(text_data=json.dumps({
            'room_name':room_name,
            'username':username,
            'latest_message':latest_message,
            'last_message_date':last_message_date,
            'total_unseen_messages':total_unseen_messages,
        }))
    @sync_to_async
    def get_unseen_message_count(self, room_name):
        try:
            room= ChatRoom.objects.get(name=room_name)
            seen_message_condition = When(admin_seen=False,then=Value(1))
            query = ChatMessage.objects.filter(room=room).annotate(total_unseen_messages=Sum(Case(seen_message_condition,default=Value(1),output_field=IntegerField())))
            return query.first().total_unseen_messages if query.exists() else 1
        except ChatRoom.DoesNotExist:
            return 1
        

