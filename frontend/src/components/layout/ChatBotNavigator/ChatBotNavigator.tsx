import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./chatbotnavigator.css";
import { useStore } from "../../../context/store";
export default function ChatBotNavigator() {
  const navigate = useNavigate();
  const {userDetails} = useStore()
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { pathname } = useLocation();
  const { chatBotRef } = useStore();
  useEffect(() => {
    if (pathname.includes("user/chat/")) {
      setIsOpen(false);
    }
  }, [pathname]);
  return (
    <main
      className="chatbot-navigator-container"
      style={{ display: isOpen ? "block" : "none" }}
      ref={chatBotRef}
    >
      <div className="close-btn" onClick={() => setIsOpen(false)}>
        <span className="material-symbols-outlined">close</span>
      </div>
      <div
        className="navigating-container"
        onClick={() => navigate(`/user/chat/${userDetails.roomName}/`)}
      >
        Talk to Us{" "}
        <span className="material-symbols-outlined">support_agent</span>
      </div>
    </main>
  );
}
