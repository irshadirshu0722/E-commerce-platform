import { ConfirmDialog } from "primereact/confirmdialog";
import React from "react";
import { Button } from "primereact/button";

interface IProps {
  visible: boolean;
  setVisible: Function;
  onConfirm: () => void;
}
export default function ConfirmationBox({
  setVisible,
  visible,
  onConfirm,
}: IProps) {
  const accept = () => {
    setVisible(false);
    onConfirm();
  };

  return (
    <>
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        header={
          <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            Confirmation
          </div>
        }
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={() => setVisible(false)}
        className="custom-confirm-dialog" // Add custom class for styling
        style={{
          width: "350px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9", // Example background color
          color: "#333", // Example text color
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Example box shadow
          padding: "2rem",
        }} // Add inline styles
        footer={
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "2rem",
                }}
              >
                warning
              </span>
              <span>Are you sure you want to proceed?</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "2rem",
                gap: "1rem",
              }}
            >
              <button
                className="btn"
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "none",
                  color: "var(--primary-blue",
                  borderRadius: "var(--borderRadiusSmall)",
                }}
                onClick={()=>setVisible(false)}
              >
                No
              </button>
              <button className="btn btn-small" onClick={accept}>Yes</button>
            </div>
          </div>
        }
      />
    </>
  );
}
