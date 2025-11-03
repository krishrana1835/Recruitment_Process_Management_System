import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteUser } from "@/api/Users_api";
import { useAuth } from "@/route_protection/AuthContext";
import { Card } from "../ui/card";
import { Atom } from "react-loading-indicators";
import { deleteCandidate } from "@/api/Candidate_api";
import { notify } from "./Notifications";
import { deleteJob } from "@/api/Job_api";

/**
 * A component that handles the deletion of different types of data based on the URL parameters.
 * It uses the `deleteapi` and `deleteid` parameters from the URL to determine what to delete.
 * @returns {JSX.Element} A loading indicator while the deletion is in progress.
 */
const DeleteHandler = () => {
  const { deleteapi, deleteid } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  /**
   * This effect handles the deletion logic when the component mounts or the URL parameters change.
   * It confirms the deletion with the user, calls the appropriate delete API, and then navigates away.
   */
  useEffect(() => {
    if (!user) {
      notify.error("Error","No user logged in");
      return;
    }

    if (!deleteapi || !deleteid) return;

    if (!user?.token) {
      notify.error("Error","Unauthorized");
      navigate("/login", { replace: true }); // Use replace to prevent back button from going to the delete page
      return;
    }

    const confirmAndDelete = async () => {
      const confirm = window.confirm(
        `Are you sure you want to delete this ${deleteid}?`
      );
      if (!confirm) {
        navigate("/", { replace: true }); // Prevent back to deletion
        return;
      }

      try {
        switch (deleteapi) {
          // Handle user deletion
          case "users-data":
            await deleteUser(deleteid, user.token);
            notify.success("Success","User deleted successfully");
            break;
          // Handle candidate deletion
          case "candidates-data":
            await deleteCandidate(deleteid, user.token);
            notify.success("Success","Candidate deleted successfully");
            break;
          // Handle company deletion (currently commented out)
          case "company":
            // await deleteCompany(deleteid, user.token);
            notify.success("Success","Company deleted successfully");
            break;
          case "jobs-data":
            await deleteJob(deleteid, user.token);
            notify.success("Success","Job deleted successfully");
            break;
          default:
            notify.error("Error",`Unknown delete type: ${deleteapi}`);
            navigate("/", { replace: true });
            return;
        }

        // Redirect and remove current route from history
        navigate(`/company/dashboard/${deleteapi.split("-")[0]}`, { replace: true });

      } catch (error: any) {
        notify.error("Error",`Failed to delete ${deleteapi}: ${error.message}`);
        navigate("/", { replace: true });
      }
    };

    confirmAndDelete();
  }, [deleteapi, deleteid, navigate, user]);

  return (
    <Card className="w-full h-full p-4 flex justify-center items-center">
      <Atom color="#000000" size="medium" text="Deleting..." />
    </Card>
  );
};

export default DeleteHandler;