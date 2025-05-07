import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false, kitchenOnly = false }) {
  const { user } = useAuth();

  // If user is NOT logged in → Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If Admin-only route but user is NOT an Admin → Redirect
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If Kitchen Staff-only route but user is NOT Kitchen Staff → Redirect
  if (kitchenOnly && user.role !== "kitchen") {
    return <Navigate to="/dashboard" replace />;
  }

  // Allow access to the route
  return children;
}
