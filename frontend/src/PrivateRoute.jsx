import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./hooks/authentication/IsAuthenticated";

const PrivateRoute = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const auth = isAuthenticated;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;