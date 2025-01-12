import React, { useEffect, useState } from "react";
import "./placeordersteptwo.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../schemas/PlaceOrderPaymentSchema";
import { IPlaceOrderData, IOrderDetails } from "../../interfaces/IPlaceOrder";
import { object } from "yup";
import NoticeBoard from "../../components/common/NoticeBoard";
interface Props {
  handleStep: (step: number) => void;
  orderDetails: IOrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<IOrderDetails>>;
  placeOrderData: IPlaceOrderData | undefined | null;
}
export default function PlaceOrderStepTwo({
  handleStep,
  orderDetails,
  setOrderDetails,
  placeOrderData,
}: Props) {
  const [paymentMode, setPaymentMode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setPaymentMode(orderDetails.payment_details.method);
  }, []);

  const handleFormGroupClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const input =
      event.currentTarget.querySelector<HTMLInputElement>("input[type=radio]");
    if (input) {
      input.click();
      setPaymentMode(input.value); // Update the selected payment mode
    }
  };
  const onSubmit = () => {
    if (!paymentMode) {
      setErrorMessage("Please select a payment mode.");
      return;
    }

    setOrderDetails({
      ...orderDetails,
      payment_details: {
        ...orderDetails.payment_details,
        method: paymentMode,
      },
    });
    handleStep(3);
  };
  return (
    <>
      <div className="placeorder-step2-payment-method">
        <div className="section-sub-heading">
          <h3 className="">Payment Method</h3>
        </div>
        <div className="placeorder-step2-payment-methods-form">
          <form>
            {errorMessage && (
              <p className="input-box-error-message">{errorMessage}</p>
            )}
            {placeOrderData?.payment_modes.direct_bank_transfer && (
              <div className="form-group" onClick={handleFormGroupClick}>
                <div className="form-sub-group">
                  <input
                    type="radio"
                    id="directBankTransfer"
                    value={
                      placeOrderData.payment_modes.direct_bank_transfer_txt
                    }
                    name="paymentMode"
                    checked={
                      paymentMode ==
                      placeOrderData.payment_modes.direct_bank_transfer_txt
                    }
                  />
                  <label htmlFor="directBankTransfer">
                    Direct Bank Transfer
                  </label>
                </div>
                <div
                  className={`description ${
                    paymentMode ==
                      placeOrderData.payment_modes.direct_bank_transfer_txt &&
                    "open"
                  }`}
                >
                  <NoticeBoard>
                    {
                      placeOrderData.payment_modes
                        .direct_bank_transfer_description
                    }
                  </NoticeBoard>
                </div>
              </div>
            )}
            {placeOrderData?.payment_modes.cash_on_delivery && (
              <div className="form-group" onClick={handleFormGroupClick}>
                <div className="form-sub-group">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    value={placeOrderData.payment_modes.cash_on_delivery_txt}
                    name="paymentMode"
                    checked={
                      paymentMode ==
                      placeOrderData.payment_modes.cash_on_delivery_txt
                    }
                  />
                  <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                </div>
                <div
                  className={`description ${
                    paymentMode ==
                      placeOrderData.payment_modes.cash_on_delivery_txt &&
                    "open"
                  }`}
                >
                  <NoticeBoard>
                    {placeOrderData.payment_modes.cash_on_delivery_description}
                  </NoticeBoard>
                </div>
              </div>
            )}
            {placeOrderData?.payment_modes.online_payment && (
              <div className="form-group" onClick={handleFormGroupClick}>
                <div className="form-sub-group">
                  <input
                    type="radio"
                    id="onlinePayment"
                    value={placeOrderData.payment_modes.online_payment_txt}
                    name="paymentMode"
                    checked={
                      paymentMode ==
                      placeOrderData.payment_modes.online_payment_txt
                    }
                  />
                  <label htmlFor="onlinePayment">Online Payment</label>
                </div>
                <div
                  className={`description ${
                    paymentMode ==
                      placeOrderData.payment_modes.online_payment_txt && "open"
                  }`}
                >
                  <NoticeBoard>
                    {placeOrderData.payment_modes.online_payment_description}
                  </NoticeBoard>
                </div>
              </div>
            )}
            <div className="placeorder-step2-proceed-btn">
              <button
                type="button"
                onClick={onSubmit}
                className="btn btn-medium"
              >
                Continue to Review
              </button>
              <Link to={"/"} className="placeorder-cancel-btn btn btn-small">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
