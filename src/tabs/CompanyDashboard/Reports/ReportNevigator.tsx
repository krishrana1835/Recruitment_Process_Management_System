import { useNavigate } from "react-router-dom";
import { BarChart, CalendarDays, Users, Code, Briefcase } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/route_protection/AuthContext";

type UserRole =
  | "Recruiter"
  | "HR"
  | "Interviewer"
  | "Reviewer"
  | "Admin"
  | "Viewer";

type ReportConfig = {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  allowedRoles: UserRole[];
};

const reports: ReportConfig[] = [
  {
    title: "Interviewer Summary",
    description: "Overview of interviewer performance and scores",
    icon: BarChart,
    path: "interviewer",
    allowedRoles: ["Admin", "HR", "Viewer"],
  },
  {
    title: "Daily Summary",
    description: "Day-wise interview analytics",
    icon: CalendarDays,
    path: "daily-summary",
    allowedRoles: ["Admin", "HR", "Viewer"],
  },
  {
    title: "Candidate Summary",
    description: "Candidate selection and evaluation insights",
    icon: Users,
    path: "candidate-summary",
    allowedRoles: ["Admin", "Recruiter", "HR", "Viewer"],
  },
  {
    title: "Technology-wise Profiles",
    description: "Candidates grouped by technology stack",
    icon: Code,
    path: "technology-profiles",
    allowedRoles: ["Admin", "Reviewer", "Interviewer", "HR", "Viewer"],
  },
  {
    title: "Experience-wise Candidates",
    description: "Candidates categorized by experience level",
    icon: Briefcase,
    path: "experience-candidates",
    allowedRoles: ["Admin", "Reviewer", "HR", "Viewer", "Interviewer", "Recruiter"],
  },
];

export default function ReportsNavigator() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const accessibleReports = reports.filter((report) =>
    report.allowedRoles.includes(user?.role as UserRole),
  );

  return (
    <Card className="bg-white p-6 w-full min-h-full">
      <h1 className="mb-6 text-3xl font-semibold text-black flex items-center justify-center">
        Reports & Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accessibleReports.map((report) => (
          <Card
            key={report.title}
            onClick={() => navigate(report.path)}
            className="cursor-pointer border border-gray-200 transition hover:border-black hover:shadow-sm"
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <report.icon className="h-5 w-5 text-black" />
              <CardTitle className="text-base">{report.title}</CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-gray-600">
              {report.description}
            </CardContent>
          </Card>
        ))}

        {accessibleReports.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            You do not have access to any reports.
          </p>
        )}
      </div>
    </Card>
  );
}
