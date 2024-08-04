import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface NoticeBoardProps {
  children: ReactNode;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.3rem",
        backgroundColor: "#f2f2f2",
        padding: "10px",
        borderRadius: "5px",
        border: "2px solid #fac72e",
        marginTop: "1rem",
      }}
    >
      <FontAwesomeIcon
        style={{
          fontSize: "1.2em",
          color: "black",
          alignSelf: "start",
          marginTop: "0.4rem",
        }}
        icon={faTriangleExclamation}
      />

      {/* <span className="material-symbols-outlined">warning</span> */}
      <p
        style={{
          margin: "0",
          fontSize: "0.9em",
          lineHeight: "1.4em",
        }}
      >
        {children}
      </p>
    </div>
  );
};

export default NoticeBoard;
