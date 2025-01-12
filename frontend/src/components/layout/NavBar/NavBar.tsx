import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./navbar.css";
import { GoogleIcons } from "../../common/GoogleIcons";
import { toggler } from "../../../utils/toggler";
import { useStore } from "../../../context/store";
import { stringify } from "querystring";
const navLogoImg = require("../../../assets/images/company_logo.PNG");
const navLogoImgWithName = require("../../../assets/images/logo.PNG");

export function NavBar() {
  const { isUser, setSearchHistory, navBarRef, userDetails } = useStore();
  const navSearchContainer = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const navMobileLinkContainer = useRef<HTMLDivElement>(null);
  const [searcheHistory, setSearcheHistory] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const handleStorageChange = () => {
      getSearchHistory();
      console.log("storage changeed");
    };
    window.addEventListener("storage", handleStorageChange);
    getSearchHistory();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  function getSearchHistory() {
    const searchHistoryString = localStorage.getItem("searchHistory");
    if (searchHistoryString) {
      const parsedSearches = JSON.parse(searchHistoryString);
      if (Array.isArray(parsedSearches)) {
        setSearcheHistory(parsedSearches);
      }
    }
  }
  function handleSearchToggle() {
    setShowSearch((prev) => !prev);
  }
  function handleMobileToggle() {
    toggler(navMobileLinkContainer.current, "show-nav-mobile-links");
  }
  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (search) {
      setSearchHistory(search);
      setShowSearch(false);
      navigate(`/products/search/${search}/page/1`);
    }
  }
  console.log(userDetails);
  return (
    <div ref={navBarRef}>
      <GoogleIcons />
      <nav className="user-nav-bar">
        <div className="section-center-95 nav-center">
          {/* nav header */}
          <div className="nav-header">
            <div className="nav-logo-img">
              <img src={navLogoImgWithName} alt="" srcSet="" />
            </div>
          </div>
          {/* links */}
          <ul className="links">
            <li className="nav-mobile-hide-link-meduim">
              <Link to={"/"}>home</Link>
            </li>
            <li className="nav-mobile-hide-link-meduim">
              <Link to={`/user/chat/${userDetails.roomName}/`}>contact</Link>
            </li>
            {!isUser && (
              <li
                className="nav-mobile-hide-link-meduim"
                onClick={() => navigate("signin/")}
              >
                <a href="#">Login/Register</a>
              </li>
            )}
            {userDetails.is_admin && (
              <li
                className="cursor-pointer nav-mobile-hide-link-meduim"
                onClick={() => navigate("admin/dashboard/")}
              >
                Dashboard
              </li>
            )}
            <li className="nav-link-box nav-mobile-hide-link-small">
              <span
                className="cursor-pointer"
                onClick={(e) => handleSearchToggle()}
              >
                <span className="material-symbols-outlined">search</span>
              </span>
            </li>

            <li className="nav-link-box nav-mobile-hide-link-small">
              <Link to="/account/">
                <span className="material-symbols-outlined">person</span>
                {/* <span className="material-symbols-outlined">person_off</span> */}
              </Link>
            </li>

            <li className="nav-link-box nav-mobile-hide-link-small">
              <Link to="/cart/">
                <span className="material-symbols-outlined">shopping_cart</span>
              </Link>
            </li>
            <li className="nav-toggle nav-link-box">
              <button type="button" onClick={(e) => handleMobileToggle()}>
                <i className="fas fa-bars"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div
        ref={navSearchContainer}
        className={`nav-search ${showSearch && "show-nav-search"}`}
      >
        <div className="section-center-95">
          <form action="" onSubmit={(e) => onSearch(e)}>
            <div>
              <span
                onClick={(e) => handleSearchToggle()}
                className="material-symbols-outlined nav-search-toggle"
              >
                arrow_back
              </span>
            </div>
            <div className="form-group">
              <input
                type="text"
                name=""
                id=""
                placeholder="search products"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit">
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          <ul className="nav-search-history">
            {searcheHistory.map((item, idx) => (
              <li key={item} onClick={(e) => handleSearchToggle()}>
                <Link to={`/products/search/${item}/page/1`}>
                  <span>{item}</span>
                  <span className="material-symbols-outlined">
                    bottom_right_click
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="nav-mobile-toggle-links " ref={navMobileLinkContainer}>
        <ul className="section-center-95">
          <li>
            <a href="#">home</a>
          </li>
          <li>
            <a href="#">about</a>
          </li>
          <li>
            <a href="#">projects</a>
          </li>
          <li>
            <a href="#">contact</a>
          </li>
        </ul>
      </div>

      <div className="nav-mobile-bottom">
        <ul className="section-center-95">
          <li className="nav-link-box">
            <a href="#">
              <span className="material-symbols-outlined">person</span>
              {/* <span className="material-symbols-outlined">person_off</span> */}
            </a>
          </li>
          <li className="nav-link-box">
            <a href="#" onClick={(e) => handleSearchToggle()}>
              <span className="material-symbols-outlined">search</span>
            </a>
          </li>

          <li className="nav-link-box">
            <a href="#">
              <span className="material-symbols-outlined">shopping_cart</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
