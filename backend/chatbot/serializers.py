from rest_framework import serializers
from admins.models import ChatMessage,ChatRoom
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']
class ChatMessageSerializer(serializers.ModelSerializer):
    message_at = serializers.SerializerMethodField()
    class Meta:
        model = ChatMessage
        fields = '__all__'
    def get_message_at(self,obj):
        return obj.message_at
class ChatRoomSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField()
    user = UserSerializer()
    class Meta:
        model = ChatRoom
        fields = ['name', 'slug', 'messages','user']
    def get_messages(self, obj):
        messages = ChatMessage.objects.filter(room=obj).order_by('date')
        serializer = ChatMessageSerializer(messages, many=True)
        return serializer.data
class ChatRoomMessageSerializer(serializers.Serializer):
    class Meta:
        model = ChatMessage
        fields = ['is_admin',]
class ChatViewRoomSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = ChatRoom
        fields = '__all__'
        extra_fields = ['total_unseen_messages','last_message_date','last_message']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        messages = instance.messages.all()
        total_unseen_messages = sum(1 for obj in messages if obj.admin_seen==False)
        last_message_date=None
        last_message=None
        if messages:
            last_message_date =messages.last().date.strftime("%d-%m-%Y")
            last_message = messages.last().message
        representation['total_unseen_messages'] = total_unseen_messages
        representation['last_message_date'] = last_message_date
        representation['last_message'] = last_message
        return representation
class ChatViewMessageerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        instance.admin_seen = True
        instance.save()
        return representation
    
