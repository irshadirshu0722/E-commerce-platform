import React from "react";
import * as yup from "yup";

// Define schemas for billing and shipping addresses
const billingSchema = yup.object().shape({
  firstName: yup.string().required("First Name is Required"),
  lastName: yup.string().required("Last Name is required"),
  address: yup.string().required("Address is required"),
  landmark: yup.string().required("Landmark is required"),
  city: yup.string().required("City is required"),
  district: yup.string().required("District is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pincode is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: yup.string().required("Email is required"),
});

const shippingSchema = yup.object().shape({
  shippingFirstName: yup.string().required("First Name is Required"),
  shippingLastName: yup.string().required("Last Name is required"),
  shippingAddress: yup.string().required("Address is required"),
  shippingLandmark: yup.string().required("Landmark is required"),
  shippingCity: yup.string().required("City is required"),
  shippingDistrict: yup.string().required("District is required"),
  shippingState: yup.string().required("State is required"),
  shippingPincode: yup.string().required("Pincode is required"),
  shippingPhoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  shippingEmail: yup.string().required("Email is required"),
});
function combineSchemas() {
  return yup.object().shape({
    ...billingSchema.fields,
    ...shippingSchema.fields,
  });
}
export function useAddressSchema(isShippingAddress:boolean) {
  const [schema, setSchema] = React.useState(
    isShippingAddress ? combineSchemas() : billingSchema
  );

  React.useEffect(() => {
    setSchema(isShippingAddress ? combineSchemas() : billingSchema);
  }, [isShippingAddress]);

  return schema;
}
