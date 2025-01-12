import * as yup from "yup";

export const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Minimum 8 character required")
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Password does not match"),
});
