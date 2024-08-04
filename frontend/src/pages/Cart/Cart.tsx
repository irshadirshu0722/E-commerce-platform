import React, { useState, useEffect, FormEvent } from "react";
import "./cart.css";

// common component
import LoadingButton from "../../components/common/LoadingButton";
// hooks and store
import useApiCall from "../../hooks/useApiCall";
import { useStore } from "../../context/store";

// others
import {
  CART,
  CART_UPDATE,
  CART_COUPON,
  PLACE_ORDER_VERIFY,
} from "../../config/backendApi";
// interface ans schema
import { ICart, ICartUpdateItem, ICartItem } from "../../interfaces/ICart";
import { IOrderDetails, IPlaceOrderData } from "../../interfaces/IPlaceOrder";
// utils
import Loading from "../../components/common/Loading/Loading";
import { popupMessage } from "../../utils/popupMessage";
import Image from "../../components/common/Image";
import { QuantityController } from "../../components/common/QuantityController";
import { useNavigate } from "react-router-dom";
export function Cart() {
  const { authToken, setUserDetails } = useStore();
  const { loading, makeApiCall, reload } = useApiCall();
  const [cartDetails, setCartDetails] = useState<ICart>();
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isUpating, setIsUpdating] = useState<boolean>(false);
  const [isCouponAdding, setIsCouponAdding] = useState<boolean>(false);
  const [isPlaceOrdering, setIsPlaceOrdering] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [isUpdated]);
  const fetchData = async () => {
    try {
      const url = CART;
      const { ok, response } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken
      );
      if (ok) {
        const data = response?.data;
        if (data.cart) {
          setCartDetails(data.cart);
        }
      }
    } catch {}
  };
  const onUpdateCart = async () => {
    try {
      setIsUpdating(true);
      let data = {
        cart_items: cartDetails?.cart_items,
      };
      const url = CART_UPDATE;
      const { ok, response } = await makeApiCall(
        url,
        "put",
        data,
        true,
        authToken,
        false
      );
      setIsUpdating(false);
      if (ok) {
        popupMessage(false, response?.data.message);
        setIsUpdated(!isUpdated);
      }
    } catch {}
  };
  const onCouponSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsCouponAdding(true);
      let data = {
        code: couponCode,
      };
      const url = CART_COUPON;
      const { ok, response } = await makeApiCall(
        url,
        "post",
        data,
        true,
        authToken,
        false
      );
      setIsCouponAdding(false);
      if (ok) {
        popupMessage(false, response?.data.message);
        setIsUpdated(!isUpdated);
      } else {
        if (response?.error) {
          popupMessage(true, response?.error);
        }
      }
    } catch {}
  };
  function onUpdateItemChange(type: string, id: number, value: string = "") {
    if (cartDetails?.cart_items) {
      const new_cart_items: ICartItem[] = cartDetails?.cart_items?.map(
        (item) => {
          if (item.id == id) {
            let new_quantity = item.quantity;
            if (type == "add" && new_quantity + 1 <= item.product.stock) {
              new_quantity += 1;
            } else if (type == "minise" && new_quantity - 1 >= 1) {
              new_quantity -= 1;
            } else if (type == "change") {
              const temp = parseInt(value, 10) || 0;
              if (value === "") {
                new_quantity = 0;
              } else if (temp <= item.product.stock) {
                new_quantity = temp;
              }
            }
            return { ...item, quantity: new_quantity };
          } else {
            return item;
          }
        }
      );
      setCartDetails({ ...cartDetails, cart_items: new_cart_items });
    }
  }
  const onPlaceOrder = async () => {
    try {
      setIsPlaceOrdering(true);
      const url = PLACE_ORDER_VERIFY;
      const { ok, response } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        false
      );
      setIsPlaceOrdering(false);
      if (ok) {
        popupMessage(false, response?.data.message);
        const data: {
          place_order_data: IPlaceOrderData;
          order_details: IOrderDetails;
        } = response?.data.data;
        if (data) {
          sessionStorage.setItem("isPlaceOrder", JSON.stringify(true));
          navigate("/placeorder/", {
            state: {
              placeOrderData: data.place_order_data,
              orderDetails: data.order_details,
            },
          });
        }
      }
    } catch {}
  };
  if (loading && reload) {
    return <Loading />;
  }
  return (
    <>
      <section className="cart-section">
        <div className="section-center cart-center">
          <div className="section-heading">
            <h1>Cart</h1>
          </div>
          <div>
            {cartDetails?.cart_items.length == 0 && (
              <h1>Your cart is empty. Let's continue shopping!</h1>
            )}
            <ul className="cart-items">
              {cartDetails?.cart_items.map((item, idx) => (
                <li key={idx}>
                  <div
                    className="cart-item-image-info"
                    onClick={() => navigate(`/products/${item.product.id}/`)}
                  >
                    <div className="cart-item-image">
                      <Image src={item.product.image_url} />
                    </div>
                    <div className="cart-item-info">
                      <h5 className="cart-item-name">{item.product.name}</h5>
                      <p className="price"> &#8377;{item.product.price}</p>
                    </div>
                  </div>
                  <div className="cart-item-quantity-total">
                    <QuantityController
                      onChange={onUpdateItemChange}
                      quantity={item.quantity}
                      id={item.id}
                      key={item.id}
                    />
                    <div className="cart-item-total cap price">
                      total :&#8377;{item.total}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {cartDetails?.cart_items.length != 0 && (
            <div className="cart-coupon-code">
              <h4 className="section-sub-heading cap">Apply coupon code</h4>
              <form action="" onSubmit={onCouponSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-button">
                  <LoadingButton
                    className={"btn btn-medium cap"}
                    isLoading={loading && isUpating}
                    onClick={onUpdateCart}
                    type="button"
                  >
                    Update
                  </LoadingButton>
                  <LoadingButton
                    className={"btn btn-medium cap"}
                    isLoading={loading && isCouponAdding}
                    type="submit"
                  >
                    Apply
                  </LoadingButton>
                </div>
              </form>
            </div>
          )}
          {cartDetails?.cart_items.length != 0 && (
            <div className="cart-summary">
              <h4 className="section-sub-heading cap">Summary</h4>
              <div className="cart-summary-item">
                <h5 className="cap">Subtotal</h5>
                <p className="price">&#8377;{cartDetails?.subtotal}</p>
              </div>
              <div className="cart-summary-item">
                <h5 className="cap">Tax</h5>
                <p className="price">
                  {cartDetails?.gst ? cartDetails?.gst : "18"}
                </p>
              </div>

              <div className="cart-summary-item">
                <h5 className="cap">Discount</h5>
                <p className="price">&#8377;{cartDetails?.discount}</p>
              </div>
              <div className="cart-summary-item">
                <h5 className="cap">Total</h5>
                <p className="price">&#8377;{cartDetails?.total}</p>
              </div>
            </div>
          )}
          {cartDetails?.cart_items.length != 0 && (
            <div className="cart-placeorder">
              <button className="  btn btn-medium continue-shooping-btn cap">
                Continue shopping
              </button>
              <LoadingButton
                className={"btn btn-medium place-order-btn cap"}
                isLoading={loading && isPlaceOrdering}
                onClick={onPlaceOrder}
                type="button"
              >
                Proceed to checkout
              </LoadingButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
