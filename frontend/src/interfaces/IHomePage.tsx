
export interface IHighlights {
  image_url: string;
  banner_text: string;
  description: string;
}
export const DefaultIHighlights: IHighlights = {
  image_url: "",
  banner_text: "",
  description: "",
};
export interface ILatestOffer {
  search_key: string;
  offer_name: string;
  image_url: string;
}
