import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  redictTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redictTo = "/sign-in",
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={redictTo} replace />;
  }
  return children;
};

export default ProtectedRoute;
