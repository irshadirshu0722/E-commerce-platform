from django import forms
from .models import OrderStatus

class OrderStatusAdminForm(forms.ModelForm):
    class Meta:
        model = OrderStatus
        fields = '__all__'  # Include all fields from the model

    # Add new fields dynamically
    order = forms.CharField(label='Order')