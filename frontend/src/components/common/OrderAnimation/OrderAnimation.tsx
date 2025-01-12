import React from "react";
import "./orderanimation.css";

export default function OrderAnimation() {
  return (
    <div className="order-placing-animation">
      {" "}
      {/* Changed class to className */}
      <div className="main">
        {" "}
        {/* Changed class to className */}
        <div className="road">
          {" "}
          {/* Changed class to className */}
          <ul>
            {[...Array(11)].map(
              (
                _,
                index // Changed to use Array constructor and map to create 11 li elements
              ) => (
                <li key={index}></li>
              )
            )}
          </ul>
          <div className="bus">
            {" "}
            {/* Changed class to className */}
            <div className="back">
              {" "}
              {/* Changed class to className */}
              <div className="back1door"></div>
              <div className="back2door"></div>
              <div className="join"></div>
            </div>
            <div className="front">
              {" "}
              {/* Changed class to className */}
              <div className="black"></div>
              <div className="light1"></div>
              <div className="light2"></div>
            </div>
          </div>
          <div className="gift"></div> {/* Changed class to className */}
        </div>
      </div>
    </div>
  );
}
