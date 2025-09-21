import { useNavigate } from 'react-router-dom';

/**
 * Unauthorized component displayed when a user tries to access a route without the necessary permissions.
 * Provides a message indicating lack of authorization and a button to navigate back to the login page.
 */
export default function Unauthorized () {
  const navigate = useNavigate(); // Hook to programmatically navigate

  /**
   * Handles the click event for the "Back to Login" button.
   * Redirects the user to the root path, which is typically the login page.
   */
  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403 - Unauthorized</h1> {/* Unauthorized status code and message */}
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <button
        onClick={handleBackToLogin} // Attach click handler to the button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition" // Styling for the button
      >
        Back to Login
      </button>
    </div>
  );
};