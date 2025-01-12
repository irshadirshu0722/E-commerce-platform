import traceback
from celery import shared_task
from django.conf import settings
from mailjet_rest import Client
from admins.models import *
from django.template.loader import render_to_string

@shared_task()
def send_mail_to_user(order_data,mail_type,username,to_email,admin_contact_data=None):
  paths={
        "received":"order_received.html",
        "shipped":"order_shipped.html",
        "confirmed":"order_confirmed.html",
        "cancelled":"order_cancelled.html",
        "request_confirmed":'return_order_request_confirmed.html',
        "product_shipped":"return_order_product_shipped.html",
        "resolved":"return_order_resolved.html",
        "return_cancelled":"return_order_cancelled.html",
        "replacement":'return_order_replacement.html',
        'refund':"return_order_refund.html",
        'completed':'order_completed.html'
  }
  data = order_data
  if data['is_return_order'] and mail_type=='cancelled':
    mail_type = f"return_{mail_type}"

  template_path = paths.get(mail_type,None)
  shop_url = settings.SHOP_URL
  site_logo_with_name = settings.SITE_LOGO_WITH_NAME
  site_logo = settings.SITE_LOGO
  if not template_path:
    return
  emailprovider = EmailProvider.objects.first()
  if not emailprovider:
    raise "Email provider not found"
  mailjet_client = Client(auth=(emailprovider.api_key,emailprovider.secret_key),version='v3.1')
  print(admin_contact_data)
  try:
    template = f"mail_senter/{template_path}"
    print(template,mail_type)
    email_body = render_to_string(template, {'order_data': data,'admin_contact_details':admin_contact_data,'shop_url':shop_url,'site_logo_with_name':site_logo_with_name}) 
    data = {
      'Messages': [
          {
              "From": {
                  "Email": emailprovider.email,
                  "Name": emailprovider.name  # Sender's name
              },
              "To": [
                  {
                      "Email": to_email,
                      "Name": username  # Recipient's name
                  }
              ],
              "Subject": "KL Elecctronics order update",
              "HTMLPart": email_body
          }
        ]
      }
    response = mailjet_client.send.create(data=data)  # Capture the response object
    print("Email sent successfully.")
    print("Response from Mailjet:", response)

  except Exception as e:
    tb_info = traceback.format_exc()

    # Print the error message and the line number
    print(f"Error occurred: {str(e)}")
    print(f"Traceback information:\n{tb_info}")
  return "Done"