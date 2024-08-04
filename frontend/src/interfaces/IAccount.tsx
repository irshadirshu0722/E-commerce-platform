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
  firstName: "irshad",
  lastName: "",
  address: "",
  landmark: "",
  city: "",
  pincode: "",
  district: "",
  state: "",
  country: "",
  phoneNumber: "",
  email: "",
};
export interface IOrderListItem {
  total: string;
  quantity: number;
  discount: string;
  is_return_order: boolean;
  return_status: string | null;
  status: string;
  status_image_url: string;
  id: number;
  order_id: string;
  last_status_update_date: string;
  order_at:string;
}

