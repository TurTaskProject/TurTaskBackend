import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "src/hooks/AuthHooks";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
