import React, { useState } from "react";
import "./placeorderstepthree.css";
import { Link, useNavigate } from "react-router-dom";

// common component
import LoadingButton from "../../components/common/LoadingButton";
import { EditButton } from "../../components/common/EditButton";
import Image from "../../components/common/Image";

// INTERFACE
import { IPlaceOrderData, IOrderDetails } from "../../interfaces/IPlaceOrder";

// utils and Custom hook
import { objectToString } from "../../utils/objectToString";
import useApiCall from "../../hooks/useApiCall";

// config
import { PLACE_ORDER } from "../../config/backendApi";

// store
import { useStore } from "../../context/store";
import { convertKeysToSnakeCase, getDeliveryDate } from "../../utils/utils";
import { popupMessage } from "../../utils/popupMessage";

const payment_mode = require("../../assets/images/payment_mode.png");
interface IProps {
  orderDetails: IOrderDetails;
  placeOrderData: IPlaceOrderData | undefined | null;
  handleStep: (step: number) => void;
  isShippingAddress: boolean;
}
export default function PlaceOrderStepThree({
  orderDetails,
  placeOrderData,
  handleStep,
  isShippingAddress,
}: IProps) {
  const [isPlaceOrdering, setIsPlaceOrdering] = useState<boolean>(false);
  const { authToken } = useStore();
  const navigate = useNavigate();
  const { loading, makeApiCall } = useApiCall();
  const onPlaceOrder = async () => {
    const data = orderDetails;
    data.billing_address = convertKeysToSnakeCase(orderDetails.billing_address);
    data.shipping_address = convertKeysToSnakeCase(
      orderDetails.shipping_address
    );
    try {
      setIsPlaceOrdering(true);
      const url = PLACE_ORDER;
      const { ok, response } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        false
      );
      setIsPlaceOrdering(false);

      if (ok) {
        popupMessage(false, "Order Placed");
        navigate("/order-placed/", {
          state: {
            bank_details: response?.data.bank_details,
            order: response?.data.order,
          },
        });
      }
    } catch {}
  };
  const displayPaymentMode: { [key: string]: string } = {
    directBankTransfer: "Direct bank transfer",
    cashOnDelivery: "Cash on delivery",
    onlinePayment: "Online payment",
  };
  console.log(orderDetails);
  return (
    <>
      <div className="place-order-review">
        <div className="section-sub-heading">
          <h3>Review and place your order</h3>
        </div>
        <ul className="place-order-review-items">
          <li className="place-order-review-shipment">
            <div className="shipment-info">
              <h5>
                Shipment ({placeOrderData?.delivery_details.min_delivery_days} -{" "}
                {placeOrderData?.delivery_details.max_delivery_days} business
                days)
              </h5>
              <p>
                arrive by{" "}
                {getDeliveryDate(
                  new Date(),
                  placeOrderData?.delivery_details.max_delivery_days ?? 5
                )}
              </p>
            </div>
            <div className="shipment-price">
              {orderDetails.delivery_details.delivery_charge ? (
                <p className="price">
                  &#8377;{orderDetails.delivery_details.delivery_charge}
                </p>
              ) : (
                <p className="price">Free delivery</p>
              )}
            </div>
          </li>

          {objectToString(orderDetails.shipping_address) &&
            orderDetails.is_shipping_address &&
            orderDetails.shipping_address.address && (
              <li className="place-order-review-shipping-address">
                <div className="address">
                  <h5>Shipping Address</h5>
                  <p>
                    {objectToString(
                      orderDetails.shipping_address.address,
                      0,
                      9
                    )}
                  </p>
                  <p>{orderDetails.shipping_address.address.phoneNumber}</p>
                  <p>{orderDetails.shipping_address.address.email}</p>
                </div>

                <div className="address-edit-btn">
                  <EditButton onClick={() => handleStep(1)} />
                </div>
              </li>
            )}
          {objectToString(orderDetails.billing_address.address) && (
            <li className="place-order-review-billing-address">
              <div className="address">
                <h5>Billing Address</h5>
                <p>
                  {objectToString(orderDetails.billing_address.address, 0, 9)}
                </p>
                <p>{orderDetails.billing_address.address.phoneNumber}</p>
                <p>{orderDetails.billing_address.address.email}</p>
              </div>
              <div className="address-edit-btn">
                <EditButton onClick={() => handleStep(1)} />
              </div>
            </li>
          )}
          <li className="place-order-review-payment-method">
            <div className="payment-method">
              <h5 className="cap">payment method</h5>
              <div className="payment-info">
                <div className="payment-image">
                  <img src={payment_mode} alt="" />
                </div>
                <div className="data">
                  <p>{orderDetails.payment_details.method}</p>
                  <p>{orderDetails.total}</p>
                </div>
              </div>
            </div>
            <EditButton onClick={() => handleStep(2)} />
          </li>
        </ul>

        <div className="placeorder-review-items-container">
          <h5 className="section-sub-heading cap">Item in this order</h5>
          <ul className="placeorder-review-items">
            {placeOrderData?.cart.cart_items.map((item, idx) => (
              <li>
                <div className="placeorder-review-item-image-info">
                  <div className="placeorder-review-item-image">
                    <Image src={item.product.image_url} />
                  </div>
                  <div className="placeorder-review-item-info">
                    <h5 className="placeorder-review-item-name">
                      {item.product.name}
                    </h5>
                    <p className="price">&#8377; {item.product.price}</p>
                  </div>
                </div>
                <div className="placeorder-review-item-quantity-total">
                  <div className="placeorder-review-item-quantity">
                    <h5>
                      <span className="cross">x</span> {item.quantity}
                    </h5>
                  </div>
                  <div className="placeorder-review-item-total cap price">
                    total &#8377;{item.total}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="placeorder-review-summary">
          <h4 className="section-sub-heading cap">Summary</h4>
          <div className="placeorder-review-summary-item">
            <h5 className="cap">Subtotal</h5>
            <p className="price">&#8377;{placeOrderData?.cart.subtotal}</p>
          </div>
          <div className="placeorder-review-summary-item">
            <h5 className="cap">Tax</h5>
            <p className="price"> &#8377; {orderDetails.gst}</p>
          </div>
          <div className="placeorder-review-summary-item">
            <h5 className="cap">Shipping</h5>
            {orderDetails.delivery_details.delivery_charge ? (
              <p className="price">
                &#8377;{orderDetails.delivery_details.delivery_charge}
              </p>
            ) : (
              <p className="price">Free delivery</p>
            )}
          </div>
          <div className="placeorder-review-summary-item">
            <h5 className="cap">Discount</h5>
            <p className="price">-&#8377;{placeOrderData?.cart.discount}</p>
          </div>
          <div className="placeorder-review-summary-item">
            <h5 className="cap">Total</h5>
            <p className="price">
              &#8377;
              {orderDetails.total}
            </p>
          </div>
        </div>
        <div className="placeorder-review-proceed-btn">
          <LoadingButton
            className={"btn btn-medium cap"}
            onClick={onPlaceOrder}
            isLoading={loading && isPlaceOrdering}
          >
            Place your order
          </LoadingButton>
          <Link to={"/"} className="placeorder-cancel-btn btn btn-small">
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
}
