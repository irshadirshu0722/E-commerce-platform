import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
const styles = {
  padding: "0.5rem",
  fontSize: "0.8rem",
  backgroundColor: "var(--grey-250)",
  borderRadius: "50%",
  cursor: "pointer",
};
interface Props {
  onChange: Function;
  quantity: number;
  id?: number;
}
export const QuantityController: React.FC<Props> = ({
  onChange,
  quantity,
  id,
}) => {
  return (
    <div
      className="item-quantity-controller"
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <span
        className="cart-item-quantity-minus"
        style={styles}
        onClick={() => onChange("minise", id, quantity - 1)}
      >
        <FontAwesomeIcon icon={faMinus} />
      </span>
      <input
        style={{
          width: `${quantity.toString().length * 10}px`,
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          textAlign: "center",
        }}
        onChange={(e) => onChange("change", id, parseInt(e.target.value))}
        value={quantity}
      />
      <span
        className="cart-item-quantity-add"
        style={styles}
        onClick={() => onChange("add", id, quantity + 1)}
      >
        <FontAwesomeIcon icon={faPlus} />
      </span>
    </div>
  );
};
