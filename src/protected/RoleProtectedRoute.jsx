import { Navigate, useLocation } from "react-router-dom";
import { ROUTE_PERMISSIONS } from "../config/permissions";

function RoleProtectedRoute({ children }) {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const userRole = user?.role;

  const allowedRoles = ROUTE_PERMISSIONS[location.pathname];

  // Route not configured = allow access
  if (!allowedRoles) {
    return children;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
