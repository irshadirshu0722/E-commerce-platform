export interface IProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: string;
  actual_price: string;
  offer: null | {
    offer_name: string;
    discount_type: string;
    discount: number;
    start_date: Date;
    end_date: Date;
  };
  stock: number;
  category: {
    id: number;
    category_name: string;
    image_url: string;
  };
  images: { image_url: string }[];
  tags: number[];
  package_contains: { key: string; value: string }[];
  specializations: { key: string; value: string }[];
  rating: {
    five_star: number;
    five_star_percentage: number;
    four_star: number;
    four_star_percentage: number;
    three_star: number;
    three_star_percentage: number;
    two_star: number;
    two_star_percentage: number;
    one_star: number;
    one_star_percentage: number;
    overall: string;
  };
}
