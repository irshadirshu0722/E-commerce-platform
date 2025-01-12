interface IProduct {
  id: number;
  name: string;
  price: string;
  offer: {
    offer_name: string;
    discount_type: string;
    discount: number;
    start_date: string;
    end_date: string;
  } | null;
  image_url: string;
  stock: number;
  actual_price: string;
}
export interface ICartItem {
  id: number;
  quantity: number;
  total: string;
  product: IProduct;
}
interface ICouponCode {
  code: string;
  discount_rate: number;
  min_order?: string;
  discount_amount?: string; // Nullable as per the provided model
}
export interface ICart {
  id: number;
  user: number;
  quantity: number;
  subtotal: string;
  discount: string;
  total: string;
  gst: null | string;
  coupon_code: ICouponCode;
  cart_items: ICartItem[];
}
export interface ICartUpdateItem {
  id: number;
  new_quantity: number;
  old_quantity: number;
  stock: number;
}
