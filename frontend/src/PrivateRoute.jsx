import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import IsAuthenticated from "./hooks/authentication/IsAuthenticated";

const PrivateRoute = () => {
  const auth = IsAuthenticated();
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
