import React, { useEffect, useState } from "react";
import "./orderplaced.css";
import { GoogleIcons } from "../../components/common/GoogleIcons";
import { useLocation, useNavigate } from "react-router-dom";

// interface
import { IOrderDetails, IAdminBankDetails } from "../../interfaces/IPlaceOrder";
import { objectToString } from "../../utils/objectToString";
import { getDeliveryDate } from "../../utils/utils";
import { useStore } from "../../context/store";
import NoticeBoard from "../../components/common/NoticeBoard";
import { CopyIcon } from "../../components/common/CopyIcon";

export default function OrderPlaced() {
  const { userDetails, contactDetails } = useStore();
  const [orderDetail, setOrderDetails] = useState<IOrderDetails>();
  const [bankDetails, setBankDetails] = useState<IAdminBankDetails>();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const data: { bank_details: IAdminBankDetails; order: IOrderDetails } =
        location.state;
      setOrderDetails(data.order);
      setBankDetails(data.bank_details);
    } catch {
      navigate("/error/403/");
    }
  }, []);
  console.log(
    objectToString(orderDetail?.shipping_address?.address) ??
      objectToString(orderDetail?.billing_address.address)
  );
  console.log(bankDetails);
  return (
    <>
      <GoogleIcons />
      <section className="order-placed-section">
        <div className="order-placed-center section-center">
          <div className="section-heading">
            <h1>Congratulations, {userDetails.username}!</h1>
            <p>Your order is received. we'll notify yu when it ships</p>
          </div>
          <div className="order-info-container">
            <div className="section-sub-heading">
              <h3>Order ID #{orderDetail?.order_id}</h3>
            </div>
            <div className="order-info-group">
              <div className="order-info">
                <p className="date">{orderDetail?.order_at}</p>
                <button
                  onClick={() => navigate(`/orders/${orderDetail?.id}/`)}
                  className="btn btn-small"
                >
                  Show Order
                </button>
              </div>
              <div className="order-image">
                <img
                  src="https://png.pngtree.com/thumb_back/fh260/background/20231008/pngtree-3d-render-of-a-truck-delivering-packages-image_13570278.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="order-placed-shipping-address">
            <span className="material-symbols-outlined">location_on</span>
            <div className="address">
              <h5>Shipping address</h5>
              <p>
                {orderDetail?.shipping_address
                  ? objectToString(orderDetail?.shipping_address?.address, 0, 9)
                  : objectToString(orderDetail?.billing_address.address, 0, 9)}
              </p>
              <p>
                {orderDetail?.shipping_address
                  ? orderDetail.shipping_address.address?.phoneNumber
                  : orderDetail?.billing_address.address?.phoneNumber}
              </p>
              <p>
                {orderDetail?.shipping_address
                  ? orderDetail.shipping_address.address?.email
                  : orderDetail?.billing_address.address?.email}
              </p>
            </div>
          </div>
          <div className="order-placed-shipment">
            <span className="material-symbols-outlined">local_shipping</span>
            <div className="address">
              <h5>Shipping speed</h5>
              <p>
                Arrive by{" "}
                {orderDetail?.delivery_details.estimated_delivery_date}
              </p>
            </div>
          </div>
          <div className="order-placed-payment">
            <span className="material-symbols-outlined">credit_card</span>
            <div className="address">
              <h5>Payment method</h5>
              <p>{orderDetail?.payment_details.method}</p>
            </div>
          </div>
          {orderDetail?.payment_details.method.toLowerCase() ==
            "Direct Bank Transfer".toLowerCase() && 
          <div className="bank-details section">
            <div className="section-sub-heading">
              <h3>Bank details</h3>
            </div>
            <div className="bank-details-info">
              <div className="space-between">
                <p>Bank Name</p>
                <p>
                  {bankDetails?.bank_name}
                  <CopyIcon
                    copyText={bankDetails?.bank_name ?? "failed to copy"}
                  />
                </p>
              </div>
              <br />
              <div className="space-between">
                <p>Account Number</p>
                <p>
                  {bankDetails?.account_number}
                  <CopyIcon
                    copyText={bankDetails?.account_number ?? "failed to copy"}
                  />
                </p>
              </div>
              <br />
              <div className="space-between">
                <p>IFSC Code</p>
                <p>
                  {bankDetails?.ifsc_code}
                  <CopyIcon
                    copyText={bankDetails?.ifsc_code ?? "failed to copy"}
                  />
                </p>
              </div>
              <br />
              <div className="space-between">
                <p>UPI Id</p>
                <p>
                  {bankDetails?.upi_id}
                  <CopyIcon
                    copyText={bankDetails?.upi_id ?? "failed to copy"}
                  />
                </p>
              </div>
            </div>
          </div>
            }
          {orderDetail?.payment_details.method.toLowerCase() ==
            "Direct Bank Transfer".toLowerCase() && (
            <div className="notice Board">
              <NoticeBoard>
                Please send the screenshot of your payment confirmation and
                order ID to efregr@gmail.com or WhatsApp at 9090909090. Your
                prompt response within 2 days is appreciated to avoid automatic
                order cancellation
              </NoticeBoard>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
