import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
export default PublicRoute;
