import React from "react";
import "./singleorder.css";

import FormControlLabel from "@mui/material/FormControlLabel";
import { ToggleSwitch } from "../../components/common/ToggleIOSSwitchStyleConfig";
import { useEffect } from "react";
import { useState } from "react";
// utils
import { popupMessage } from "../../utils/popupMessage";
import RatingStar from "../../components/common/RatingStar";
// import {
//   fake_order_items,
//   fake_return_product,
// } from "../../@fake-db/singleOrder";
import { toggler } from "../../utils/toggler";
import ReturnOrderQuantityController from "../../components/common/ReturnOrderQuantityController";

// common component
import LoadingButton from "../../components/common/LoadingButton";

// interface
import {
  IOrderDetails,
  IOrderItem,
  IOrderItemFeedback,
  IReturnItems,
} from "../../interfaces/ISingleorder";
import {
  ACCOUNT_ORDER_CANCEL,
  ACCOUNT_ORDER_DETAILS,
  CANCEL_ORDER,
  ORDER_ITEMS_FEEDBACK,
  RETURN_ORDER_PLACE,
} from "../../config/backendApi";
import { useNavigate, useParams } from "react-router-dom";
import useApiCall from "../../hooks/useApiCall";
import { useStore } from "../../context/store";
import { objectToString } from "../../utils/objectToString";
import { animationStyle } from "../../styles/statusAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import NoticeBoard from "../../components/common/NoticeBoard";
import ConfirmationBox from "../../components/common/ConfirmationBox";

// images
const directBankTransfer = require("../../assets/svg/paymentMode/direct-bank-transfer.png");
const onlinePayment = require("../../assets/svg/paymentMode/online-payment.png");
const cashOwnDelivery = require("../../assets/svg/paymentMode/cash-own-delivery.png");

