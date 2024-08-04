import React from "react";
import "./profile.css";
import AccountBackNavigation from "../../../components/common/AccountBackNavigation/AccountBackNavigation";

// utils
import { popupMessage } from "../../../utils/popupMessage";

// hooks
import useApiCall from "../../../hooks/useApiCall";
import { useForm } from "react-hook-form";

// context
import { useStore } from "../../../context/store";
export default function AccountProfile() {
  const { userDetails } = useStore();
  return (
    <>
      <section className="account-profile">
        <div className="section-center account-profile-center">
          <div>
            <AccountBackNavigation heading={"Profile"} />
          </div>
          <form action="">
            <div className="form-group">
              <label className="cap" htmlFor="#email">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                value={userDetails.email}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label className="cap" htmlFor="#username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={userDetails.username}
                placeholder="Username"
              />
            </div>
            <div className="form-btn">
              <button className="cap btn btn-medium" disabled>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
