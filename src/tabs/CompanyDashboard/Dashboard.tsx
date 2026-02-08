import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Users,
  Briefcase,
  FileText,
  Calendar,
  BarChart3,
  Mail,
  User,
  Settings,
  ClipboardList,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Images } from "@/constants/Images";
import { motion } from "framer-motion";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { Isemployee } from "@/api/Employee_Records_api";

/**
 * Interface for menu items displayed in the sidebar.
 */
interface menu {
  name: string;
  path: string;
  icon: React.ElementType;
}

/* ================= MENU CONFIGS ================= */

const AdminItems: menu[] = [
  { name: "User Management", path: "users", icon: Users },
  { name: "Job Management", path: "jobs", icon: Briefcase },
  { name: "Candidate Management", path: "candidates", icon: ClipboardList },
  {
    name: "Resume Review & Sortlisting",
    path: "view-open-jobs",
    icon: FileText,
  },
  { name: "Interview Schedules", path: "job-scheduled-status", icon: Calendar },
  {
    name: "Document Verification",
    path: "candidate-doc-verification",
    icon: ShieldCheck,
  },
  { name: "Employee Management", path: "manage-employee/jobs", icon: Users },
  { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Auto Mailer", path: "mails", icon: Mail },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

const Viewer: menu[] = [
  { name: "User Management", path: "users", icon: Users },
  { name: "Job Management", path: "jobs", icon: Briefcase },
  { name: "Candidate Management", path: "candidates", icon: ClipboardList },
  {
    name: "Resume Review & Sortlisting",
    path: "view-open-jobs",
    icon: FileText,
  },
  { name: "Interview Schedules", path: "job-scheduled-status", icon: Calendar },
  {
    name: "Document Verification",
    path: "candidate-doc-verification",
    icon: ShieldCheck,
  },
  { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

const CandidateItems: menu[] = [
  { name: "Job Openings", path: "openjobs", icon: Briefcase },
  { name: "My Applications", path: "myapplications", icon: ClipboardList },
  { name: "Interview Schedule", path: "interview-schedule", icon: Calendar },
  { name: "Upload Resume", path: "uploadresume", icon: FileText },
  { name: "Upload Documents", path: "documents", icon: ShieldCheck },
  { name: "Profile", path: "profile", icon: User },
  { name: "Settings", path: "settings", icon: Settings },
];

const ReviewerItems: menu[] = [
  { name: "Job Openings", path: "view-open-jobs", icon: Layers },
  { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

const InterviewerItems: menu[] = [
  { name: "Interview Schedules", path: "job-scheduled-status", icon: Calendar },
  { name: "Skills Manager", path: "skills-manager", icon: Layers },
  { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

const RecruiterItems: menu[] = [
  { name: "Job Management", path: "jobs", icon: Briefcase },
  { name: "Candidate Management", path: "candidates", icon: ClipboardList },
  { name: "Schedule Interview", path: "job-scheduled-status", icon: Calendar },
  { name: "Skills Manager", path: "skills-manager", icon: Layers },
  // { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

const HRItems: menu[] = [
  { name: "Interview Schedules", path: "job-scheduled-status", icon: Calendar },
  { name: "Document Verification", path: "candidate-doc-verification", icon: ShieldCheck },
  { name: "Employee Management", path: "manage-employee/jobs", icon: Users },
  { name: "Reports & Analytics", path: "reports", icon: BarChart3 },
  { name: "Auto Mailer", path: "mails", icon: Mail },
  { name: "Profile", path: "userprofile", icon: User },
  { name: "Settings", path: "resetpassword", icon: Settings },
];

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadMenu, setLoadMenu] = useState<menu[]>([]);
  const [panelName, setPanelName] = useState<string | null>("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const MotionLink = motion.create(Link);
  const Motionbutton = motion.create(Button);

  useEffect(() => {
    if (!user) return;

    const fetchIsEmplloyee = async () => {
      if (!user?.token) {
        notify.error("Session expired.", "Please login again.");
        return;
      }
      try {
        const response = await Isemployee(user.userId, user.token);
        if (user.role === "Candidate") {
          if (response === true) {
            const filteredMenu = CandidateItems.filter(
              (item) =>
                !["openjobs", "myapplications", "interview-schedule"].includes(
                  item.path,
                ),
            );

            const offerAndJoiningItem = {
              name: "Offer Letter & Joining Date",
              path: "offer-letter-joining",
              icon: FileText,
            };

            setLoadMenu([offerAndJoiningItem, ...filteredMenu]);
          } else {
            setLoadMenu(CandidateItems);
          }
        }
      } catch (error: any) {
        notify.error("Error", error.message);
      }
    };

    switch (user.role) {
      case "Admin":
        setLoadMenu(AdminItems);
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
      case "Candidate":
        fetchIsEmplloyee();
        break;
    }

    setPanelName(user.role);
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}
        md:translate-x-0 md:static md:block`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b font-bold text-lg">
            {panelName} Panel
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {loadMenu.map((item) => {
              const Icon = item.icon;

              return (
                <MotionLink
                  key={item.name}
                  to={item.path}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", duration: 0.05 }}
                  onClick={() => {
                    setActiveMenu(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
                    ${
                      activeMenu === item.path
                        ? "bg-blue-500 text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </MotionLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-md">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <img src={Images.companyLogo} className="h-7 w-auto" />
          </div>

          <Motionbutton
            variant="outline"
            whileHover={{ boxShadow: "0px 0px 2px 2px #ddd" }}
            onClick={() => navigate("/logout")}
          >
            Logout
          </Motionbutton>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
