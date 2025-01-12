import React from "react";
import { Link } from "react-router-dom";

export default function BadRequest400() {
  return (
    <section
      className="bad-request-error-page-section"
      style={{ minHeight: "45vh", display: "grid", placeItems: "center" }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "30rem" }}>
          <div
            style={{
              boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
              borderRadius: ".5rem",
              marginTop: "5rem",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <h3
              style={{
                fontSize: "6rem",
                color: "#6c757d",
              }}
            >
              400
            </h3>
            <span
              style={{
                display: "block",
                marginBottom: "2rem",
                color: "#6c757d",
              }}
            >
              Bad Request
            </span>
            <div style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Link
                to={"/"}
                style={{
                  display: "inline-block",
                  padding: ".375rem .75rem",
                  fontSize: "1rem",
                  lineHeight: "1.5",
                  color: "#fff",
                  backgroundColor: "#17a2b8",
                  borderColor: "#17a2b8",
                  borderRadius: ".25rem",
                  textDecoration: "none",
                }}
              >
                Back To Home
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-medium btn-grey"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
