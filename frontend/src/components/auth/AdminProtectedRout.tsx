import { ReactNode, useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { useStore } from "../../context/store";
import useApiCall from "../../hooks/useApiCall";
import { ADMIN_VERIFY } from "../../config/backendApi";
import Loading from "../common/Loading/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isUser,authToken } = useStore();
    const { makeApiCall, loading, reload,isDataFetched } = useApiCall();
    const [isAdmin,setIsAdmin] = useState<boolean>(false)
    useEffect(() => {
      VerifyAdmin();
    }, []);
    const VerifyAdmin = async () => {
      try {
        const url = ADMIN_VERIFY;
        const { ok, response } = await makeApiCall(
          url,
          "get",
          {},
          true,
          authToken,
          true
        );
        if (ok) {
          setIsAdmin(true)
        }
      } catch {
        return <></>
      }
    };
  if(loading){
    return <Loading/>
  }else if(isDataFetched && isAdmin){
    return <>{children}</>
  }else{
    return <Loading/>
  }
  
};
