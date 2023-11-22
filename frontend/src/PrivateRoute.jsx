import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "src/hooks/AuthHooks";

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
