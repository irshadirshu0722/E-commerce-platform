import React, { FC } from "react";

interface FormErrorProps {
  message: string;
}

const FormError: FC<FormErrorProps> = ({ message }) => {
  return (
    <p className="form-error-message" >
      <span className="material-symbols-outlined">error</span>{" "}
      <span className="error-text">{message}</span>
    </p>
  );
};

export default FormError;
