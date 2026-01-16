"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";

import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { getDailySummary } from "@/api/Reports_api";
import { Atom } from "react-loading-indicators";

/* ---------- Types ---------- */
export interface DailySummary {
  reportDate: string;
  totalCandidatesAdded: number;
  candidatesAdded: CandidateSummary[];
  emailsSent: EmailSummary[];
  newEmployees: EmployeeSummary[];
  interviewStats: InterviewMetrics;
  jobsCreated: JobSummary[];
  jobsStatusChanged: JobSummary[];
  usersCreated: UserSummary[];
}

interface CandidateSummary {
  candidateId: string;
  candidateName: string;
  email?: string;
}

interface EmailSummary {
  messageId: number;
  subject: string;
  recipients: string[];
  sentAt: string;
}

interface EmployeeSummary {
  employeeId: number;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  jobId: number;
  jobTitle: string;
}

interface InterviewMetrics {
  totalInterviewsTaken: number;
  totalHrInterviews: number;
  totalSimpleInterviews: number;
  selectedInHr: number;
  selectedInSimple: number;
}

interface JobSummary {
  jobId: number;
  jobTitle: string;
  status: string;
}

interface UserSummary {
  userId: string;
  name: string;
  email: string;
  roles: { roleName: string }[];
}

/* ---------- Helpers ---------- */
function toApiDateTime(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}T00:00:00`;
}

/* ---------- Component ---------- */
export default function DailySummaryDashboard() {
  const { user } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEmailsModal, setShowEmailsModal] = useState(false);

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const apiDate = toApiDateTime(selectedDate);
        const res = await getDailySummary(apiDate, user.token);
        setData(res);
      } catch (error: any) {
        notify.error("Error", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, user?.token]);

  if (!data) return <p className="p-6">Loading daily summary...</p>;

  /* ---------- Pie Chart Data ---------- */
  const rejectedHr =
    data.interviewStats.totalHrInterviews - data.interviewStats.selectedInHr;

  const rejectedSimple =
    data.interviewStats.totalSimpleInterviews -
    data.interviewStats.selectedInSimple;

  const selectionPieData = [
    {
      name: "HR Selected",
      value: data.interviewStats.selectedInHr,
      color: "#22c55e",
    },
    { name: "HR Rejected", value: rejectedHr, color: "#ef4444" },
    {
      name: "Simple Selected",
      value: data.interviewStats.selectedInSimple,
      color: "#3b82f6",
    },
    { name: "Simple Rejected", value: rejectedSimple, color: "#f97316" },
  ];

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Summary</h2>

        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          dateFormat="dd-MM-yyyy"
          className="rounded-md border px-3 py-2 text-sm shadow-sm"
        />
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Candidates Added" value={data.totalCandidatesAdded} />
        <StatCard
          title="Emails Sent"
          value={data.emailsSent.length}
          clickable
          onClick={() => setShowEmailsModal(true)}
        />
        <StatCard title="New Employees" value={data.newEmployees.length} />
        <StatCard
          title="Interviews"
          value={data.interviewStats.totalInterviewsTaken}
        />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Interview Results</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={selectionPieData} dataKey="value" label>
                  {selectionPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selections Count</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "HR", selected: data.interviewStats.selectedInHr },
                  {
                    name: "Simple",
                    selected: data.interviewStats.selectedInSimple,
                  },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="selected" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* CANDIDATES */}
      <Section title="Candidates Added">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.candidatesAdded.map((c) => (
              <TableRow key={c.candidateId}>
                <TableCell>{c.candidateName}</TableCell>
                <TableCell>{c.email ?? "-"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Email</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      {/* JOBS */}
      <Section title="Jobs Created">
        {data.jobsCreated.map((j) => (
          <div key={j.jobId} className="flex justify-between py-1">
            <span>{j.jobTitle}</span>
            <Badge variant="outline">{j.status}</Badge>
          </div>
        ))}
      </Section>

      {/* USERS */}
      <Section title="Users Created">
        {data.usersCreated.map((u) => (
          <div key={u.userId} className="text-sm">
            {u.name} ({u.email}) —{" "}
            <span className="text-muted-foreground">
              {u.roles.map((r) => r.roleName).join(", ")}
            </span>
          </div>
        ))}
      </Section>

      {/* EMAILS MODAL */}
      <Dialog open={showEmailsModal} onOpenChange={setShowEmailsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Sent Emails</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.emailsSent.map((e) => (
                <TableRow key={e.messageId}>
                  <TableCell>{e.subject}</TableCell>
                  <TableCell className="text-xs">
                    {e.recipients.join(", ")}
                  </TableCell>
                  <TableCell>{new Date(e.sentAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function StatCard({
  title,
  value,
  clickable,
  onClick,
}: {
  title: string;
  value: number;
  clickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={clickable ? "cursor-pointer hover:bg-muted" : ""}
    >
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
