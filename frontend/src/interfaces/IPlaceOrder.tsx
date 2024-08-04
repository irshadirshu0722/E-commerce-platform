// import { ICart } from "./ICart";e

// interface IBankDetails {
//   whatsapp_number: number;
//   email: string;
// }

// export interface IAddress {
//   firstName: string;
//   lastName: string;
//   address: string;
//   landmark: string;
//   city: string;
//   district: string;
//   state: string;
//   country: string;
//   pincode: string;
//   email: string;
//   phoneNumber: string;
// }
// export interface IBillingAddress {
//   address: IAddress;
// }
// interface IDeliveryCharge {
//   inside_kerala: number;
//   outside_kerala: number;
//   min_delivery_days: number;
//   max_delivery_days: number;
// }
// interface IPaymentModes {
//   cash_own_delivery: boolean;
//   direct_bank_transfer: boolean;
//   online_payment: boolean;
// }

// export interface IPlaceOrderData {
//   bank_details: IBankDetails;
//   billing_address: IAddress;
//   cart: ICart;
//   delivery_details: IDeliveryCharge;
//   payment_modes: IPaymentModes;
// }
// interface IPaymentDetails {
//   method: string;
//   amount: number;
// }
// export interface IOrderDetails {
//   shipping_address: IAddress | null;
//   billing_address: IAddress;
//   payment_details: IPaymentDetails;
//   profit: number;
//   tracking_id: "";
//   subtotal: number;
//   quantity: number;
//   deliveryCharge: number;
//   discount_code: string;
//   discount_rate: number;
//   discount_amount: number;
//   discount: number;
//   total: number;
//   gst: string;
//   is_return_order: boolean;
//   main_order?: number;
// }
// const initAddress: IAddress = {
//   firstName: "",
//   lastName: "",
//   address: "",
//   landmark: "",
//   city: "",
//   district: "",
//   state: "",
//   country: "",
//   pincode: "",
//   email: "",
//   phoneNumber: "",
// };
// const initialOrderDetails: IOrderDetails = {
//   shipping_address: null,
//   billing_address: initAddress,
//   payment_details: { method: "", amount: 0 }, // Define an initial value for payment details
//   profit: 0,
//   tracking_id: "",
//   subtotal: 0,
//   quantity: 0,
//   deliveryCharge: 0,
//   discount_code: "",
//   discount_rate: 0,
//   discount_amount: 0,
//   discount: 0,
//   total: 0,
//   gst: "",
//   is_return_order: false,
// };

// interface OrderItem {
//   product_name: string;
//   product_price: number;
//   quantity: number;
//   total: number;
//   product_id: number;
//   is_return_item: boolean;
//   main_order_item?: number;
// }

// const initialFormData: OrderItem = {
//   product_name: "",
//   product_price: 0,
//   quantity: 0,
//   total: 0,
//   product_id: 0,
//   is_return_item: false,
// };

// ================================================
interface IProduct {
  id: number;
  name: string;
  price: string;
  actual_price: string;
  offer: any;
  stock: number;
  brand: any;
  image_url: string;
}

interface ICartItem {
  id: number;
  product: IProduct;
  quantity: number;
  total: string;
  cart: number;
}

interface ICouponCode {
  id: number;
  code: string;
  discount_rate: number;
  min_order: string;
  discount_amount: string;
}

interface ICart {
  id: number;
  cart_items: ICartItem[];
  coupon_code: ICouponCode;
  subtotal: string;
  quantity: number;
  total: string;
  gst: string;
  discount: string;
  user: number;
}

export interface IBankDetails {
  whatsapp_number: number;
  email: string;
}

export interface IDeliveryDetails {
  inside_kerala: string;
  outside_kerala: string;
  min_delivery_days: number;
  max_delivery_days: number;
  free_delivery_over: number;
}

export interface IPaymentModes {
  cash_on_delivery: boolean;
  direct_bank_transfer: boolean;
  online_payment: boolean;
  cash_on_delivery_txt: string;
  direct_bank_transfer_txt: string;
  online_payment_txt: string;
  cash_on_delivery_description: string;
  direct_bank_transfer_description: string;
  online_payment_description: string;
}

export interface IPlaceOrderData {
  bankdetails: IBankDetails;
  delivery_details: IDeliveryDetails;
  cart: ICart;
  payment_modes: IPaymentModes;
}

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
export const initAddress: IAddress = {
  firstName: "",
  lastName: "",
  address: "",
  landmark: "",
  city: "",
  pincode: "",
  district: "",
  state: "",
  phoneNumber: "",
  country: "",
  email: "",
};
interface IPaymentDetails {
  method: string;
  amount: string;
}
interface DeliveryDetails {
  tracking_id: string;
  delivery_charge: number;
  tracking_url: string;
  courier_service: string;
  estimated_delivery_date: string;
}
export interface IOrderDetails {
  id?: number;
  billing_address: {
    address: IAddress;
  };
  shipping_address: {
    address?: IAddress;
  };
  payment_details: IPaymentDetails;
  profit: number;
  subtotal: string;
  quantity: number;
  delivery_details: DeliveryDetails;
  discount_details: {
    discount_code: string;
    discount_rate: number;
    discount_amount: string;
  };
  discount: string;
  total: string;
  gst: string;
  is_return_order: boolean;
  order_items: {
    id: number;
    product_name: string;
    product_price: string;
    quantity: number;
    total: string;
    product_id: number;
    is_return_item: boolean;
  }[];
  is_shipping_address: boolean;
  order_at?: string;
  estimated_delivery_date?: string;
  order_id?: string;
}

export const initPlaceOrderData: IPlaceOrderData = {
  bankdetails: {
    whatsapp_number: 0,
    email: "",
  },
  delivery_details: {
    inside_kerala: "0.00",
    outside_kerala: "0.00",
    min_delivery_days: 0,
    max_delivery_days: 0,
    free_delivery_over: 0,
  },
  cart: {
    id: 0,
    cart_items: [],
    coupon_code: {
      id: 0,
      code: "",
      discount_rate: 0,
      min_order: "0.00",
      discount_amount: "0.00",
    },
    subtotal: "0.00",
    quantity: 0,
    total: "0.00",
    gst: "0%",
    discount: "0.00",
    user: 0,
  },
  payment_modes: {
    cash_on_delivery: false,
    direct_bank_transfer: false,
    online_payment: false,
    cash_on_delivery_txt: "",
    direct_bank_transfer_txt: "",
    online_payment_txt: "",
    cash_on_delivery_description: "",
    direct_bank_transfer_description: "",
    online_payment_description: "",
  },
};
export const initOrderDetails: IOrderDetails = {
  billing_address: { address: initAddress },
  shipping_address: { address: initAddress },
  payment_details: {
    method: "",
    amount: "0.00",
  },
  profit: 0,
  subtotal: "0.00",
  quantity: 0,
  delivery_details: {
    courier_service: "",
    delivery_charge: 0,
    estimated_delivery_date: "",
    tracking_id: "",
    tracking_url: "",
  },

  discount_details: {
    discount_code: "",
    discount_rate: 0,
    discount_amount: "",
  },
  discount: "0.00",
  total: "0.00",
  gst: "0%",
  is_return_order: false,
  order_items: [],
  is_shipping_address: false,
};

export interface IAdminBankDetails {
  bank_name: string | null;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
  whatsapp_number: string;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
}
