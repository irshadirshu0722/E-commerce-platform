import React, { useEffect, useState } from "react";
import "./accountmain.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../../context/store";
export default function AccountMain() {
  const navigate = useNavigate();
  const [pageName, setPageName] = useState("");
  const {Logout} = useStore()
  useEffect(() => {}, []);
  document.addEventListener("DOMContentLoaded", () => {
    const navigation_items = document.querySelectorAll(
      ".account-center .account-navigation-bar li"
    );
    navigation_items.forEach((item) => {
      item.addEventListener("click", () => {
        navigate(`/account/${item.getAttribute("itemType")}/`);
      });
    });
  });
  return (
    <section className="account-section">
      <div className="account-center section-center">
        <ul className="account-navigation-bar ">
          <Link
            to={"/account/profile/"}
            className="account-navigation-item account-profile navigation-pointer"
            itemType="profile"
          >
            <div className="group">
              <span className="material-symbols-outlined ">account_circle</span>
              <h5 className="cap">Profile</h5>
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>{" "}
          </Link>
          <Link
            to={"/account/address/"}
            className="account-navigation-item "
            itemType="address"
          >
            <div className="group">
              <span className="material-symbols-outlined account-address">
                home
              </span>
              <h5 className="cap">Address</h5>
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>{" "}
          </Link>
          <Link
            to={"/account/password/"}
            className="account-navigation-item"
            itemType="password"
          >
            <div className="group">
              <span className="material-symbols-outlined account-password">
                password
              </span>
              <h5 className="cap">Password</h5>
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>{" "}
          </Link>
          <Link
            to={"/account/orders/page/1/"}
            className="account-navigation-item"
            itemType="orders"
          >
            <div className="group">
              <span className="material-symbols-outlined account-orders">
                orders
              </span>
              <h5 className="cap">Orders</h5>
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>{" "}
          </Link>
        </ul>
        <div className="logout-button ">
          <button className="btn btn-grey btn-block btn-medium" onClick={()=>{
            Logout()
            navigate('/signin')
            return
          }
            }>Logout</button>
        </div>
      </div>
    </section>
  );
}
