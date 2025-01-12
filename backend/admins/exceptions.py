from rest_framework.exceptions import APIException
from rest_framework import status

class StockNotAvailable(APIException):
  status_code = status.HTTP_410_GONE
  default_detail = 'Stock no longer available'
  default_code = 'Stock no longer available'