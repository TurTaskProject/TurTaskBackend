import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "src/hooks/AuthHooks";

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/d" /> : <Outlet />;
};

export default PublicRoute;
