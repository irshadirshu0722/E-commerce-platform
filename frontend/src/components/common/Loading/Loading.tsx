import React from "react";
import "./loading.css";
export default function Loading() {
  return (
    <div className="loading-container ">
      <div className="section-center loading-center">
        <div className="loading-group">
          <span className="loading-1 loading"></span>
          <span className="loading-2 loading"></span>
        </div>
      </div>
    </div>
  );
}
