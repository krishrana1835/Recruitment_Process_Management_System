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
import JobManageReviewer from "./tabs/CompanyDashboard/Reviewer/JobManageReviewer";
import ResetUserPassword from "./tabs/CompanyDashboard/ChangePassword";
import UpdateUserProfile from "./tabs/CompanyDashboard/UserProfile";
import JobApplicationReviewer from "./tabs/CompanyDashboard/Reviewer/JobApplicationReviewer";
import ShortListCandidate from "./tabs/CompanyDashboard/Reviewer/ShortListCandidate";
import ListJobsRecruiter from "./tabs/CompanyDashboard/Recruiter/ListJobsRecruiter";
import InterviewTypeManager from "./tabs/CompanyDashboard/Recruiter/InterviewTypeManager";
import ScheduleInterviewForm from "./tabs/CompanyDashboard/Recruiter/ScheduleInterviewForm";
import DeleteRound from "./tabs/CompanyDashboard/Recruiter/DeleteRound";
import CandidateInterviewSchedule from "./tabs/CompanyDashboard/Recruiter/CandidateInterviewShedule";
import CandidateInterviewScheduleData from "./tabs/CompanyDashboard/Candidate/InterviewSchedule";
import { SkillsManager } from "./tabs/CompanyDashboard/Recruiter/SkillsManager";
import SkillReview from "./tabs/CompanyDashboard/Interviewer/SkillReview";
import HrReviewForm from "./tabs/CompanyDashboard/HR/HrReviewForm";
import InterviewRatingCard from "./tabs/CompanyDashboard/Interviewer/InterviewRatingCard";
import ListCandidatesWithScores from "./tabs/CompanyDashboard/HR/ListCandidatesWithScores";
import ListJobsDocVerification from "./tabs/CompanyDashboard/HR/ListJobsForDocVerif";
import SelectedCandidates from "./tabs/CompanyDashboard/HR/SelectedCandidateList";

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
                  requiredRole={[
                    "Admin",
                    "HR",
                    "Candidate",
                    "Reviewer",
                    "Recruiter",
                    "Interviewer",
                    "Viewer"
                  ]}
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
                    requiredRole={[
                      "Admin",
                      "Candidate",
                      "Reviewer",
                      "Recruiter",
                      "Interviewer",
                      "HR",
                      "Viewer"
                    ]}
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
                  <ProtectedRoute requiredRole={["Admin", "Viewer"]}>
                    {" "}
                    {/* User management page for Admin */}
                    <UserManage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users/profile/view/:id"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Viewer"]}>
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
                  <ProtectedRoute requiredRole={["Admin", "Recruiter", "Viewer"]}>
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
                  <ProtectedRoute requiredRole={["Admin", "Recruiter", "Viewer"]}>
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
                  <ProtectedRoute requiredRole={["Admin", "Recruiter", "Viewer"]}>
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
                  <ProtectedRoute
                    requiredRole={["Admin", "Reviewer", "Recruiter", "Viewer"]}
                  >
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
                  <ProtectedRoute
                    requiredRole={[
                      "Reviewer",
                      "Admin",
                      "Recruiter",
                      "Interviewer",
                      "HR",
                      "Viewer"
                    ]}
                  >
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ResetUserPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="userprofile"
                element={
                  <ProtectedRoute
                    requiredRole={[
                      "Reviewer",
                      "Admin",
                      "Recruiter",
                      "Interviewer",
                      "HR",
                      "Viewer"
                    ]}
                  >
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
                  <ProtectedRoute requiredRole={["Reviewer", "Admin", "Viewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <JobManageReviewer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="view-job-applications/:job_title/:job_id"
                element={
                  <ProtectedRoute requiredRole={["Reviewer", "Admin", "Viewer"]}>
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
                  <ProtectedRoute requiredRole={["Reviewer", "Admin", "Viewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ShortListCandidate />
                  </ProtectedRoute>
                }
              />

              {/*Recruiter Routes start here */}
              <Route
                path="job-scheduled-status"
                element={
                  <ProtectedRoute
                    requiredRole={["Recruiter", "Admin", "Interviewer", "HR", "Viewer"]}
                  >
                    <ListJobsRecruiter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="skills-manager"
                element={
                  <ProtectedRoute
                    requiredRole={["Recruiter", "Admin", "Interviewer"]}
                  >
                    <SkillsManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="job-scheduled-add/:job_id"
                element={
                  <ProtectedRoute requiredRole={["Recruiter", "Admin"]}>
                    <ScheduleInterviewForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="manage-interview-types"
                element={
                  <ProtectedRoute requiredRole={["Recruiter", "Admin"]}>
                    <InterviewTypeManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="delete-interview-round/:job_id"
                element={
                  <ProtectedRoute requiredRole={["Recruiter", "Admin"]}>
                    <DeleteRound allowUpdate={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="list-interview-round/:job_id"
                element={
                  <ProtectedRoute
                    requiredRole={["Recruiter", "Admin", "Interviewer", "HR", "Viewer"]}
                  >
                    <DeleteRound allowUpdate={false} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="list-interview-round/candidates/:job_id/:round_number"
                element={
                  <ProtectedRoute
                    requiredRole={["Recruiter", "Admin", "Interviewer", "HR", "Viewer"]}
                  >
                    <CandidateInterviewSchedule allowDelete={true} />
                  </ProtectedRoute>
                }
              />

              {/*Interviewer Routes start here */}
              <Route
                path="list-interview-round/candidates/skills/:interviewId"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Interviewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <SkillReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="list-interview-round/candidates/rating-card/:jobId/:roundNumber/:candidateId"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Interviewer", "HR", "Viewer"]}>
                    {" "}
                    <InterviewRatingCard type="RoundRatingCard" />
                  </ProtectedRoute>
                }
              />

              <Route
                path="list-interview-round/candidates/overall-rating-card/:jobId/:roundNumber/:candidateId"
                element={
                  <ProtectedRoute requiredRole={["Admin", "Interviewer", "HR", "Viewer"]}>
                    {" "}
                    <InterviewRatingCard type="OverAllRatingCard" />
                  </ProtectedRoute>
                }
              />

              {/*Hr Routes starts from here */}
              <Route
                path="list-interview-round/candidates/review/:interviewId"
                element={
                  <ProtectedRoute requiredRole={["Admin", "HR"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <HrReviewForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="list-interview-round/scores/:jobId/:roundNumber"
                element={
                  <ProtectedRoute requiredRole={["Admin", "HR", "Interviewer", "Viewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ListCandidatesWithScores />
                  </ProtectedRoute>
                }
              />
              <Route
                path="candidate-doc-verification"
                element={
                  <ProtectedRoute requiredRole={["Admin", "HR", "Viewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <ListJobsDocVerification />
                  </ProtectedRoute>
                }
              />

              <Route
                path="candidate-doc-verification/selected/:jobId"
                element={
                  <ProtectedRoute requiredRole={["Admin", "HR", "Viewer"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <SelectedCandidates />
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
              <Route
                path="interview-schedule"
                element={
                  <ProtectedRoute requiredRole={["Candidate"]}>
                    {" "}
                    {/* Generic delete handler for Admin */}
                    <CandidateInterviewScheduleData />
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
