import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole: string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};