import React, { useEffect } from "react";
import "./signin.css";
import { Link, useNavigate } from "react-router-dom";

// common component
import LoadingButton from "../../components/common/LoadingButton";
import FormError from "../../components/common/FormError";

// schema and customHook
import { schema } from "../../schemas/signInSchema";
import useApiCall from "../../hooks/useApiCall";

// utils
import { popupMessage } from "../../utils/popupMessage";
import { SIGNIN } from "../../config/backendApi";

// Global State and function
import { useStore } from "../../context/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export function Signin() {
  const { saveAuthToken, setUserDetails } = useStore();
  const [formError, setFormError] = React.useState("");
  const { makeApiCall, loading } = useApiCall();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async () => {
    const data = getValues();
    setFormError("");
    let apiResponse;
    try {
      const { ok, response } = await makeApiCall(SIGNIN, "post", data);
      apiResponse = response;
      if (ok && response) {
        popupMessage(false, "Login successful");
        saveAuthToken(response.data.auth_token);
        setUserDetails({
          email: response.data.email,
          quantity: response.data.quantity,
          username: response.data.username,
          roomName: response.data.username,
        });
        navigate("/");
      }
    } catch (e: any) {
      const errorMessage = e.message || "An error occurred"; // Extract error message from the error object
      setFormError(errorMessage);
    }
  };
  console.log(formError);
  return (
    <>
      <section className="signin" id="signin">
        <div className="signin-center">
          <div className="signin-heading">
            <h1>Sign in</h1>
            {formError && <FormError message={formError} />}
          </div>

          <form
            action=""
            className="signin-form"
            onSubmit={handleSubmit(onSubmit)}
          >
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
            <div className="form-btn">
              <LoadingButton
                className={"btn btn-large cap"}
                isLoading={loading}
                access_limit={5}
                access_name="signin"
              >
                Sign in
              </LoadingButton>
            </div>
            <Link className="forgot-password" to="/">
              Forgot your password?
            </Link>
            <Link className="forgot-password" to="/signup">
              Create new account ?
            </Link>
          </form>
        </div>
      </section>
      ;
    </>
  );
}
