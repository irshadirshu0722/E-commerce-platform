import * as yup from "yup";

export interface ISchemaValues {
  currentPassword: string | undefined;
  newPassword: string | undefined;
  confirmPassword: string | undefined;
}

export const schema = yup.object().shape({
  currentPassword: yup
    .string()
    .min(8, "Minimum 8 character required")
    .required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Minimum 8 character required")
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Password does not match"),
});
