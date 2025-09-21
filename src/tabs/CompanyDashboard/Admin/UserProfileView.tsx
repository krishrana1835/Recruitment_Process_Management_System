import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UserProfileDto } from "@/interfaces/User_interface";
import { Checkbox } from "@/components/ui/checkbox";
import { getUserProfile, updateUser } from "@/api/Users_api";
import { Atom } from "react-loading-indicators";
import { getRoles } from "@/api/Roles_api";
import type { RoleDto } from "@/interfaces/Roles_interface";
import { VscFeedback } from "react-icons/vsc";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { MdOutlineRateReview } from "react-icons/md";
import { MdOutlineCreate } from "react-icons/md";
import { useAuth } from "@/route_protection/AuthContext";
import { DataTable } from "@/components/custom/data-table";
import {
  candidateReviewColumns,
  interviewFeedbackColumns,
  jobColumns,
} from "@/components/custom/column";
import type { UserUpdateDto } from "@/interfaces/User_interface";

/**
 * UserProfile component displays and optionally allows updating a user's profile information.
 * It fetches user details, roles, and related data like interview feedbacks, candidate reviews, and created jobs.
 * @param {object} props - The component props.
 * @param {boolean} props.allowUpdate - A boolean indicating whether the user profile can be updated.
 */
const UserProfile = ({ allowUpdate }: { allowUpdate: boolean }) => {
  const { id } = useParams<{ id: string }>(); // Get user ID from URL parameters
  const [userData, setUserData] = useState<UserProfileDto | null>(null); // State for user profile data
  const [allRoles, setAllRoles] = useState<RoleDto[]>([]); // State for all available roles
  const [selectedRoles, setSelectedRoles] = useState<RoleDto[]>([]); // State for roles assigned to the user
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [tab, setTab] = useState<
    | "Interview Shedule"
    | "Interview Feedbacks"
    | "Candidate Reviews"
    | "Jobs Created"
  >("Interview Shedule"); // State for active tab in the profile view

  const { user } = useAuth(); // Get authenticated user details from AuthContext

  // Effect hook to fetch user profile data and roles when the component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Do nothing if no user ID is provided
      setError(null); // Clear any previous errors
      setLoading(true); // Set loading to true
      try {
        // Check for authenticated user
        if (!user) {
          setError("No user logged in");
          return;
        }
        // Check for user token
        if (!user?.token) {
          setError("No token found for the logged-in user.");
          return;
        }
        if (error) return; // If there's an existing error, prevent fetching

        // Fetch user profile and all roles concurrently
        const [userinfo, roles] = await Promise.all([
          getUserProfile(id, user.token),
          getRoles(),
        ]);
        setUserData(userinfo); // Set fetched user data
        if (userinfo.role) {
          setSelectedRoles(userinfo.role); // Set selected roles based on user data
        }
        setAllRoles(roles); // Set all available roles
      } catch (err: any) {
        setError(err.message || "Failed to fetch data."); // Handle errors during data fetching
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };
    fetchData(); // Call the data fetching function
  }, [id, user]); // Dependencies: user ID and authenticated user object

  /**
   * Handles the update of user data.
   * Constructs an updated user object and calls the API to persist changes.
   */
  const handleUpdate = async () => {
    if (!id || !userData) return; // Do nothing if no ID or user data is available
    setLoading(true); // Set loading to true during update
    setError(null); // Clear any previous errors
    try {
      // Ensure user and token are available for authentication
      if (!user || !user.token) {
        throw new Error("Authentication token not found.");
      }
      // Create a UserUpdateDto object with current user data
      const updatedUser: UserUpdateDto = {
        user_id: userData.user_id,
        name: userData.name,
        email: userData.email,
      };
      // Call the API to update the user with selected roles
      await updateUser(updatedUser, selectedRoles, user.token);
      alert("User updated successfully."); // Show success message
    } catch (err: any) {
      alert("Failed to update user."); // Show error message
      console.error(err); // Log the error
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Display loading indicator while data is being fetched or updated
  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  // Main component render
  return (
    <Card className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex items-center space-x-4">
            <img
              src="https://placehold.co/64x64/7c3aed/ffffff?text=A" // Placeholder for user avatar
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-black-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData?.name} {/* Display user's name */}
              </h1>
              <p className="text-gray-500">{userData?.email}</p> {/* Display user's email */}
            </div>
          </div>
        </header>

        {/* --- Profile Details Section --- */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Profile Details
          </h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={userData?.name || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  disabled={!allowUpdate} // Disable input if updates are not allowed
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={userData?.email || ""}
                  onChange={(e) =>
                    setUserData((prev) =>
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                  disabled // Disable input if updates are not allowed
                />
              </div>
              <div>
                <label
                  htmlFor="user_id"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  name="user_id"
                  id="user_id"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  value={userData?.user_id || ""}
                  disabled // Employee ID is typically not editable
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles
                </label>
                <div className="space-y-2 flex flex-row">
                  {allRoles.map((role) => (
                    <div
                      key={role.role_id}
                      className="flex items-center space-x-2 w-100"
                    >
                      <Checkbox
                        id={`role-${role.role_id}`}
                        checked={selectedRoles.some(
                          (r) => r.role_id === role.role_id
                        )}
                        onCheckedChange={(checked) => {
                          const isChecked = checked as boolean;
                          if (isChecked) {
                            setSelectedRoles((prev) => [...prev, role]); // Add role if checked
                          } else {
                            setSelectedRoles((prev) =>
                              prev.filter((r) => r.role_id !== role.role_id) // Remove role if unchecked
                            );
                          }
                        }}
                        className="cursor-pointer"
                        disabled={!allowUpdate} // Disable checkbox if updates are not allowed
                      />
                      <label
                        htmlFor={`role-${role.role_id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {role.role_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Created At
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  className="block w-full bg-white border-gray-300 rounded-md border text-gray-900 focus:ring-purple-500 focus:border-purple-500 sm:text-sm h-10 px-3"
                  defaultValue={new Date(
                    userData?.created_at || ""
                  ).toLocaleDateString()} // Display formatted creation date
                  disabled // Creation date is not editable
                />
              </div>
            </div>
            {allowUpdate && ( // Render save changes button only if updates are allowed
              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUpdate} // Attach update handler
                  className="bg-gray-500 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* --- Navigation Buttons --- */}
        <div className="mb-8">
          <nav
            className="flex space-x-2 transition-all: duration-300"
            aria-label="Navigation"
          >
            {/* Tab buttons for different sections of user data */}
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                tab == "Interview Shedule"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setTab("Interview Shedule")}
            >
              <RiCalendarScheduleLine className="size-6 mr-4" />
              Interview Shedule
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                tab == "Interview Feedbacks"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setTab("Interview Feedbacks")}
            >
              <VscFeedback className="size-6 mr-4" />
              Interview Feedbacks
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                tab == "Candidate Reviews"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setTab("Candidate Reviews")}
            >
              <MdOutlineRateReview className="size-6 mr-4" />
              Candidate Reviews
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ${
                tab == "Jobs Created"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setTab("Jobs Created");
              }}
            >
              <MdOutlineCreate className="size-6 mr-4" />
              Jobs Created
            </button>
          </nav>
        </div>

        {/* --- Connected Accounts Section --- */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{tab}</h2> {/* Display active tab title */}
          {tab === "Interview Feedbacks" && (
            <DataTable
              columns={interviewFeedbackColumns}
              data={userData?.interview_feedbacks || []} // Display interview feedbacks in a data table
            />
          )}
          {tab === "Candidate Reviews" && (
            <DataTable
              columns={candidateReviewColumns}
              data={userData?.candidate_reviews || []} // Display candidate reviews in a data table
            />
          )}
          {tab === "Jobs Created" && (
            <DataTable
              columns={jobColumns}
              data={userData?.jobs_created || []} // Display jobs created by the user in a data table
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
