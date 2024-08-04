import React, { useState } from "react";
import "./password.css";
import AccountBackNavigation from "../../../components/common/AccountBackNavigation/AccountBackNavigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../../schemas/accountPasswordSchema";
import { popupMessage } from "../../../utils/popupMessage";
import Loading from "../../../components/common/Loading/Loading";
import { useStore } from "../../../context/store";
import useApiCall from "../../../hooks/useApiCall";
import { ACCOUNT_PASSWORD } from "../../../config/backendApi";
import FormError from "../../../components/common/FormError";
export default function AccountPassword(): JSX.Element {
  const { authToken } = useStore();
  const { loading, makeApiCall, reload } = useApiCall();
  const [isReseting, setIsReseting] = useState<boolean>(false);
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async () => {
    setFormError("");
    const formData = getValues();
    const data = {
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
    };
    setIsReseting(true);
    try {
      const url = ACCOUNT_PASSWORD;
      const { response, ok } = await makeApiCall(
        url,
        "put",
        data,
        true,
        authToken,
        false
      );
      setIsReseting(false);
      if (ok) {
        popupMessage(false, response?.data.message);
        reset();
      } else {
        console.log(response);
        setFormError(response?.error ?? "Invalid current password");
      }
    } catch (e) {}
  };

  return (
    <>
      <section className="account-password">
        <div className="section-center account-password-center">
          <div>
            <AccountBackNavigation heading={"password"} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {formError && <FormError message={formError} />}
            <div className="form-group">
              <label className="cap" htmlFor="current-password">
                Current password
              </label>

              <span className="input-box-error-message">
                {errors?.currentPassword && errors.currentPassword.message}
              </span>
              <input
                type="password"
                id="current-password"
                placeholder="Current Password..."
                {...register("currentPassword")}
              />
            </div>
            <div className="form-group">
              <label className="cap" htmlFor="new-password">
                New password
              </label>
              <span className="input-box-error-message">
                {errors?.newPassword && errors?.newPassword?.message}
              </span>
              <input
                type="password"
                id="new-password"
                placeholder="New Password..."
                {...register("newPassword")}
              />
            </div>
            <div className="form-group">
              <label className="cap" htmlFor="confirm-password">
                Confirm password
              </label>
              <span className="input-box-error-message">
                {errors?.confirmPassword?.message}
              </span>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm New Password..."
                {...register("confirmPassword")}
              />
            </div>
            <div className="form-btn">
              <button className="cap btn btn-medium" type="submit">
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
