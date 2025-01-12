import React from "react";
import { Link, useNavigate } from "react-router-dom";

import "./adminNavBart.css";
import { GoogleIcons } from "../../common/GoogleIcons";
const navLogoImgWithName = require("../../../assets/images/logo.PNG");

export function AdminNavBar() {
  const navigate = useNavigate();
  return (
    <>
      <GoogleIcons />
      <nav className="admin-nav-bar">
        <div className="section-center-95 nav-center">
          {/* nav header */}
          <div className="nav-header">
            <div className="nav-logo-img">
              <img src={navLogoImgWithName} alt="" srcSet="" />
            </div>
          </div>

          <ul className="links">
            <li className="nav-mobile-hide-link-meduim">
              <Link to={"/admin/dashboard/"}>Dashboard</Link>
            </li>
            <li className="nav-mobile-hide-link-meduim">
              <Link to={"/admin/chat/contact/"}>Chat</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
