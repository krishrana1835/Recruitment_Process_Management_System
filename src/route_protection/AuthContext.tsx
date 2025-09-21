import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Defines the possible roles a user can have in the system.
 */
export type UserRole =
  | "Recruiter"
  | "HR"
  | "Interviewer"
  | "Reviewer"
  | "Admin"
  | "Candidate"
  | "Viewer";

/**
 * Represents the structure of an authenticated user.
 */
interface User {
  isAuthenticated: boolean; // Indicates if the user is authenticated
  token: string; // Authentication token for API requests
  userId: number; // Unique identifier for the user
  email: string; // User's email address
  role: UserRole; // The role of the user
}

/**
 * Defines the shape of the authentication context.
 */
interface AuthContextType {
  user: User | null; // The authenticated user object, or null if not authenticated
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Function to set the user object
  loading: boolean; // Indicates if the authentication state is currently being loaded
  logout: () => void; // Function to log out the user
}

// Create the AuthContext with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides authentication context to its children components.
 * It manages user login state, stores user data in session storage, and provides a logout function.
 * @param {React.ReactNode} children - The child components to be rendered within the provider.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to restore user from sessionStorage on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.isAuthenticated) {
          setUser(parsed);
        }
      } catch (e) {
        console.error("Error parsing user from sessionStorage:", e);
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false); // Set loading to false once user state is determined
  }, []);

  // Effect to sync user state to sessionStorage whenever it changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  /**
   * Logs out the current user by clearing the user state and removing user data from session storage.
   */
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 * @returns {AuthContextType} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};