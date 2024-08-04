

import * as Yup from "yup";
export interface IOrderFormData {
  firstName: string;
  lastName: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
  phoneNumber: string;
  email: string;
  shippingFirstName?: string | "";
  shippingLastName?: string | "";
  shippingAddress?: string | "";
  shippingLandmark?: string | "";
  shippingCity?: string | "";
  shippingDistrict?: string | "";
  shippingState?: string | "";
  shippingPincode?: string | "";
  shippingCountry?: string | "";
  shippingPhoneNumber?: string | "";
  shippingEmail?: string | "";
}

export interface IAddressSchema {
  firstName: string;
  lastName: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  phoneNumber: string;
  email: string;
}

interface ISchema {
  billingAddress: IAddressSchema;
  shippingAddress?: IAddressSchema | null;
}
export type OrderFormSchema = Yup.ObjectSchema<ISchema>;

export function buildOrderForm(isShipping: boolean): OrderFormSchema {
  const schema = Yup.object().shape({
    billingAddress: Yup.object().shape({
      firstName: Yup.string().required("First Name is Required"),
      lastName: Yup.string().required("Last Name is required"),
      address: Yup.string().required("Address is required"),
      landmark: Yup.string().required("Landmark is required"),
      city: Yup.string().required("City is required"),
      district: Yup.string().required("District is required"),
      state: Yup.string().required("State is required"),
      pincode: Yup.string().required("Pincode is required"),
      country: Yup.string()
        .required("Country is required")
        .matches(/^(?:India|india)$/, "Country must be India"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      email: Yup.string().required("Email is required"),
    }),

    shippingAddress: Yup.object().shape({
      ...(isShipping
        ? {
            firstName: Yup.string().required("First Name is Required"),
            lastName: Yup.string().required("Last Name is required"),
            address: Yup.string().required("Address is required"),
            landmark: Yup.string().required("Landmark is required"),
            city: Yup.string().required("City is required"),
            district: Yup.string().required("District is required"),
            state: Yup.string().required("State is required"),
            country: Yup.string()
              .required("Country is required")
              .matches(/^(?:India|india)$/, "Country must be India"),
            pincode: Yup.string().required("Pincode is required"),
            phoneNumber: Yup.string()
              .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
              .required("Phone number is required"),
            email: Yup.string().required("Email is required"),
          }
        : null),
    }),
  });

  return schema as OrderFormSchema;
}

// export function buildDefaultValues(
//   billing_address: IBillingAddress
// ): IOrderFormData {
//   if (billing_address.address) {
//     return {
//       ...billing_address.address,
//       country: "india",
//       shippingFirstName: "",
//       shippingLastName: "",
//       shippingAddress: "",
//       shippingLandmark: "",
//       shippingCity: "",
//       shippingDistrict: "",
//       shippingState: "",
//       shippingPincode: "",
//       shippingCountry: "india",
//       shippingPhoneNumber: "",
//       shippingEmail: "",
//     };
//   } else {
//     return initialOrderFormData;
//   }
// }
