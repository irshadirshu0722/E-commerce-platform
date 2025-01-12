import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { StepSlider } from "../../components/common/StepSlider";
import {
  IPlaceOrderData,
  IOrderDetails,
  initOrderDetails,
  initPlaceOrderData,
} from "../../interfaces/IPlaceOrder";
import Loading from "../../components/common/Loading/Loading";

// component
import PlaceOrderStepOne from "../PlaceOrderStepOne/PlaceOrderStepOne";
import PlaceOrderStepThree from "../PlaceOrderStepThree/PlaceOrderStepThree";
import PlaceOrderStepTwo from "../PlaceOrderStepTwo/PlaceOrderStepTwo";
interface IstepHeadings {
  1: string;
  2: string;
  3: string;
}

export function PlaceOrder() {
  const location = useLocation();
  const [placeOrderData, setPlaceOrderData] =
    useState<IPlaceOrderData>(initPlaceOrderData);
  const [orderDetails, setOrderDetails] =
    useState<IOrderDetails>(initOrderDetails);
  const [loading, setLoading] = useState<boolean>(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [isShippingAddress, setIsShippingAddress] = useState<boolean>(false);
  useEffect(() => {
    
    fetchData();
    return () => {      
      sessionStorage.removeItem("isPlaceOrder");
    };
  }, []);
  const fetchData = async () => {
    try {
      const res = await checkIsPlaceOrder();
      if (!res) {
        window.history.back();
        return;
      }else{
        const data: {
          placeOrderData: IPlaceOrderData;
          orderDetails: IOrderDetails;
        } = location.state;
        setPlaceOrderData(data.placeOrderData);
        setOrderDetails(data.orderDetails);
        setLoading(false);
      }
    } catch {
      navigate("/error/403/");
    }
  };
  function checkIsPlaceOrder() {
    console.log("11");
    const isPlaceOrder = sessionStorage.getItem("isPlaceOrder");
    if (isPlaceOrder) {
      const isPlaceOrderParsed = JSON.parse(isPlaceOrder);
      if (isPlaceOrderParsed) {
        return true
      }
    }
    
    return false
  }
  const handleStep = (step: number) => {
    setStep(step);
  };
  const stepHeadings: { [key: number]: string } = {
    1: "Billing & Shipping Address",
    2: "Payment",
    3: "Review",
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  if (loading) {
    return <Loading />;
  }
  return (
    <section className="placeorder-section">
      <div className="placeorder-center section-center">
        <div className="section-heading cap" style={{ textAlign: "center" }}>
          <h1>PlaceOrder</h1>
        </div>
        <StepSlider
          totalStep={3}
          currentStep={step}
          stepHeading={stepHeadings[step]}
        />
        {step === 1 && (
          <PlaceOrderStepOne
            handleStep={handleStep}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            placeOrderData={placeOrderData}
            setPlaceOrderData={setPlaceOrderData}
            isShippingAddress={isShippingAddress}
            setIsShippingAddress={setIsShippingAddress}
          />
        )}
        {step === 2 && (
          <PlaceOrderStepTwo
            handleStep={handleStep}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            placeOrderData={placeOrderData}
          />
        )}
        {step === 3 && (
          <PlaceOrderStepThree
            handleStep={handleStep}
            orderDetails={orderDetails}
            placeOrderData={placeOrderData}
            isShippingAddress={isShippingAddress}
          />
        )}
      </div>
    </section>
  );
}
