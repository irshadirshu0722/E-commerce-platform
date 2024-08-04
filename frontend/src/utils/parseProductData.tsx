import { IProduct } from "../interfaces/ISingleProduct";

export const parseProductData = (productData: any): IProduct => {
  // Parse package_contain and specializations strings to JSON objects
  const parsedPackageContain = JSON.parse(productData.package_contain);
  const parsedSpecializations = JSON.parse(productData.specializations);

  // Return the parsed product object
  return {
    ...productData,
    package_contain: parsedPackageContain,
    specializations: parsedSpecializations,
  };
};
