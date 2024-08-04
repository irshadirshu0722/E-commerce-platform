import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup.string().email("Enter valid email").required("Email is required")
});
