import React, { useEffect, useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP } from "../../config/backendApi";
// common component
import LoadingButton from "../../components/common/LoadingButton";
import FormError from "../../components/common/FormError";

// schema and custom state
import { useCustomForm } from "../../hooks/useCustomForm";
import { schema } from "../../schemas/signUpSchema";
import useApiCall from "../../hooks/useApiCall";
// utils
import { popupMessage } from "../../utils/popupMessage";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export function Signup() {
  const [formError, setFormError] = useState("");
  const { loading, makeApiCall } = useApiCall();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  const onSubmit = async () => {
    const data = getValues();
    setFormError("");
    delete data["confirmPassword"];
    try {
      const { ok, response } = await makeApiCall(SIGNUP, "post", data);
      if (ok && response) {
        popupMessage(false, "Registration successful");
        navigate("/signin");
      } else if (!ok && response && response.error) {
        setFormError(response.error);
      }
    } catch {}
  };
  return (
    <>
      <section className="signup" id="signup">
        <div className="signup-center">
          <div className="signup-heading">
            <h1>Create an account</h1>
            {formError && <FormError message={formError} />}
          </div>

          <form
            action=""
            className="signup-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <label htmlFor="#email">Username</label>
              <span className="input-box-error-message">
                {errors?.username?.message}
              </span>
              <input
                type="text"
                id="username"
                placeholder="Username"
                {...register("username")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#email">Email</label>
              <span className="input-box-error-message">
                {errors?.email?.message}
              </span>
              <input
                type="email"
                id="email"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <span className="input-box-error-message">
                {errors?.password?.message}
              </span>
              <input
                type="password"
                id="password"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmpassword">Confirm password</label>
              <span className="input-box-error-message">
                {errors?.confirmPassword?.message}
              </span>
              <input
                type="password"
                id="confirmpassword"
                placeholder="Confirm password"
                {...register("confirmPassword")}
              />
            </div>
            <div className="form-checkbox-group">
              <span className="input-box-error-message">
                {errors?.termsAndConditions?.message}
              </span>
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id=""
                  {...register("termsAndConditions")}
                />

                <label htmlFor="">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            </div>
            <div className="form-btn">
              <LoadingButton
                className={"btn btn-medium .off-disable-effect"}
                isLoading={loading}
                type={"submit"}
              >
                Create account
              </LoadingButton>
            </div>
            <Link className="already-have-account" to="/signin">
              Already have an account?
            </Link>
          </form>
        </div>
      </section>
      ;
    </>
  );
}
