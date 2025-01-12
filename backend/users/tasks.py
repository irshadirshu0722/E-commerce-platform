from django.contrib.auth import get_user_model
from celery import shared_task
from mail_senter.email_utils import send_password_reset_email
from admins.models import AdminEmailProvider
from mailjet_rest import Client
from django.template.loader import render_to_string


@shared_task
def send_password_reset_email_celery(email, reset_link):
  send_password_reset_email(email, reset_link)
  return 'Done'

@shared_task()
def sent_mail_product_notify_user(users,product):
  template_path = 'stock_notify.html'
  emailprovider = AdminEmailProvider.objects.first()
  if not emailprovider:
    raise "Email provider not found"
  mailjet_client = Client(auth=(emailprovider.api_key,emailprovider.secret_key),version='v3.1')
  print('going to sent mail to notify user')
  for user in users:
    name = user.get('name',None)
    email = user.get('email',None)
    print(name,email)
    if not name or not email:
      continue
    try:
      template = f"mail_senter/{template_path}"
      email_body = render_to_string(template, {'product':product}) 
      data = {
        'Messages': [
            {
                "From": {
                    "Email": emailprovider.email,
                    "Name": emailprovider.name  # Sender's name
                },
                "To": [
                    {
                        "Email": email,
                        "Name": name  # Recipient's name
                    }
                ],
                "Subject": "KL Elecctronics order update",
                "HTMLPart": email_body
            }
          ]
        }
      response = mailjet_client.send.create(data=data)  # Capture the response object
      print("Response from Mailjet:", response)

    except Exception as e:
      print('failed to sent mail ' ,e)
