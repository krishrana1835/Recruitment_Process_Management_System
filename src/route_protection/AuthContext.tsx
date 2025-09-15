import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole =
  | "Recruiter"
  | "HR"
  | "Interviewer"
  | "Reviewer"
  | "Admin"
  | "Candidate"
  | "Viewer";

interface User {
  isAuthenticated: boolean;
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore user from sessionStorage
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
    setLoading(false); // Done loading
  }, []);

  // Sync user to sessionStorage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
