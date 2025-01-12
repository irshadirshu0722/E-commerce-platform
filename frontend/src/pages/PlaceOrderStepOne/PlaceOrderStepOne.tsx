import React, { useEffect, useState, Dispatch } from "react";
import "./placeorderstepone.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import { ToggleSwitch } from "../../components/common/ToggleIOSSwitchStyleConfig";
import { indianStates, keralaDistricts } from "../../utils/state_district";

import { Link, useNavigate, useOutletContext } from "react-router-dom";
// own utils

import {
  buildOrderForm,
  OrderFormSchema,
  IOrderFormData,
} from "../../hooks/usePlaceOrderAddressSchema";
import { toggler } from "../../utils/toggler";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  IPlaceOrderData,
  IOrderDetails,
  initPlaceOrderData,
  initAddress,
} from "../../interfaces/IPlaceOrder";
// component
import { DropdownList } from "../../components/common/DropDownList/DropDownList";
import { findDeliveryCharge } from "../../utils/utils";

interface IProps {
  handleStep: (step: number) => void;
  orderDetails: IOrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<IOrderDetails>>;
  placeOrderData: IPlaceOrderData | undefined | null;
  setPlaceOrderData: React.Dispatch<React.SetStateAction<IPlaceOrderData>>;
  isShippingAddress: boolean;
  setIsShippingAddress: React.Dispatch<React.SetStateAction<boolean>>;
}
const PlaceOrderStepOne = ({
  handleStep,
  orderDetails,
  setOrderDetails,
  placeOrderData,
  setPlaceOrderData,
  isShippingAddress,
  setIsShippingAddress,
}: IProps) => {
  const [schema, setSchema] = useState<OrderFormSchema>(
    buildOrderForm(isShippingAddress)
  );
  useEffect(() => {
    setSchema(buildOrderForm(isShippingAddress));
  }, [isShippingAddress]);

  const onShippingToggle = () => {
    const state = !isShippingAddress;
    setIsShippingAddress(state);
    setOrderDetails({ ...orderDetails, is_shipping_address: state });
  };
  // const state = toggler(
  //   document.querySelector(".placeorder-center .shipping-address-form"),
  //   "show-shipping-address-form"
  // );
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      billingAddress: orderDetails.billing_address.address,
      shippingAddress: orderDetails.shipping_address.address ?? initAddress,
    },
  });
  const onSubmit = () => {
    const data = getValues();
    let shipping_charge = orderDetails.delivery_details.delivery_charge;
    if (placeOrderData?.delivery_details.free_delivery_over && parseFloat(orderDetails.subtotal) >
      placeOrderData?.delivery_details.free_delivery_over
    ) {
      shipping_charge = 0
    }
      else if (
        isShippingAddress &&
        data.shippingAddress &&
        placeOrderData?.delivery_details
      ) {
        shipping_charge = +findDeliveryCharge(
          data.shippingAddress.state,
          placeOrderData?.delivery_details
        );
      } else if (!isShippingAddress && placeOrderData?.delivery_details) {
        shipping_charge = +findDeliveryCharge(
          data.billingAddress.state,
          placeOrderData?.delivery_details
        );
      }
    let total: string;
    if (placeOrderData && placeOrderData.cart) {
      total = (+placeOrderData.cart.total + +shipping_charge)
        .toFixed(2)
        .toString();
      setOrderDetails({
        ...orderDetails,
        billing_address: { address: data.billingAddress },
        shipping_address: { address: data.shippingAddress ?? undefined },
        delivery_details: { ...orderDetails.delivery_details, delivery_charge:shipping_charge },
        total: total,
        payment_details: {
          ...orderDetails.payment_details,
          amount: total,
        },
      });
    }

    handleStep(2);
  };
  return (
    <>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="placeorder-step1-shipping-address">
          <div className="section-sub-heading cap">
            <h3>Shipping</h3>
          </div>
          <div className="placeorder-shipping-address-toggle">
            <h5>Choose different shipping address</h5>
            <FormControlLabel
              label={""}
              control={
                <ToggleSwitch
                  checked={isShippingAddress}
                  onChange={onShippingToggle}
                  sx={{ m: 1 }}
                />
              }
            />
          </div>
          <div
            className={
              isShippingAddress
                ? "shipping-address-form show-shipping-address-form"
                : "shipping-address-form"
            }
          >
            <div className="form-sub-group">
              <div className="form-group">
                <label htmlFor="#shippingFirstName" className="cap">
                  first name
                </label>
                <span className="input-box-error-message">
                  {errors.shippingAddress?.firstName?.message}
                </span>
                <input
                  type="text"
                  id="shippingFirstName"
                  {...register("shippingAddress.firstName")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="#shippingLastName" className="cap">
                  last name
                </label>
                <span className="input-box-error-message">
                  {errors?.shippingAddress?.lastName?.message}
                </span>
                <input
                  type="text"
                  id="shippingLastName"
                  {...register("shippingAddress.lastName")}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="#shippingAddress" className="cap">
                Address
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.address?.message}
              </span>
              <input
                type="text"
                id="shippingAddress"
                {...register("shippingAddress.address")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#shippingLandmark" className="cap">
                landmark
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.landmark?.message}
              </span>
              <input
                type="text"
                id="shippingLandmark"
                {...register("shippingAddress.landmark")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#shippingCity" className="cap">
                City
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.city?.message}
              </span>
              <input
                type="text"
                id="shippingCity"
                {...register("shippingAddress.city")}
              />
            </div>
            <div className="form-group">
              <DropdownList>
                <label htmlFor="district" className="cap">
                  District
                </label>
                <span className="input-box-error-message">
                  {errors?.shippingAddress?.district?.message}
                </span>
                <div className="dropdown-select">
                  <select
                    id="district"
                    {...register("shippingAddress.district")}
                  >
                    <option value="">Select District</option>
                    {keralaDistricts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </DropdownList>
            </div>
            <div className="form-group">
              <DropdownList>
                <label htmlFor="state" className="cap">
                  State
                </label>
                <span className="input-box-error-message">
                  {errors?.shippingAddress?.state?.message}
                </span>
                <div className="dropdown-select">
                  <select id="state" {...register("shippingAddress.state")}>
                    <option value="">Select State</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </DropdownList>
              <div className="form-group">
                <label htmlFor="#country" className="cap">
                  Country
                </label>
                <span className="input-box-error-message">
                  {errors?.shippingAddress?.country?.message}
                </span>
                <input
                  type="text"
                  id="country"
                  {...register("shippingAddress.country")}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="#pincode" className="cap">
                Pincode
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.pincode?.message}
              </span>
              <input
                type="text"
                id="pincode"
                {...register("shippingAddress.pincode")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#phone_number" className="cap">
                Phone Number
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.phoneNumber?.message}
              </span>
              <input
                type="text"
                id="phone_number"
                {...register("shippingAddress.phoneNumber")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#email" className="cap">
                Email
              </label>
              <span className="input-box-error-message">
                {errors?.shippingAddress?.email?.message}
              </span>
              <input
                type="email"
                id="email"
                {...register("shippingAddress.email")}
              />
            </div>
          </div>
        </div>
        <div className="placeorder-step1-billing-address">
          <div className="section-sub-heading cap">
            <h3>Billing</h3>
          </div>
          <div className="billing-address-form">
            <div className="form-sub-group">
              <div className="form-group">
                <label htmlFor="#first_name" className="cap">
                  first name
                </label>
                <span className="input-box-error-message">
                  {errors?.billingAddress?.firstName?.message}
                </span>
                <input
                  type="text"
                  id="first_name"
                  {...register("billingAddress.firstName")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="#last_name" className="cap">
                  last name
                </label>
                <span className="input-box-error-message">
                  {errors?.billingAddress?.lastName?.message}
                </span>
                <input
                  type="text"
                  id="last_name"
                  {...register("billingAddress.lastName")}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="#address" className="cap">
                Address
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.address?.message}
              </span>
              <input
                type="text"
                id="address"
                {...register("billingAddress.address")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#landmark" className="cap">
                landmark
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.landmark?.message}
              </span>
              <input
                type="text"
                id="landmark"
                {...register("billingAddress.landmark")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#city" className="cap">
                City
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.city?.message}
              </span>
              <input
                type="text"
                id="city"
                {...register("billingAddress.city")}
              />
            </div>
            <div className="form-group">
              <DropdownList>
                <label htmlFor="district" className="cap">
                  District
                </label>
                <span className="input-box-error-message">
                  {errors?.billingAddress?.district?.message}
                </span>
                <div className="dropdown-select">
                  <select
                    id="district"
                    {...register("billingAddress.district")}
                  >
                    <option value="">Select District</option>
                    {keralaDistricts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </DropdownList>
            </div>
            <div className="form-group">
              <DropdownList>
                <label htmlFor="state" className="cap">
                  State
                </label>
                <span className="input-box-error-message">
                  {errors?.billingAddress?.state?.message}
                </span>
                <div className="dropdown-select">
                  <select id="state" {...register("billingAddress.state")}>
                    <option value="">Select District</option>
                    {indianStates.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </DropdownList>
              <div className="form-group">
                <label htmlFor="#country" className="cap">
                  Country
                </label>
                <span className="input-box-error-message">
                  {errors?.billingAddress?.country?.message}
                </span>
                <input
                  type="text"
                  id="country"
                  {...register("billingAddress.country")}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="#pincode" className="cap">
                Pincode
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.pincode?.message}
              </span>
              <input
                type="text"
                id="pincode"
                {...register("billingAddress.pincode")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#phone_number" className="cap">
                Phone Number
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.phoneNumber?.message}
              </span>
              <input
                type="text"
                id="phone_number"
                {...register("billingAddress.phoneNumber")}
              />
            </div>
            <div className="form-group">
              <label htmlFor="#email" className="cap">
                Email
              </label>
              <span className="input-box-error-message">
                {errors?.billingAddress?.email?.message}
              </span>
              <input
                type="email"
                id="email"
                {...register("billingAddress.email")}
              />
            </div>
          </div>
        </div>
        <div className="placeorder-step1-proceed-btn">
          <button type="submit" className="btn btn-medium  ">
            continue to payment
          </button>
          <Link
            to={"/placeorder/step3"}
            className="placeorder-cancel-btn btn btn-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
};
export default PlaceOrderStepOne;

// useEffect(() => {
//   if (placeOrderData?.billing_address) {
//     const data: IOrderFormData = buildDefaultValues(
//       placeOrderData?.billing_address
//     );
//     Object.keys(data).forEach((key) => {
//       const typedKey = key as keyof IOrderFormData;
//       if (typedKey in data) {
//         setValue(typedKey, data[typedKey]);
//       }
//     });
//     console.log(getValues().district, getValues().state);
//   }
// }, [placeOrderData]);
