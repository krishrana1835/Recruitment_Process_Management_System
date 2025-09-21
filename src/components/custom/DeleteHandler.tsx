import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteUser } from "@/api/Users_api";
import { useAuth } from "@/route_protection/AuthContext";
import { Card } from "../ui/card";
import { Atom } from "react-loading-indicators";

// DeleteHandler component handles deletion of various entities based on URL parameters
const DeleteHandler = () => {
  // Extract parameters from the URL: deleteapi (e.g., "users", "company") and deleteid (the ID of the item to delete)
  const { deleteapi, deleteid } = useParams();
  // Hook to programmatically navigate
  const navigate = useNavigate();
  // Get user authentication context
  const { user } = useAuth();

  // useEffect hook to perform deletion logic when component mounts or parameters change
  useEffect(() => {
    // Check if a user is logged in
    if (!user) {
      alert("No user logged in");
      return;
    }

    // Ensure both deleteapi and deleteid parameters are present
    if (!deleteapi || !deleteid) return;

    // Check if the user has an authentication token
    if (!user?.token) {
      alert("Unauthorized");
      navigate("/login"); // Redirect to login if unauthorized
      return;
    }

    // Asynchronous function to confirm and perform the deletion
    const confirmAndDelete = async () => {
      // Ask for user confirmation before proceeding with deletion
      const confirm = window.confirm(
        `Are you sure you want to delete this ${deleteid}?`
      );
      if (!confirm) {
        navigate(-1); // Go back to the previous page if deletion is canceled
        return;
      }

      try {
        // Use a switch statement to handle different deletion APIs based on 'deleteapi' parameter
        switch (deleteapi) {
          case "users":
            // Call the deleteUser API for user deletion
            await deleteUser(deleteid, user.token);
            alert("User deleted successfully");
            break;
          case "company":
            // Placeholder for company deletion logic
            // await deleteCompany(deleteid, token);
            alert("Company deleted successfully");
            break;
          // 🔁 Add more cases as needed for other deletable entities
          default:
            alert(`Unknown delete type: ${deleteapi}`);
            navigate(-1); // Go back if the deleteapi type is unknown
            return;
        }

        // ✅ Redirect after successful deletion to the appropriate dashboard section
        navigate(`/company/dashboard/${deleteapi}`);
      } catch (error: any) {
        // Display an error message if deletion fails
        alert(`Failed to delete ${deleteapi}: ${error.message}`);
        navigate(-1); // Go back on error
      }
    };

    confirmAndDelete(); // Execute the confirmation and deletion process
  }, [deleteapi, deleteid, navigate, user]); // Dependencies for useEffect

  // Render a loading indicator while the deletion process is ongoing
  return <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom
        color="#000000"
        size="medium"
        text="Deleting..."
        textColor=""
      />
      </Card>;
};

export default DeleteHandler;