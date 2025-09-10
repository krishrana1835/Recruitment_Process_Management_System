import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a spinner here if you want
    return null;
  }

  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
