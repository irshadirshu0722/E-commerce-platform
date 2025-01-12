import React from "react";
import "./passwordforgotreset.css";

// common component
import LoadingButton from "../../../components/common/LoadingButton";


// schema
import { schema} from '../../../schemas/passwordForgotResetSchema'
import { useCustomForm } from "../../../hooks/useCustomForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export default function PasswordForgotReset() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit(){

  }
  return (
    <section className="password-forgot-reset" id="password-forgot-reset">
      <div className="password-forgot-reset-center">
        <div className="password-forgot-reset-heading">
          <h1>Create New Password</h1>
        </div>

        <form
          action=""
          className="password-forgot-reset-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="form-group">
            <label htmlFor="#password">New Password</label>
            <span className="input-box-error-message">
              {errors?.newPassword?.message}
            </span>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              {...register("newPassword")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="#confirm-password">Confirm New Password</label>
            <span className="input-box-error-message">
              {errors?.confirmPassword?.message}
            </span>
            <input
              type="password"
              id="confirm-password"
              placeholder="Enter confirm password"
              {...register("confirmPassword")}
            />
          </div>
          <div className="form-btn">
            <LoadingButton className={"btn btn-large cap"} isLoading={false}>
              Forgot Password
            </LoadingButton>
          </div>
        </form>
      </div>
    </section>
  );
}
