import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = 
  | "Recruiter" 
  | "HR" 
  | "Interviewer" 
  | "Reviewer" 
  | "Admin" 
  | "Candidate" 
  | "Viewer";

interface AuthContextType {
  user: {
    isAuthenticated: boolean;
    token: string;
    userId: number;
    email: string;
    role: UserRole;
  } | null;
  setUser: React.Dispatch<React.SetStateAction<AuthContextType["user"]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  // Restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.isAuthenticated) {
          setUser(parsed);
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
