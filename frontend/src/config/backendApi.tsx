// Define backend URL
export const BACKEND_URL = "http://127.0.0.1:8000/";

// Endpoint for token verification
export const TOKEN_VERIFY_ENDPOINT = "users/token-verify/";
export const GLOBAL_DATA = "users/global-data/";
export const SIGNUP = "users/register/";
export const SIGNIN = "users/login/";
export const HOME = "users/home/";
export const SEARCH_BY_NAME = "users/products/search/";
export const SEARCH_BY_CATEGORY = "users/products/category/";
export const SINGLE_PRODUCT = "users/product/";
export const ADD_TO_CART = "users/cart/";
export const CART = "users/cart/";
export const CART_UPDATE = "users/cart/update/";
export const CART_COUPON = "users/cart/coupon_code/";
export const PLACE_ORDER_VERIFY = "users/orders/placeorder/";
export const PLACE_ORDER = "users/orders/placeorder/";
export const ACCOUNT_ADDRESS = "users/address/";
export const ACCOUNT_PASSWORD = "users/password/reset/";
export const ACCOUNT_ORDER_LIST = "users/orders/list/"; // paremter pageNumber
export const ACCOUNT_ORDER_DETAILS = "users/orders/"; // paremter orderid
export const ACCOUNT_ORDER_CANCEL = "users/orders/"; // paremter orderid
export const ORDER_ITEMS_FEEDBACK = "users/feedback/product/"; // paremter orderid
export const RETURN_ORDER_PLACE = "users/orders/return/"; // paremter orderid
export const CANCEL_ORDER = "users/orders/cancel/"; // paremter order id

export const CHAT_WEBSOCKET = "ws://127.0.0.1:8000/ws/chat/";
export const CHAT_USERS_MESSAGE = "admins/chat/";
export const PRODUCT_NOTIFY = "users/product/notify/";

export const ADMIN_CHAT_CONTACT_WEBSOCKET ="ws://127.0.0.1:8000/ws/chat/admin/contact/";
export const ADMIN_DASHBOARD = "admins/dashboard/";
export const ADMIN_VERIFY = "admins/verify/";
export const ADMIN_CHAT_CONTACT = "admins/chat/contact/";
