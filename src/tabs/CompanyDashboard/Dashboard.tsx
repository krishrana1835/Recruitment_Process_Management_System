import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Images } from "@/constants/Images";
import { motion } from "framer-motion";
import { useAuth } from "@/route_protection/AuthContext";

/**
 * Interface for menu items displayed in the sidebar.
 * @interface menu
 */
interface menu {
  name: string; // Display name of the menu item
  path: string; // Route path for the menu item
}

// Menu items specific to Admin role
const AdminItems = [
  { name: "User Management", path: "users" },
  { name: "Job Management", path: "jobs" },
  { name: "Candidate Management", path: "candidates" },
  { name: "Resume Review & Sortlisting", path: "view-open-jobs" },
  { name: "Interview Schedules", path: "job-scheduled-status" },
  // { name: "Feedback & Evaluation", path: "/dashboard/feedback" },
  { name: "Document Verification", path: "candidate-doc-verification" },
  { name: "Reports & Analytics", path: "/dashboard/reports" },
  { name: "Notifications", path: "/dashboard/notifications" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

const Viewer = [
  { name: "User Management", path: "users" },
  { name: "Job Management", path: "jobs" },
  { name: "Candidate Management", path: "candidates" },
  { name: "Resume Review & Sortlisting", path: "view-open-jobs" },
  { name: "Interview Schedules", path: "job-scheduled-status" },
  // { name: "Feedback & Evaluation", path: "/dashboard/feedback" },
  { name: "Document Verification", path: "candidate-doc-verification" },
  { name: "Reports & Analytics", path: "/dashboard/reports" },
  { name: "Notifications", path: "/dashboard/notifications" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

// Menu items specific to Candidate role
const CandidateItems = [
  { name: "Job Openings", path: "openjobs" },
  { name: "My Applications", path: "myapplications" },
  { name: "Interview Schedule", path: "interview-schedule" },
  { name: "Upload Resume", path: "uploadresume" },
  { name: "Upload Documents", path: "documents" },
  { name: "Profile", path: "profile" },
  { name: "Settings", path: "settings" },
];

// Menu items specific to Reviewer role
const ReviewerItems = [
  { name: "Job Openings", path: "view-open-jobs" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

// Menu items specific to Reviewer role
const InterviewerItems = [
  { name: "Interview Schedules", path: "job-scheduled-status" },
  { name: "Skills Manager", path: "skills-manager" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

// Menu items specific to Reviewer role
const RecruiterItems = [
  { name: "Job Management", path: "jobs" },
  { name: "Candidate Management", path: "candidates" },
  { name: "Shedule Interview", path: "job-scheduled-status" },
  { name: "Skills Manager", path: "skills-manager" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

// Menu items specific to HR role
const HRItems = [
  { name: "Interview Schedules", path: "job-scheduled-status" },
  { name: "Document Verification", path: "candidate-doc-verification" },
  { name: "Profile", path: "userprofile" },
  { name: "Settings", path: "resetpassword" },
];

/**
 * Dashboard component that provides a layout with a sidebar and a main content area.
 * It dynamically loads menu items based on the authenticated user's role.
 */
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
  // const role = sessionStorage.getItem('role'); // Commented out: role is now managed by AuthContext
  const [loadMenu, setLoadMenu] = useState<menu[]>([
    { name: "Logout", path: "/" },
  ]); // State for dynamic menu items
  const [panelName, setPanelName] = useState<string | null>(""); // State for displaying the current panel name (user role)

  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user } = useAuth(); // Get user information from AuthContext

  // Motion components for animations
  const MotionLink = motion.create(Link);
  const Motionbutton = motion.create(Button);

  // Effect hook to load menu items based on user role when the component mounts or user changes
  useEffect(() => {
    if (!user) return; // If no user is logged in, do nothing
    switch (user.role) {
      case "Admin":
        setLoadMenu(AdminItems);
        break;
      case "Candidate":
        setLoadMenu(CandidateItems);
        break;
      case "Reviewer":
        setLoadMenu(ReviewerItems);
        break;
      case "Recruiter":
        setLoadMenu(RecruiterItems);
        break;
      case "Interviewer":
        setLoadMenu(InterviewerItems);
        break;
      case "HR":
        setLoadMenu(HRItems);
        break;
      case "Viewer":
        setLoadMenu(Viewer);
        break;
      default:
    }
    setPanelName(user.role); // Set the panel name to the user's role
  }, [user]); // Dependency array includes user to re-run when user data changes

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64" // Toggle sidebar visibility
        } md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b flex-shrink-0">
            <span className="text-xl font-bold">{panelName} Panel</span>{" "}
            {/* Display current panel name */}
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {loadMenu.map((item) => (
              <MotionLink
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", duration: 0.05 }}
                key={item.name}
                to={item.path}
                className="block px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 font-medium transition"
                onClick={() => setSidebarOpen(false)} // Close sidebar on menu item click
              >
                {item.name}
              </MotionLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-md flex-shrink-0 z-30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)} // Toggle sidebar on button click
            >
              <Menu className="w-6 h-6" /> {/* Menu icon */}
            </Button>
            <span className="font-semibold">
              <img src={Images.companyLogo} className="h-7 w-auto"></img>
            </span>{" "}
            {/* Company logo */}
          </div>
          <div>
            <Motionbutton
              className="cursor-pointer"
              whileHover={{ boxShadow: "0px 0px 2px 2px #ddd" }}
              transition={{ duration: 0.2 }}
              variant="outline"
              onClick={() => navigate("/logout")}
            >
              Logout
            </Motionbutton>{" "}
            {/* Logout button */}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* Renders child routes */}
        </main>
      </div>
    </div>
  );
}
