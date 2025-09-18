import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { UserProfileDto } from "@/interfaces/User_interface";
import { Checkbox } from "@/components/ui/checkbox";
import { getUserProfile } from "@/api/Users_api";
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
  jobsColumns as jobColumns,
} from "@/components/custom/column";

// --- Main Profile Component ---
const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserProfileDto | null>(null);
  const [allRoles, setAllRoles] = useState<RoleDto[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<RoleDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<
    | "Interview Shedule"
    | "Interview Feedbacks"
    | "Candidate Reviews"
    | "Jobs Created"
  >("Interview Shedule");

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setError(null);
      setLoading(true);
      try {
        if (!user) {
          setError("No user logged in");
          return;
        }
        if (!user?.token) {
          setError("No token found for the logged-in user.");
          return;
        }
        if (error) return;

        const [userinfo, roles] = await Promise.all([
          getUserProfile(id, user.token),
          getRoles(),
        ]);
        setUserData(userinfo);
        if (userinfo.role) {
          setSelectedRoles(userinfo.role);
        }
        setAllRoles(roles);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <Card className="bg-white text-gray-800 font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <div className="flex items-center space-x-4">
            <img
              src="https://placehold.co/64x64/7c3aed/ffffff?text=A"
              alt="User Avatar"
              className="w-16 h-16 rounded-full border-2 border-black-500"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData?.name}
              </h1>
              <p className="text-gray-500">{userData?.email}</p>
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
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  defaultValue={userData?.name}
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  defaultValue={userData?.email}
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  className="border block w-full bg-white border-gray-300 rounded-md text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm h-10 px-3"
                  defaultValue={userData?.user_id}
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
                            setSelectedRoles((prev) => [...prev, role]);
                          } else {
                            setSelectedRoles((prev) =>
                              prev.filter((r) => r.role_id !== role.role_id)
                            );
                          }
                        }}
                        className="cursor-pointer"
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
                  ).toLocaleDateString()}
                  disabled
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button
                variant="outline"
                className="bg-gray-500 text-white hover:bg-black hover:text-white duration-300 cursor-pointer"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* --- Navigation Buttons --- */}
        <div className="mb-8">
          <nav
            className="flex space-x-2 transition-all: duration-300"
            aria-label="Navigation"
          >
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
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{tab}</h2>
          {tab === "Interview Feedbacks" && (
            <DataTable
              columns={interviewFeedbackColumns}
              data={userData?.interview_feedbacks || []}
            />
          )}
          {tab === "Candidate Reviews" && (
            <DataTable
              columns={candidateReviewColumns}
              data={userData?.candidate_reviews || []}
            />
          )}
          {tab === "Jobs Created" && (
            <DataTable
              columns={jobColumns}
              data={userData?.jobs_created || []}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
