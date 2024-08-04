import "./address.css";

// ============
import React, { useEffect, useState } from "react";

import FormControlLabel from "@mui/material/FormControlLabel";

// ===================utils===============
import { indianStates, keralaDistricts } from "../../../utils/state_district";

// ===================common component===================
import LoadingButton from "../../../components/common/LoadingButton";
import AccountBackNavigation from "../../../components/common/AccountBackNavigation/AccountBackNavigation";
import { ToggleSwitch } from "../../../components/common/ToggleIOSSwitchStyleConfig";

// ======================schema==========================

import { schema } from "../../../schemas/accountAddressSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ====================== Hooks and config ==========================

import useApiCall from "../../../hooks/useApiCall";
import { ACCOUNT_ADDRESS } from "../../../config/backendApi";

// context and interface
import { useStore } from "../../../context/store";
import { useNavigate } from "react-router-dom";
import { IAddress, initAddress } from "../../../interfaces/IAccount";
import { popupMessage } from "../../../utils/popupMessage";
import Loading from "../../../components/common/Loading/Loading";
import { DropdownList } from "../../../components/common/DropDownList/DropDownList";

interface IbuttonLoading {
  shipping: boolean;
  billing: boolean;
}
export default function AccountAddress() {
  const { loading, makeApiCall, reload } = useApiCall();
  const { authToken } = useStore();
  const [shippingAddress, setShippingAddress] = useState<IAddress>(initAddress);
  const [billingAddress, setBillingAddress] = useState<IAddress>(initAddress);
  const [openShippingAddress, setOpenShippingAddress] =
    useState<boolean>(false);
  const [openBillingAddress, setOpenBillingAddress] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const url = ACCOUNT_ADDRESS;
      const { response, ok } = await makeApiCall(
        url,
        "get",
        {},
        true,
        authToken,
        true
      );
      if (ok) {
        const data: {
          shipping_address: IAddress;
          billing_address: IAddress;
        } = response?.data;
        if (data.shipping_address) {
          setShippingAddress(data.shipping_address);
        }
        if (data.billing_address) {
          setBillingAddress(data.billing_address);
        }
      } else {
        navigate("/account/");
      }
    } catch {}
  };
  const [buttonLoading, setButtonLoading] = useState<IbuttonLoading>({
    shipping: false,
    billing: false,
  });
  // -----start of useForm Validation setup-----
  const {
    register: billingRegister,
    handleSubmit: billingHandleSubmit,
    formState: { errors: billingErrors },
  } = useForm({
    resolver: yupResolver(schema),
    values: billingAddress,
  });
  const {
    register: shippingRegister,
    handleSubmit: shippingHandleSubmit,
    formState: { errors: shippingErrors },
  } = useForm({
    resolver: yupResolver(schema),
    values: shippingAddress,
  });

  // ---- end of useForm Validation setup-------
  const ChangeAddress = async (address: IAddress, is_shipping: boolean) => {
    is_shipping
      ? setButtonLoading({ ...buttonLoading, shipping: true })
      : setButtonLoading({ ...buttonLoading, billing: true });
    try {
      const url = ACCOUNT_ADDRESS;
      let data: { type: string; address: IAddress };
      if (is_shipping) {
        data = {
          type: "shipping",
          address: address,
        };
      } else {
        data = {
          type: "billing",
          address: address,
        };
      }
      console.log(data)
      const { response, ok } = await makeApiCall(
        url,
        "put",
        data,
        true,
        authToken,
        false
      );
      is_shipping
        ? setButtonLoading({ ...buttonLoading, shipping: false })
        : setButtonLoading({ ...buttonLoading, billing: false });
      if (ok) {
        const data: {
          shipping_address: IAddress;
          billing_address: IAddress;
        } = response?.data;
        if (is_shipping && data.shipping_address) {
          setShippingAddress(data.shipping_address);
          popupMessage(false, "Shipping address changed");
        } else if (!is_shipping && data.billing_address) {
          setBillingAddress(data.billing_address);
          popupMessage(false, "Billing address changed");
        }
      } else {
      }
    } catch {}
  };
  function onShippingSubmit(data: IAddress) {
    ChangeAddress(data, true);
  }
  function onBillingSubmit(data: IAddress) {
    ChangeAddress(data, false);
  }
  const onShippingToggle = () => {
    setOpenShippingAddress(!openShippingAddress);
  };
  if (loading && reload) {
    return <Loading />;
  }

  return (
    <>
      <section className="account-address">
        <div className="section-center account-address-center">
          <AccountBackNavigation heading={"Address"} />
          <div className="account-address-shipping">
            <div className="section-sub-heading cap">
              <h3 className="cap">Shipping Address</h3>
            </div>
            <div className="account-shipping-address-toggle">
              <h5>Edit shipping address</h5>
              <FormControlLabel
                label={""}
                control={
                  <ToggleSwitch
                    onChange={onShippingToggle}
                    sx={{ m: 1 }}
                    checked={openShippingAddress}
                  />
                }
              />
            </div>
            <div
              className={`shipping-address-form ${
                openShippingAddress && "show-shipping-address-form"
              }`}
            >
              <form action="" onSubmit={shippingHandleSubmit(onShippingSubmit)}>
                <div className="form-sub-group">
                  <div className="form-group">
                    <label htmlFor="#first_name" className="cap">
                      first name
                    </label>
                    <span className="input-box-error-message">
                      {shippingErrors?.firstName?.message}
                    </span>
                    <input
                      type="text"
                      id="first_name"
                      {...shippingRegister("firstName")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="#last_name" className="cap">
                      last name
                    </label>
                    <span className="input-box-error-message">
                      {shippingErrors?.lastName?.message}
                    </span>
                    <input
                      type="text"
                      id="last_name"
                      {...shippingRegister("lastName")}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="#address" className="cap">
                    Address
                  </label>
                  <span className="input-box-error-message">
                    {shippingErrors?.address?.message}
                  </span>
                  <input
                    type="text"
                    id="address"
                    {...shippingRegister("address")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="#landmark" className="cap">
                    landmark
                  </label>
                  <span className="input-box-error-message">
                    {shippingErrors?.landmark?.message}
                  </span>
                  <input
                    type="text"
                    id="landmark"
                    {...shippingRegister("landmark")}
                  />
                </div>
                <div className="form-sub-group">
                  <div className="form-group">
                    <label htmlFor="#city" className="cap">
                      City
                    </label>
                    <span className="input-box-error-message">
                      {shippingErrors?.city?.message}
                    </span>
                    <input
                      type="text"
                      id="city"
                      {...shippingRegister("city")}
                    />
                  </div>
                  <div className="form-group">
                    <DropdownList>
                      <label htmlFor="district" className="cap">
                        District
                      </label>
                      <span className="input-box-error-message">
                        {shippingErrors?.district?.message}
                      </span>
                      <div className="dropdown-select">
                        <select id="district" {...shippingRegister("district")}>
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
                </div>
                <div className="form-sub-group">
                  <div className="form-group">
                    <DropdownList>
                      <label htmlFor="state" className="cap">
                        State
                      </label>
                      <span className="input-box-error-message">
                        {shippingErrors?.state?.message}
                      </span>
                      <div className="dropdown-select">
                        <select id="state" {...shippingRegister("state")}>
                          <option value="">Select District</option>
                          {indianStates.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </DropdownList>
                  </div>
                  <div className="form-group">
                    <label htmlFor="#country" className="cap">
                      Country
                    </label>
                    <span className="input-box-error-message">
                      {shippingErrors?.country?.message}
                    </span>
                    <input
                      type="text"
                      id="country"
                      value={"india"}
                      {...shippingRegister("country")}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="#pincode" className="cap">
                    Pincode
                  </label>
                  <span className="input-box-error-message">
                    {shippingErrors?.pincode?.message}
                  </span>
                  <input
                    type="text"
                    id="pincode"
                    {...shippingRegister("pincode")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="#phone_number" className="cap">
                    Phone Number
                  </label>
                  <span className="input-box-error-message">
                    {shippingErrors?.phoneNumber?.message}
                  </span>
                  <input
                    type="text"
                    id="phone_number"
                    {...shippingRegister("phoneNumber")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="#email" className="cap">
                    Email
                  </label>
                  <span className="input-box-error-message">
                    {shippingErrors?.email?.message}
                  </span>
                  <input
                    type="email"
                    id="email"
                    {...shippingRegister("email")}
                  />
                </div>
                <div className="account-address-save-btn ">
                  <LoadingButton
                    type={"submit"}
                    className={"cap btn btn-medium"}
                    isLoading={buttonLoading.shipping && loading}
                  >
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>

          <div className="account-address-billing">
            <div className="section-sub-heading cap">
              <h3 className="cap">Billing Address</h3>
            </div>
            <div className="account-billing-address-toggle">
              <h5>Edit shipping address</h5>
              <FormControlLabel
                label={""}
                control={
                  <ToggleSwitch
                    onChange={() => setOpenBillingAddress((prev) => !prev)}
                    sx={{ m: 1 }}
                    checked={openBillingAddress}
                  />
                }
              />
            </div>
            <div
              className={`billing-address-form ${
                openBillingAddress && "show-billing-address-form"
              } `}
            >
              <form action="" onSubmit={billingHandleSubmit(onBillingSubmit)}>
                <div className="form-sub-group">
                  <div className="form-group">
                    <label htmlFor="#first_name" className="cap">
                      first name
                    </label>
                    <span className="input-box-error-message">
                      {billingErrors?.firstName?.message}
                    </span>
                    <input
                      type="text"
                      id="first_name"
                      {...billingRegister("firstName")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="#last_name" className="cap">
                      last name
                    </label>
                    <span className="input-box-error-message">
                      {billingErrors?.lastName?.message}
                    </span>
                    <input
                      type="text"
                      id="last_name"
                      {...billingRegister("lastName")}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="#address" className="cap">
                    Address
                  </label>
                  <span className="input-box-error-message">
                    {billingErrors?.address?.message}
                  </span>
                  <input
                    type="text"
                    id="address"
                    {...billingRegister("address")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="#landmark" className="cap">
                    landmark
                  </label>
                  <span className="input-box-error-message">
                    {billingErrors?.landmark?.message}
                  </span>
                  <input
                    type="text"
                    id="landmark"
                    {...billingRegister("landmark")}
                  />
                </div>
                <div className="form-sub-group">
                  <div className="form-group">
                    <label htmlFor="#city" className="cap">
                      City
                    </label>
                    <span className="input-box-error-message">
                      {billingErrors?.city?.message}
                    </span>
                    <input type="text" id="city" {...billingRegister("city")} />
                  </div>
                  <div className="form-group">
                    <DropdownList>
                      <label htmlFor="district" className="cap">
                        District
                      </label>
                      <span className="input-box-error-message">
                        {billingErrors?.district?.message}
                      </span>
                      <div className="dropdown-select">
                        <select id="district" {...billingRegister("district")}>
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
                </div>
                <div className="form-sub-group">
                  <div className="form-group">
                    <span className="input-box-error-message">
                      {billingErrors?.state?.message}
                    </span>
                    <DropdownList>
                      <label htmlFor="state" className="cap">
                        State
                      </label>
                      <span className="input-box-error-message">
                        {billingErrors?.state?.message}
                      </span>
                      <div className="dropdown-select">
                        <select id="state" {...billingRegister("state")}>
                          <option value="">Select District</option>
                          {indianStates.map((state, index) => (
                            <option key={index} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </DropdownList>
                  </div>
                  <div className="form-group">
                    <label htmlFor="#country" className="cap">
                      Country
                    </label>
                    <span className="input-box-error-message">
                      {billingErrors?.country?.message}
                    </span>
                    <input
                      type="text"
                      id="country"
                      value={"india"}
                      {...billingRegister("country")}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="#pincode" className="cap">
                    Pincode
                  </label>
                  <span className="input-box-error-message">
                    {billingErrors?.pincode?.message}
                  </span>
                  <input
                    type="text"
                    id="pincode"
                    {...billingRegister("pincode")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="#phone_number" className="cap">
                    Phone Number
                  </label>
                  <span className="input-box-error-message">
                    {billingErrors?.phoneNumber?.message}
                  </span>
                  <input
                    type="text"
                    id="phone_number"
                    {...billingRegister("phoneNumber")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="#email" className="cap">
                    Email
                  </label>
                  <span className="input-box-error-message">
                    {billingErrors?.email?.message}
                  </span>
                  <input
                    type="email"
                    id="email"
                    {...billingRegister("email")}
                  />
                </div>
                <div className="account-address-save-btn ">
                  <LoadingButton
                    type={"submit"}
                    className={"cap btn btn-medium"}
                    isLoading={buttonLoading.billing && loading}
                  >
                    Save Changes
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
