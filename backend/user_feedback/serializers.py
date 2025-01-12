from rest_framework import serializers
from admins.models import *

class ProductFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeedback
        fields = '__all__'

    def update(self, instance, validated_data):
        # try:
        #     user = User.objects.get(id=validated_data.get('user'))
        #     product = Product.objects.get(id=validated_data.get('product'))
        #     order_item = OrderItem.objects.get(id=validated_data.get('order_item'))
        #     feedback_instance,created = ProductFeedback.objects.get_or_create(id=validated_data.get('id'))
        #     if created:
        #         feedback_instance.user = user
        #         feedback_instance.product = product
        #         feedback_instance.order_item = order_item
        #     feedback_instance.star_rating = validated_data.get('star_rating')
        #     feedback_instance.save()

        # except (KeyError, OrderItem.DoesNotExist, Product.DoesNotExist) as e:
        #     raise serializers.ValidationError(f"Error: {str(e)}")
        return super().update(instance, validated_data)

