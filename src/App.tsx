import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./tabs/Authentication/Login";
import Dashboard from "./tabs/CompanyDashboard/Dashboard";
import Unauthorized from "./tabs/Authentication/Unauthorized";
import { AuthProvider } from "./route_protection/AuthContext";
import { ProtectedRoute } from "./route_protection/ProtectedRoute";
import UserManage from "./tabs/CompanyDashboard/Admin/UserManage";
import UserProfile from "./tabs/CompanyDashboard/Admin/UserProfileView";
import AddUser from "./components/custom/AddUser";
import DeleteHandler from "./components/custom/DeleteHandler";
import Logout from "./route_protection/Logout"; // Import the new Logout component
import CandidateManage from "./tabs/CompanyDashboard/Admin/CandidateManage";
import AddCandidate from "./components/custom/AddCandidate";
import CandidateProfile from "./tabs/CompanyDashboard/Admin/CandidateProfileView";
import AddCandidateUsingResume from "./components/custom/AddCandidateUsingResume";
import JobManage from "./tabs/CompanyDashboard/Admin/JobManage";
import AddJob from "./components/custom/AddJob";
import { Toaster } from "sonner";
import RegisterCandidate from "./tabs/CompanyDashboard/Candidate/Register";
import WelcomePage from "./components/custom/WelcomePage";
import OpenJobList from "./tabs/CompanyDashboard/Candidate/ListOpenJobs";
import UploadResumePage from "./tabs/CompanyDashboard/Candidate/UploadResume";
import ResetPassword from "./tabs/CompanyDashboard/Candidate/Settings";
import CandidateDashboardProfile from "./tabs/CompanyDashboard/Candidate/Profile";
import { CandidateApplications } from "./tabs/CompanyDashboard/Candidate/CandidateApplications";
import UploadCandidateDocuments from "./tabs/CompanyDashboard/Candidate/CandidateDocuments";
import JobManageReviewer from "./tabs/CompanyDashboard/Recuter/ListAllJobs";
import ResetUserPassword from "./tabs/CompanyDashboard/ChangePassword";
import UpdateUserProfile from "./tabs/CompanyDashboard/UserProfile";
import JobApplicationReviewer from "./tabs/CompanyDashboard/Recuter/JobManageReviewer";
import ShortListCandidate from "./tabs/CompanyDashboard/Recuter/ShortListCandidate";

/**
 * Main application component that sets up routing and authentication.
 * It uses React Router for navigation and AuthProvider for managing authentication state.
 */
function App() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          duration: 3000,
          className: "shadow-lg font-medium rounded-md",
        }}
      />

      <AuthProvider>
        {" "}
        {/* Provides authentication context to the entire application */}
        <Router>
          {" "}
          {/* Enables client-side routing */}
          <Routes>
            {" "}
            {/* Defines the application's routes */}
            {/* Route for the login page */}
            <Route path="/" element={<Login />} />{" "}
            {/* Route for registration of candidate */}
            <Route path="/register" element={<RegisterCandidate />} />{" "}
            {/* Route for unauthorized access */}
            <Route path="/unauthorized" element={<Unauthorized />} />{" "}
            {/* Route for logging out */}
            <Route path="/logout" element={<Logout />} />{" "}
            {/* Protected route for the company dashboard and its sub-routes */}
            <Route
              path="/company/dashboard"
              element={
                <ProtectedRoute
                  requiredRole={["Admin", "HR", "Candidate", "Reviewer", "Recruiter"]}
                >
                  {" "}
                  {/* Only Admin and HR roles can access the dashboard */}
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              {/* Nested routes within the dashboard */}
              <Route
                index
                element={
                  <ProtectedRoute
                    requiredRole={["Admin", "Candidate", "Reviewer", "Recruiter"]}
                  >
                    {" "}
                    {/* Default dashboard view for Admin */}
                    <WelcomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    {" "}
                    {/* User management page for Admin */}
                    <UserManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/profile/view/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    {" "}
                    {/* View user profile page for Admin */}
                    <UserProfile allowUpdate={false} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/profile/update/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    {" "}
                    {/* Update user profile page for Admin */}
                    <UserProfile allowUpdate={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/add"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    {" "}
                    {/* Add new user page for Admin */}
                    <AddUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/:deleteapi/delete/:deleteid"
                element={
                  <ProtectedRoute requiredRole={["Admin"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <DeleteHandler />
                  </ProtectedRoute>
                }
              />

              {/*Candidate Management Section*/}
              <Route
                path="candidates"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidates/add"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <AddCandidate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidates/add/resume"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <AddCandidateUsingResume />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidates/profile/view/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateProfile
                      allowUpdate={false}
                      tabs={[
                        "Candidate Documents",
                        "Interview",
                        "Reviews",
                        "Skills",
                        "Status History",
                      ]}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidates/profile/update/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateProfile
                      allowUpdate={true}
                      tabs={[
                        "Candidate Documents",
                        "Interview",
                        "Reviews",
                        "Skills",
                        "Status History",
                      ]}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidates/:deleteapi/delete/:deleteid"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <DeleteHandler />
                  </ProtectedRoute>
                }
              />

              {/*Job Management Section*/}
              <Route
                path="jobs"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <JobManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs/add"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <AddJob action="Insert" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs/view/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Reviewer", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <AddJob action="View" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="jobs/update/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <AddJob action="Update" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="resetpassword"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ResetUserPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="userprofile"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin", "Recruiter"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <UpdateUserProfile />
                  </ProtectedRoute>
                }
              />
              {/*Reviewer Routes start here */}
              <Route
                path="view-open-jobs"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <JobManageReviewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="view-job-applications/:job_title/:job_id"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <JobApplicationReviewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="view-open-jobs"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <JobManageReviewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="shortlist-candidate/:id"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ShortListCandidate />
                  </ProtectedRoute>
                }
              />

              {/*Candidate Routes start here */}
              <Route
                path="openjobs"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <OpenJobList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="uploadresume"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <UploadResumePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateDashboardProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="myapplications"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="documents"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <UploadCandidateDocuments />
                  </ProtectedRoute>
                }
              />
              {/* Add more nested routes here as needed */}
            </Route>
            {/* Optional: handle unknown routes by redirecting to the home page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
