import React from "react";
import "./servererror500.css";
export default function ServerError500() {
  return (
    <section className="server-error-section">
      <div className="page-404">
        <div className="outer">
          <div className="middle">
            <div className="inner">
              {/* <!--BEGIN CONTENT--> */}
              <div className="inner-circle">
                <i className="fa fa-cogs"></i>
                <span>500</span>
              </div>
              <span className="inner-status">Opps! Internal Server Error!</span>
              <span className="inner-detail">
                Unfortunately we're having trouble loading the page you are
                looking for. Please come back in a while.
              </span>
              {/* <!--END CONTENT--> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
