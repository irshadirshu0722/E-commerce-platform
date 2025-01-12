import * as yup from "yup";
export const schema = yup.object().shape({
  firstName: yup.string().required("First Name is Required"),
  lastName: yup.string().required("Last Name is required"),
  address: yup.string().required("Address is required"),
  landmark: yup.string().required("Landmark is required"),
  city: yup.string().required("City is required"),
  district: yup.string().required("District is required"),
  state: yup.string().required("State is required"),
  pincode: yup.string().required("Pincode is required"),
  country:yup.string().required("Country is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email:yup.string().required('Email is required')
});
