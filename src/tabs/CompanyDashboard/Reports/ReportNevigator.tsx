import { useNavigate } from "react-router-dom"
import {
  BarChart,
  CalendarDays,
  Users,
  Code,
  Briefcase
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

const reports = [
  {
    title: "Interviewer Summary",
    description: "Overview of interviewer performance and scores",
    icon: BarChart,
    path: "interviewer"
  },
  {
    title: "Daily Summary",
    description: "Day-wise interview analytics",
    icon: CalendarDays,
    path: "daily-summary"
  },
  {
    title: "Candidate Summary",
    description: "Candidate selection and evaluation insights",
    icon: Users,
    path: "candidate-summary"
  },
  {
    title: "Technology-wise Profiles",
    description: "Candidates grouped by technology stack",
    icon: Code,
    path: "technology-profiles"
  },
  {
    title: "Experience-wise Candidates",
    description: "Candidates categorized by experience level",
    icon: Briefcase,
    path: "experience-candidates"
  }
]

export default function ReportsNavigator() {
  const navigate = useNavigate()

  return (
    <Card className="bg-white p-6 w-full min-h-full">
      <h1 className="mb-6 text-3xl font-semibold text-black flex items-center justify-center">
        Reports & Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card
            key={report.title}
            onClick={() => navigate(report.path)}
            className="cursor-pointer border border-gray-200 transition hover:border-black hover:shadow-sm"
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <report.icon className="h-5 w-5 text-black" />
              <CardTitle className="text-base">
                {report.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-gray-600">
              {report.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  )
}