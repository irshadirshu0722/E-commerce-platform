import React, { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { json } from "stream/consumers";
import Loading from "../common/Loading/Loading";
import { useStore } from "../../context/store";

interface IProps {
  children: ReactNode;
}

const ErrorPageWithBack = ({ children }: IProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const backUrl = params.get("back_url") || "/";
  const [loading, setLoading] = useState<boolean>(true);
  function setIsErrorPage(payload:string){
    sessionStorage.setItem('isErrorPage','false')
  }
  useEffect(() => {
    const isErrorPage = Boolean(sessionStorage.getItem("isErrorPage"));
    if (isErrorPage) {
      const stored_url = sessionStorage.getItem("backUrl");
      if (stored_url) {
        sessionStorage.removeItem("isErrorPage");
        sessionStorage.removeItem("backUrl");
        setLoading(false);
        navigate(stored_url);
        return;
      } else {
        sessionStorage.setItem("backUrl", backUrl);
        setLoading(false);
      }
    } else {
        setLoading(false);
        window.history.back();
        console.log('going back to ')
    }
    return () => {
      sessionStorage.removeItem("backUrl");
      sessionStorage.removeItem("isErrorPage");
    };
  }, [backUrl]);

  if (loading) {
    return <Loading />;
  }
  return <>{children}</>;
};

export default ErrorPageWithBack;
