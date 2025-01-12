import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { QuantityController } from "./QuantityController";
import { IReturnItems } from "../../interfaces/ISingleorder";
interface ReturnOrderQuantityControllerProps {
  id: number;
  onReturnItemSelected: (checked: boolean, order_item_id: number) => void;
  returnItems: IReturnItems[];
  onReturnQuantityChange: (type: string, id: number, value: number) => void;
}

const styles = {
  padding: "0.5rem",
  fontSize: "0.8rem",
  backgroundColor: "var(--grey-250)",
  borderRadius: "50%",
  cursor: "pointer",
};

const ReturnOrderQuantityController: React.FC<
  ReturnOrderQuantityControllerProps
> = ({ id, onReturnItemSelected, returnItems, onReturnQuantityChange }) => {
  const [isOpenCounter, setIsCounter] = useState<boolean>(false);

  function onchange() {
    setIsCounter(!isOpenCounter);
    onReturnItemSelected(!isOpenCounter, id);
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        type="checkbox"
        onChange={onchange}
        style={{ cursor: "pointer", width: "1rem", height: "1rem" }}
      />
      <div style={{ display: isOpenCounter ? "block" : "none" }}>
        <QuantityController
          onChange={onReturnQuantityChange}
          quantity={
            (
              returnItems.find((item) => item.order_item_id === id) || {
                return_quantity: 0,
              }
            ).return_quantity
          }
          id={id}
        />
      </div>
    </div>
  );
};

export default ReturnOrderQuantityController;
