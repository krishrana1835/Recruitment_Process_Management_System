import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";

/**
 * Logout component handles the user logout process.
 * It clears session storage, calls the logout function from AuthContext, and redirects to the login page.
 */
const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming AuthContext provides a logout function

  // useEffect hook to perform logout actions on component mount
  useEffect(() => {
    // Clear all items from session storage
    sessionStorage.clear();
    // Call the logout function from AuthContext to clear any in-memory authentication state
    logout();
    // Redirect the user to the login page after logging out
    navigate('/login');
  }, [navigate, logout]); // Dependencies: navigate and logout functions

  // Render a loading indicator while the logout process is happening
  return (
    <Card className="w-full h-full p-4 flex justify-center items-center">
      <Atom
        color="#000000"
        size="medium"
        text="Logging out..."
        textColor=""
      />
    </Card>
  );
};

export default Logout;