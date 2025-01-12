import React, { FC } from "react";
import { Link } from "react-router-dom";
import "./accountbacknagivation.css";
interface AccountBackNavigationProps {
  heading: string;
}

const AccountBackNavigation: FC<AccountBackNavigationProps> = ({ heading }) => {
  return (
    <div
      className="section-heading account-back-pagination"
      style={{ display: "flex", alignItems: "center", margin: "4rem 0rem" }}
    >
      <Link
        to={"/account/"}
        style={{ fontSize: "3rem", cursor: "pointer" }}
        className="material-symbols-outlined" // corrected 'class' to 'className'
      >
        keyboard_arrow_left
      </Link>
      <h1 className="cap" style={{ margin: 0, flex: 1, textAlign: "center" }}>
        {heading}
      </h1>
    </div>
  );
};

export default AccountBackNavigation;
