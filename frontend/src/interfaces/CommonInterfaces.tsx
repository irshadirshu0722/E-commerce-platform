export interface IProductCard {
  id: number;
  name: string;
  price: number;
  offer: {
    offer_name: string;
    discount_type: string;
    discount: number;
    start_date: string;
    end_date: string;
  } | null;
  actual_price: string;
  image_url: string;
  brand: string;
  rating?: number;
  total_rating?: number;
  stock?:number;
}

export const DefaultIProductCard: IProductCard = {
  id: 0,
  name: "",
  price: 0.0,
  offer: {
    offer_name: "",
    discount_type: "",
    discount: 0,
    start_date: '',
    end_date: '',
  },
  image_url: "",
  brand: "",
  actual_price:'',

};

export interface IProductCategory {
  category_name: string;
  id: number;
  image_url: string;
}
export const DefaultIProductCategory: IProductCategory = {
  id: 0,
  category_name: "",
  image_url: "",
};

export interface IPagination {
  totalPages: number;
  currentPage: number;
}

export const DefaultIPagination:IPagination={
  totalPages: 10,
  currentPage: 1,
}