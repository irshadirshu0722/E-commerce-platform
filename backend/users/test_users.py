from datetime import datetime
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from pytz import UTC
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from admins.models import *
import json

import base64
credentials =base64.b64encode("test1@gmail.com:password".encode("ascii"))
auth_header = "Basic " + credentials.decode("ascii")
class UsersApiTestCase(TestCase):
  def setUp(self):
    self.u1 = get_user_model().objects.create_user(
      email='test1@gmail.com',password='password',username='irshad1'
    )
    self.u2 = get_user_model().objects.create_user(
      email='test2@gmail.com',password='password',username='irshad2'
    )

    self.client = APIClient()
    # self.client.credentials(HTTP_AUTHORIZATION=auth_header)

  
  def test_user_login_username_not_exist(self):
    response = self.client.post(
      '/users/login/',
      {'email':'irshad1213@gmail.com','password':'sampleee'}
    )
    self.assertEqual(response.status_code,401)

  def test_user_login_200(self):
    data = {'email': 'test1@gmail.com', 'password': 'password'}
    json_data = json.dumps(data)
    
    response = self.client.post(
        '/users/login/',
        json_data,
        content_type='application/json')
    self.assertEqual(response.status_code,200)
    print(response.json())
    

# from django.test import LiveServerTestCase
# from rest_framework.test import RequestsClient
# from requests.auth import HTTPBasicAuth


# class UsersApiTestCase(LiveServerTestCase):
#     def setUp(self):
#         self.client = RequestsClient()
#         self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='password')

#     def test_user_login_with_basic_auth(self):
#         self.client.auth = HTTPBasicAuth("test@example.com", "password")
        
#         resp = self.client.post(
#             self.live_server_url + "/users/login/",{}
#         )
        
#         self.assertEqual(resp.status_code, 200)
