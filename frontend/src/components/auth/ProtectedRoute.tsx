import { ReactNode, useEffect } from "react";
import { Route, Navigate } from "react-router-dom";
import { useStore } from "../../context/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isUser } = useStore();
  const isAllowed = isUser;
  return isAllowed ? <>{children}</> : <Navigate to="/signin" />;
};
