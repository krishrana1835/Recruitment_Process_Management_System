import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "./AuthContext";

/**
 * Props for the ProtectedRoute component.
 * @interface ProtectedRouteProps
 */
interface ProtectedRouteProps {
  children: React.ReactNode; // The child components to render if the route is accessible.
  requiredRole: UserRole[]; // An array of roles that are allowed to access this route.
}

/**
 * A component that protects routes based on user authentication and roles.
 * If the user is not authenticated, they are redirected to the login page.
 * If the user is authenticated but does not have a required role, they are redirected to an unauthorized page.
 * @param {ProtectedRouteProps} { children, requiredRole } - The props for the component.
 * @returns {React.ReactNode} The children components if authorized, or a Navigate component for redirection.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // If authentication state is still loading, render nothing or a loading indicator
  if (loading) {
    // You can return a spinner here if you want
    return null;
  }

  // If no user is authenticated or the user is not marked as authenticated, redirect to the home page (login)
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not included in the requiredRole array, redirect to the unauthorized page
  if (!requiredRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If all checks pass, render the children components
  return <>{children}</>;
};