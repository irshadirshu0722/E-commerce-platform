# from mailjet_rest import Client
# from django.template.loader import get_template
# from django.template.loader import render_to_string
# from jinja2 import Template
# from admins.models import AdminEmailProvider
# from .serializers import OrderSerializer
# from admins.models import Order
# from django.conf import settings
# import traceback
# import datetime
# def sentMail(order_id,recipient_email,mail_type,username,is_return_order):
#   paths={
#         "received":"order_received.html",
#         "shipped":"order_shipped.html",
#         "confirmed":"order_confirmed.html",
#         "cancelled":"order_cancelled.html",
#         "request_confirmed":'return_order_request_confirmed.html',
#         "product_shipped":"return_order_product_shipped.html",
#         "resolved":"return_order_resolved.html",
#   }
#   order_data = Order.objects.get(id=order_id)
#   data = OrderSerializer(order_data).data
#   data['order_at'] = order_data.order_at
#   template_path = paths.get(mail_type,None)
#   if not template_path:
#     return
#   emailprovider = EmailProvider.objects.first()
#   mailjet_client = Client(auth=(emailprovider.api_key,emailprovider.secret_key),version='v3.1')
#   try:
#     template = f"mail_senter/{template_path}"
#     email_body = render_to_string(template, {'order_data': data}) 
#     data = {
#       'Messages': [
#           {
#               "From": {
#                   "Email": emailprovider.email,
#                   "Name": emailprovider.name  # Sender's name
#               },
#               "To": [
#                   {
#                       "Email": 'irshusvlog@gmail.com',
#                       "Name": username  # Recipient's name
#                   }
#               ],
#               "Subject": "KL Elecctronics order update",
#               "HTMLPart": email_body
#           }
#         ]
#       }
#     mailjet_client.send.create(data=data)
#     print("Email sent successfully.")

#   except Exception as e:
#     tb_info = traceback.format_exc()

#     # Print the error message and the line number
#     print(f"Error occurred: {str(e)}")
#     print(f"Traceback information:\n{tb_info}")


# def send_password_reset_email(email,reset_link):
#     emailprovider = EmailProvider.objects.first()
#     mailjet = Client(auth=(emailprovider.api_key, emailprovider.secret_key), version='v3.1')
#     linkexpire = settings.PASSWORD_RESET_TIMEOUT//(60*60)
#     email_body = render_to_string('mail_senter/password_reset.html', {'reset_link': reset_link,'expiry_duration':linkexpire}) 
#     data = {
#         'Messages': [
#             {
#                 "From": {"Email": emailprovider.email, "Name": emailprovider.name},
#                 "To": [{"Email": email}],
#                 "Subject": "Password Reset Request",
#                 "HTMLPart": email_body
#             }
#         ]
#     }
#     result = mailjet.send.create(data=data)
#     if result.status_code != 200:
#         print(result.json())