import * as yup from "yup";

export const schema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Enter a valid username. This value may contain only letters, numbers, or underscores."
    )
    .required("Username is required")
    .min(8, "Minimum 8 character required"),
  email: yup.string().email("Enter valid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Minimum 8 character required")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match"),
  termsAndConditions: yup
    .bool()
    .oneOf([true], "You need to accept the terms and conditions"),
});
