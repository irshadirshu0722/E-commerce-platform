import React, { useEffect } from "react";
import { useStore } from "../../../context/store";
import { Outlet, useNavigate } from "react-router-dom";
import "./adminPanel.css";
import useApiCall from "../../../hooks/useApiCall";
import { ADMIN_VERIFY } from "../../../config/backendApi";
import { AdminNavBar } from "../../../components/layout/AdminNavBar/AdminNavBar";
export default function AdminPanel() {
  const { navBarRef, footerRef, chatBotRef } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    const navbar = navBarRef.current;
    const footer = footerRef.current;
    const chatbot = chatBotRef.current;
    if (navbar) {
      navbar.style.display = "none";
    }
    if (footer) {
      footer.style.display = "none";
    }
    if (chatbot) {
      chatbot.style.display = "none";
    }
    return () => {
      if (navbar) {
        navbar.style.display = "flex";
      }
      if (footer) {
        footer.style.display = "flex";
      }
      if (chatbot) {
        chatbot.style.display = "flex";
      }
    };
  }, []);

  return (
    <main className="admin-panel-main">
      <AdminNavBar />
      <Outlet />
    </main>
  );
}
