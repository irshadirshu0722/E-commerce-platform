import React from 'react'
import './passwordforgotmail.css'
import { Link } from 'react-router-dom';


// common component
import LoadingButton from "../../../components/common/LoadingButton";
// schema
import {schema} from '../../../schemas/passwordForgotMail'
import { useCustomForm } from "../../../hooks/useCustomForm";
export default function PasswordForgotMail() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(schema);
  return (
    <section className="password-forgot-mail" id="password-forgot-mail">
      <div className="password-forgot-mail-center">
        <div className="password-forgot-mail-heading">
          <h1>Enter email to get reset link</h1>
        </div>

        <form action="" className="password-forgot-mail-form">
          <div className="form-group">
            <label htmlFor="#email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email "
              {...register("email")}
            />
          </div>
          <div className="form-btn">
            <LoadingButton className={"btn btn-large"} isLoading={false}>
              Send Mail
            </LoadingButton>
          </div>
          <Link className="forgot-password" to="/">
            Back to sign?
          </Link>
        </form>
      </div>
    </section>
  );
}
