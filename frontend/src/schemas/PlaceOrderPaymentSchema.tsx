import * as Yup from "yup";

export const schema = Yup.object().shape({
  paymentMode: Yup.string().required("Payment mode is required"),
});
