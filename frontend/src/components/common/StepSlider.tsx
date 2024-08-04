import React from "react";

interface StepSliderProps {
  totalStep: number;
  currentStep: number;
  stepHeading: string;
}

export const StepSlider: React.FC<StepSliderProps> = ({
  totalStep,
  currentStep,
  stepHeading,
}) => {
  return (
    <div
      className="step-slider"
      style={{
        marginBottom: "2rem",
        position: "sticky",
        boxShadow: "var(--shadow-2)",
        zIndex: 10,
        top: "65px",
        width: "100%",
        backgroundColor: "#f9f8fd",
        padding: "1rem",
      }}
    >
      <h4
        className="section-sub-heading mb-0"
        style={{ paddingBottom: "1rem" }}
      >
        Step {currentStep} of {totalStep} : {stepHeading}
      </h4>
      <div
        className="rating-slider-outer"
        style={{
          height: "8px",
          backgroundColor: "var(--grey-200)",
          borderRadius: "var(--borderRadiusMedium)",
          position: "relative",
        }}
      >
        <div
          className="rating-slider-inner"
          style={{
            position: "absolute",
            height: "100%",
            backgroundColor: "var(--primary-blue)",
            borderRadius: "var(--borderRadiusMedium)",
            width: `${(100 / totalStep) * currentStep}%`,
            transition: "var(--transition)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default StepSlider;
