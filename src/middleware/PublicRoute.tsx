import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  redictTo?: string;
}

const PublicRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redictTo = "/home",
}) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={redictTo} replace />;
  }
  return children;
};

export default PublicRoute;
