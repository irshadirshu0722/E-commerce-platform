import "./footer.css";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CustomerServiceSvg from "../../../assets/svg/service icons/customer_service";
import ExchangeSvg from "../../../assets/svg/service icons/exchange";
import QualitySvg from "../../../assets/svg/service icons/quality";
import { useStore } from "../../../context/store";

const visaImage = require("./images/payment-visa.webp");
const upiImage = require("./images/payment UPI.png");
const masterImage = require("./images/payment-Master Card.webp");
const company_logo = require("./images/logo.jpg");
export function Footer() {
  const navigate = useNavigate();
  const {footerRef} = useStore()
  return (
    <footer className="footer" ref={footerRef}>
      <div className="container">
        <div className="row service_highlight">
          <div className="customer_service">
            <div className="logo">
              <CustomerServiceSvg />
            </div>
            <div className="logo-info">Customer Support</div>
          </div>
          <div className="exchange">
            <div className="logo">
              <ExchangeSvg />
            </div>
            <div className="logo-info">Easy Return</div>
          </div>
          <div className="customer_service">
            <div className="logo">
              <QualitySvg />
            </div>
            <div className="logo-info">Quality Products</div>
          </div>
        </div>
        <div className="row">
          <div className="usefull-links">
            <div className="footer-logo">
              <img src={company_logo} />
            </div>

            <div className="store-details">
              <ul>
                <li>Store</li>
                <li>
                  <a className="store-link">
                    KL Electronics, Melvettoor PO. Varkala, Thiruvanathapuram
                  </a>
                </li>
                <li>
                  <a className="store-link">team@klelectronics.in</a>
                </li>
              </ul>
            </div>
            <div className="policy-details">
              <ul>
                <li>Policy</li>
                <li onClick={() => navigate("/policy/terms-and-condition")}>
                  <a>Terms & Conditions</a>
                </li>
                <li onClick={() => navigate("/policy/shipping")}>
                  <a>Shipping Policy</a>
                </li>
                <li onClick={() => navigate("/policy/refund")}>
                  <a>Refund Policy </a>
                </li>
                <li onClick={() => navigate("/policy/privacy")}>
                  <a>Privacy Policy</a>
                </li>
                <li onClick={() => navigate("/policy/cookie")}>
                  <a>Cookie Policy</a>
                </li>
                <li onClick={() => navigate("/policy/faq")}>
                  <a>FAQ</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="payment-community">
            <div className="payment-methods">
              <h5>Payment Methods</h5>
              <div className="methods">
                <img src={visaImage} />
                <img src={masterImage} />
                <img src={upiImage} />
              </div>
            </div>
            <div className="community">
              <div>
                <h5>Join the Community</h5>
                <div className="social-media-links">
                  <a>
                    {" "}
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a>
                    {" "}
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a>
                    {" "}
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
