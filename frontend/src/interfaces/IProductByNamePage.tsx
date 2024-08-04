export interface IFilterDetails {
  categories: {
    categories: { id: number; name: string }[];
    selected_ids: number[];
  };
  brands: {
    brands: { id: number; name: string }[];
    selected_ids: number[];
  };
  offers: {
    offers: { id: number; name: string }[];
    selected_ids: number[];
  };
  selectedPriceRange: number[];
  priceRange: number[];
}

export interface Iparams {
  productName: string | undefined;
  pageNumber: string | undefined;
}
