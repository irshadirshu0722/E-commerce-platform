import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup
    .string()
    .email('Enter valid email')
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Enter minimum 8 character ")
    .required("Password is required"),
});