export function SingleOrder() {
  const { orderId } = useParams();
  const { loading, makeApiCall, reload } = useApiCall();
  const { authToken } = useStore();
  const [order, setOrder] = useState<IOrderDetails>();
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [returnItems, setReturnItems] = useState<IReturnItems[]>([]);
  const [feedbackToggle, setFeedbackToggle] = useState<boolean>(false);
  const [reFetchData, setReFetchdata] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState({
    return: false,
    feeback: false,
    cancel: false,
  });
  const { contactDetails } = useStore();
  const [isFeedbackChanged, setIsFeedbackChanged] = useState<boolean>(false);
  const [cancelConfirmation, setCancelConfirmation] = React.useState(false);

  const navigate = useNavigate();
  // const [feedbacks, setFeedbacks] = useState<IOrderItemFeedback[]>();
  useEffect(() => {
    fetchData();
  }, [reFetchData, orderId]);
  const fetchData = async () => {
    try {
      const url = ACCOUNT_ORDER_DETAILS + `${orderId}/`;

      const { response, ok } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        true
      );
      if (ok && response) {
        const data: {
          data: IOrderDetails;
        } = response.data;
        if (data.data) {
          setOrder(data.data);
          setOrderItems(data.data.order_items);
        }
      } else {
      }
    } catch {}
  };
  function onFeedbackChange(star: number, feedback_id: number) {
    if (orderItems) {
      let updatedOrderItems = orderItems.map((obj) => {
        if (obj.feedback && obj.feedback.id === feedback_id) {
          if (star == obj.feedback.star_rating) {
            star -= 1;
          }
          return {
            ...obj,
            feedback: {
              ...obj.feedback,
              star_rating: star,
            },
          };
        }
        return obj;
      });
      setOrderItems(updatedOrderItems);
      setIsFeedbackChanged(true);
    }
  }
  function toggleFeedback() {
    setFeedbackToggle((prev) => !prev);
  }
  function onFeedbackEditButton(feedback_id: number) {
    if (orderItems) {
      let updatedOrderItems = orderItems.map((obj) => {
        if (obj.feedback && obj.feedback.id === feedback_id) {
          return {
            ...obj,
            has_feedback: false,
          };
        }
        return obj;
      });
      setOrderItems(updatedOrderItems);
    }
  }
  function onReturnItemSelected(checked: boolean, order_item_id: number) {
    if (checked) {
      const new_return_item = {
        order_item_id: order_item_id,
        return_quantity: 0,
      };
      setReturnItems((prev) => [...prev, new_return_item]);
    } else {
      const updated_return_items = returnItems.filter(
        (item) => item.order_item_id !== order_item_id
      );
      setReturnItems(updated_return_items);
    }
  }
  function onReturnQuantityChange(type: string, id: number, quantity: number) {
    if (returnItems) {
      const original_item_quantity = orderItems.find(
        (item) => item.id == id
      )?.quantity;
      let new_quantity: number;
      if (quantity == undefined || original_item_quantity == undefined) {
        return;
      }
      if (type == "add" && quantity <= original_item_quantity) {
        new_quantity = quantity;
      } else if (type == "minise" && quantity >= 0) {
        new_quantity = quantity;
      } else if (type == "change") {
        if (isNaN(quantity)) {
          new_quantity = 0;
        } else if (quantity <= original_item_quantity) {
          new_quantity = quantity;
        }
      }
      const updated_return_items = returnItems.map((item) => {
        if (item.order_item_id == id) {
          return {
            ...item,
            return_quantity: new_quantity ?? item.return_quantity,
          };
        }
        return item;
      });
      setReturnItems(updated_return_items);
    }
  }
  const onFeedbackSubmit = async () => {
    try {
      const url = ORDER_ITEMS_FEEDBACK;

      setButtonLoading({ ...buttonLoading, feeback: true });
      const data = {
        order_items: orderItems,
      };
      const { response, ok } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        false
      );
      if (ok && response) {
        popupMessage(false, response.data.message);
        setReFetchdata((prev) => !prev);
        setButtonLoading({ ...buttonLoading, feeback: false });
      } else {
      }
    } catch {}
  };
  const onReturnOrderSubmit = async () => {
    try {
      const url = RETURN_ORDER_PLACE;
      setButtonLoading({ ...buttonLoading, return: true });
      const filtered_return_items = returnItems.filter(
        (item) => item.return_quantity != 0
      );
      if (!order || filtered_return_items.length == 0) {
        popupMessage(
          true,
          "Choose return products with non-zero quantity before submit"
        );

        return;
      }
      const data = {
        main_order_id: order.id,
        return_products: filtered_return_items,
      };
      const { response, ok } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        false
      );
      if (ok && response) {
        setButtonLoading({ ...buttonLoading, return: false });
        popupMessage(false, response.data.message);
        setReFetchdata((prev) => !prev);
      } else {
      }
    } catch {}
  };
  const onCancelOrderSubmit = async () => {
    try {
      const url = ACCOUNT_ORDER_CANCEL + `${orderId}/`;
      setButtonLoading({ ...buttonLoading, cancel: true });
      const { response, ok } = await makeApiCall(
        url,
        "delete",
        {},
        true,
        authToken,
        false
      );
      if (ok && response) {
        popupMessage(false, response.data.message);
        setReFetchdata((pre) => !pre);
      } else {
      }
    } catch {}
  };

  return (
    <>
      <section className="single-order-section">
        <ConfirmationBox
          onConfirm={onCancelOrderSubmit}
          setVisible={setCancelConfirmation}
          visible={cancelConfirmation}
        />
        <div className="section-center single-order-center">
          <div className="section-heading">
            <h1 className="cap">
              {order?.is_return_order && "Return"} Order Details
            </h1>
            <p className="order-id cap">Order ID # {order?.order_id}</p>
          </div>
          <div className="single-order-status-tracking">
            <div className="section-sub-heading">
              <h3 className="cap">Order Status</h3>
            </div>
            <ul className="order-status-tracks">
              {order?.status_track.map(
                (item, idx) =>
                  item?.date && (
                    <React.Fragment key={+order.id + idx}>
                      <li className={"order-status-track-main"}>
                        <span
                          className="is-complete"
                          style={{
                            ...animationStyle,
                            animationName: "statusTick",
                            animationDelay: `${idx}s`,
                          }}
                        ></span>
                        <div
                          className="status-data"
                          style={{
                            ...animationStyle,
                            animationName: "statusData",
                            animationDelay: `${idx}s`,
                          }}
                        >
                          <p
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          ></p>
                          <p className="date">{item.date}</p>
                        </div>
                      </li>
                      {idx !== (order?.status_track.length ?? 0) - 1 && (
                        <li className="order-status-track-line">
                          <span
                            className="is-complete"
                            style={{
                              ...animationStyle,
                              animationName: "statusLine",
                              animationDelay: `${idx + 0.2}s`,
                            }}
                          ></span>
                        </li>
                      )}
                    </React.Fragment>
                  )
              )}
            </ul>
          </div>
          {order?.shipping_address && order?.shipping_address.address && (
            <div className="orde-billing-address">
              <h5 className="section-sub-heading cap">billing address</h5>
              <div className="address">
                <p>
                  {order?.shipping_address.address.firstName}
                  {order.shipping_address.address.lastName}
                </p>
                <p>{objectToString(order?.shipping_address.address, 2, 9)}</p>
                <p>{order.shipping_address.address?.email}</p>
                <p>{order.shipping_address.address?.phoneNumber}</p>
              </div>
            </div>
          )}

          {order?.billing_address && (
            <div className="orde-billing-address">
              <h5 className="section-sub-heading cap">billing address</h5>
              <div className="address">
                <p>
                  {order?.billing_address.address.firstName}{" "}
                  {order.billing_address.address.lastName}
                </p>
                <p>{objectToString(order?.billing_address.address, 2, 9)}</p>
                <p>{order.billing_address.address?.email}</p>
                <p>{order.billing_address.address?.phoneNumber}</p>
              </div>
            </div>
          )}

          <div className="single-order-payment-method">
            <h5 className="section-sub-heading  cap">payment method</h5>
            <div className="payment-info">
              <img src={order?.payment_details.image_url} alt="" />
              <p className="cap">{order?.payment_details.method}</p>
            </div>
          </div>
          <div className="single-order-items-container">
            <h5 className="section-sub-heading cap">Item in this order</h5>
            <ul className="single-order-items">
              {orderItems.map((item, idx) => (
                <li>
                  <div
                    className="single-order-item-image-info pointer"
                    onClick={
                      item.is_product_exist
                        ? () => {
                            navigate(`/products/${item.product_id}/`);
                          }
                        : () => {}
                    }
                  >
                    <div className="single-order-item-image">
                      <img src={item.product_image_url} alt="" />
                    </div>
                    <div className="single-order-item-info">
                      <h5 className="single-order-item-name">
                        {item.product_name}
                      </h5>
                      <p className="price">${item.product_price}</p>
                    </div>
                  </div>
                  <div className="single-order-item-quantity-total">
                    <div className="single-order-item-quantity">
                      <h5>
                        <span className="cross">x</span> {item.quantity}
                      </h5>
                    </div>
                    <div className="single-order-item-total cap price">
                      total : &#8377;{item.total}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="single-order-summary">
            <h4 className="section-sub-heading cap">Summary</h4>
            <div className="single-order-summary-item">
              <h5 className="cap">Subtotal</h5>
              <p className="price">&#8377;{order?.subtotal}</p>
            </div>
            {!order?.is_return_order && (
              <>
                <div className="single-order-summary-item">
                  <h5 className="cap">Tax</h5>
                  <p className="price">&#8377;{order?.gst}</p>
                </div>

                <div className="single-order-summary-item">
                  <h5 className="cap">Shipping</h5>
                  {order?.delivery_details.delivery_charge != 0 ? (
                    <p className="price">
                      &#8377;{order?.delivery_details.delivery_charge}
                    </p>
                  ) : (
                    <p>Free delivery</p>
                  )}
                </div>
              </>
            )}

            <div className="single-order-summary-item">
              <h5 className="cap">Discount</h5>
              <p className="price">-&#8377;{order?.discount}</p>
            </div>
            <div className="single-order-summary-item">
              <h5 className="cap">Total</h5>
              <p className="price">&#8377;{order?.total}</p>
            </div>
          </div>
          {order?.can_cancel && (
            <div className="cancel-order">
              <button
                className="btn btn-medium btn-grey"
                onClick={() => setCancelConfirmation(true)}
              >
                Cancel Order
              </button>
            </div>
          )}

          {order?.is_return_order && (
            <div className="cancel-order">
              <button
                className="btn btn-medium btn-grey"
                onClick={() => navigate(`/orders/${order.main_order}`)}
              >
                View Original Order
              </button>
            </div>
          )}
          {order?.is_completed && (
            <>
              {orderItems.length != 0 && (
                <div className="order-products-feedback">
                  <h4 className="section-sub-heading cap">Feedback</h4>
                  <div className="feedback-toggle">
                    <p>Add feedback to each product.</p>
                    <FormControlLabel
                      label={""}
                      control={
                        <ToggleSwitch
                          onChange={toggleFeedback}
                          checked={feedbackToggle}
                          sx={{ m: 1 }}
                        />
                      }
                    />
                  </div>

                  <ul
                    className={`feedback-items ${
                      feedbackToggle && "show-feedback-items"
                    }`}
                  >
                    {orderItems.map((item, idx) => (
                      <>
                        <li key={idx} className="feedback-item">
                          <p>
                            {idx + 1} . {item.product_name}
                          </p>
                          <div
                            // id={item.feedback.id}
                            className={`star-list ${
                              item.has_feedback && "has_feedback"
                            } `}
                          >
                            <RatingStar
                              fullStar={item.feedback.star_rating}
                              onClick={
                                !item.has_feedback ? onFeedbackChange : () => {}
                              }
                              id={item.feedback.id}
                            />
                            {item.has_feedback && (
                              <>
                                <span className="edit-btn">
                                  <FontAwesomeIcon
                                    icon={faPenToSquare}
                                    onClick={() =>
                                      onFeedbackEditButton(item.feedback.id)
                                    }
                                  />
                                </span>
                              </>
                            )}
                          </div>
                        </li>
                      </>
                    ))}
                    <div className="feedback-apply-btn">
                      <LoadingButton
                        className={"btn btn-medium feedback-button cap"}
                        isLoading={loading && buttonLoading.feeback}
                        onClick={
                          isFeedbackChanged ? onFeedbackSubmit : () => {}
                        }
                      >
                        Apply Feedback
                      </LoadingButton>
                      ;
                    </div>
                  </ul>
                </div>
              )}

              {order.can_return && orderItems.length != 0 && (
                <div className="order-products-return">
                  <h4 className="section-sub-heading cap">Return Products</h4>

                  <div className="return-toggle">
                    <p>Enable to return your products.</p>
                    <FormControlLabel
                      label={""}
                      control={
                        <ToggleSwitch
                          onChange={() => {
                            toggler(
                              document.querySelector(
                                ".single-order-center .order-products-return .return-products"
                              ),
                              "show-return-products"
                            );
                          }}
                          sx={{ m: 1 }}
                        />
                      }
                    />
                  </div>
                  <div className="return-products">
                    <div className="notice-board mb-1">
                      <NoticeBoard>
                        Please be advised that each customer is permitted only
                        one return per item. Once areturn order has been
                        submitted, you will not have another opportunity to
                        initiate areturn for the same item. Therefore, we urge
                        you to carefully consider the quantity you wish to
                        return before finalizing your return order submission.
                        <br />
                        <br />
                        Additionally, we kindly request that you share a video
                        explaining the reason for the return, particularly in
                        cases of damage or defects. Please send the video along
                        with your explanation to {contactDetails?.email} or
                        contact us at +91
                        {contactDetails?.whatsapp_number}. Your cooperation is
                        greatly appreciated.
                      </NoticeBoard>
                    </div>
                    <ul className="return-products-list">
                      {orderItems.map((item, idx) => {
                        if (!item.is_returned) {
                          return (
                            <>
                              <li className="return-product">
                                <p>
                                  {idx + 1} . {item.product_name}
                                </p>

                                <ReturnOrderQuantityController
                                  id={item.id}
                                  onReturnItemSelected={onReturnItemSelected}
                                  returnItems={returnItems}
                                  onReturnQuantityChange={
                                    onReturnQuantityChange
                                  }
                                />
                              </li>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <li className="return-product">
                                <p>
                                  {idx + 1} . {item.product_name}
                                </p>

                                <p
                                  className="link"
                                  onClick={() =>
                                    navigate(
                                      `/orders/${item.return_item_order_id}`
                                    )
                                  }
                                >
                                  View return order
                                </p>
                              </li>
                            </>
                          );
                        }
                      })}
                      <div className="return-order-place-btn-div">
                        <LoadingButton
                          className={"btn btn-medium feedback-button"}
                          isLoading={loading && buttonLoading.return}
                          onClick={onReturnOrderSubmit}
                        >
                          Place ReturnOrder
                        </LoadingButton>
                        ;
                      </div>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
