import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectSchema } from "yup";
import { Interface } from "readline";

export function useCustomForm(
  schema: ObjectSchema<any>,
  initialValues?: {}
  
) {
  return useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
}
