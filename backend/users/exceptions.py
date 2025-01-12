

from rest_framework.exceptions import APIException

class EmailAlreadyExist(APIException):
  status_code = 409
  default_detail = 'Email Already Exist'

class UsernameAlreadyExist(APIException):
  status_code = 409
  default_detail = 'username  Already Exist'
class UserNotExist(APIException):
  status_code = 401
  default_detail = "Email or password is incorrect"
class CategoryNotExist(APIException):
  status_code = 401
  default_detail = "Email or password is incorrect"
class CartNotExist(APIException):
  status_code = 404
  default_detail = "Cart Not Found"
class CartItemsNotExist(APIException):
  status_code = 404
  default_detail = "Cart Items Not Found"
class BillingAddressNotExist(APIException):
  status_code = 404
  default_detail = "billing address Not Found"
class PaymentDetailsNotExist(APIException):
  status_code = 404
  default_detail = "payment details Not Found"




