export interface IAddress {
  firstName: string;
  lastName: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  district: string;
  state: string;
  phoneNumber: string;
  country: string;
  email: string;
}
interface IPaymentDetails {
  method: string;
  amount: string;
  payment_at: string;
  image_url: string;
}
interface IOrderStatus {
  received_date: string | null;
  confirmed_date: string | null;
  shipped_date: string | null;
  completed_date: string | null;
  cancelled_date: string | null;
  status: string;
  status_track: { description: string; date: string }[];
}
export interface IOrderItem {
  product_name: string;
  product_price: string;
  quantity: number;
  total: string;
  product_id: number;
  is_returned: boolean;
  feedback: IOrderItemFeedback;
  is_product_exist: boolean;
  has_feedback: boolean;
  main_order_item: null;
  product_image_url: string;
  id: number;
  return_item_order_id: number;
}
export interface IOrderItemFeedback {
  id: number;
  created_at: string;
  star_rating: number;
  user: number;
  product: number;
  order_item: number;
}
interface DeliveryDetails {
  tracking_id: string;
  delivery_charge: number;
  tracking_url: string;
  courier_service: string;
  estimated_delivery_date: string;
}
export interface IOrderDetails {
  id: number;
  billing_address: {
    address: IAddress;
  };
  shipping_address?: {
    address?: IAddress;
  } | null;
  payment_details: IPaymentDetails;
  profit: number;
  subtotal: string;
  quantity: number;
  delivery_details: DeliveryDetails;
  is_completed: boolean;
  can_cancel: boolean;
  discount_details: {
    discount_code: string;
    discount_rate: number;
    discount_amount: string;
  };
  discount: string;
  total: string;
  gst: string;
  is_return_order: boolean;
  order_items: IOrderItem[];
  is_shipping_address: boolean;
  order_at?: string;
  estimated_delivery_date?: string;
  order_id?: string;
  main_order?: number;
  status_track: {
    description: string;
    date: string;
  }[];
  can_return:boolean;
}

export interface IReturnItems {
  order_item_id: number;
  return_quantity: number;
}
