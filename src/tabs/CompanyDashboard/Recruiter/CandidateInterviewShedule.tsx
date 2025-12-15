import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  deleteCandidateInterview,
  fetchCandidateInterviweSchedule,
  fetchCandidateInterviweScheduleInterviewer,
  updateCandidateInterviweSchedule,
} from "@/api/Interview_api";
import { getAllInterviewers } from "@/api/Users_api";
import { notify } from "@/components/custom/Notifications";
import { useAuth } from "@/route_protection/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";

/* ---------- Types ---------- */
interface User {
  user_id: string;
  name: string;
}

interface Candidate {
  candidate_id: string;
  full_name: string;
  email: string;
}

interface InterviewType {
  interview_type_id: number;
  interview_round_name: string;
  process_descreption: string;
}

export interface CandidateInterviewSchedule {
  interview_id: number;
  round_number: number;
  location_or_link: string;
  candidate_id: string;
  job_id: number;
  interview_type_id: number;
  mode: string;
  start_time: string;
  end_time: string;
  status: string;
  scheduled_by: string;
  scheduled_by_user: {
    user_id: string;
    name: string;
  };
  candidate: Candidate;
  interview_type: InterviewType;
  users: User[];
}

const INTERVIEW_STATUS = [
  "Scheduled",
  "Rescheduled",
  "Selected",
  "Rejected",
] as const;

const CandidateInterviewSchedule = ({
  allowDelete,
}: {
  allowDelete: boolean;
}) => {
  const [data, setData] = useState<CandidateInterviewSchedule[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const { job_id, round_number } = useParams<{
    job_id: string;
    round_number: string;
  }>();

  const { user } = useAuth();

  const nevigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      notify.error("User not authenticated");
      return;
    }

    if (!job_id || !round_number) {
      notify.error("Invalid job or round");
      return;
    }

    const fetchData = async () => {
      try {
        const payload = {
          job_id: Number(job_id),
          round_number: Number(round_number),
          user_id: user.userId,
        };

        if (user?.role === "Admin" || user?.role === "Recruiter") {
          const schedules = await fetchCandidateInterviweSchedule(
            payload,
            user.token
          );
          setData(schedules);
        }

        if (user?.role === "Interviewer" || user?.role === "HR") {
          const schedules = await fetchCandidateInterviweScheduleInterviewer(
            payload,
            user.token
          );
          setData(schedules);
        }

        const users = await getAllInterviewers(user.token);
        setAllUsers(users);
      } catch (error) {
        notify.error("Failed to load interview schedules");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [job_id, round_number, user?.token]);

  const filteredData = data.filter((interview) =>
    interview.candidate.full_name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------- Handlers ---------- */
  const handleUserChange = (
    interviewId: number,
    userIndex: number,
    newUserId: string
  ) => {
    setData((prev) =>
      prev.map((interview) => {
        if (interview.interview_id !== interviewId) return interview;

        const selectedUser = allUsers.find((u) => u.user_id === newUserId);
        if (!selectedUser) return interview;

        const users = [...interview.users];
        users[userIndex] = selectedUser;

        return { ...interview, users };
      })
    );
  };

  const addUser = (interviewId: number) => {
    setData((prev) =>
      prev.map((interview) =>
        interview.interview_id === interviewId
          ? {
              ...interview,
              users: [...interview.users, { user_id: "", name: "" }],
            }
          : interview
      )
    );
  };

  const removeUser = (interviewId: number, index: number) => {
    setData((prev) =>
      prev.map((interview) =>
        interview.interview_id === interviewId
          ? {
              ...interview,
              users: interview.users.filter((_, i) => i !== index),
            }
          : interview
      )
    );
  };

  const handleInterviewFieldChange = (
    interviewId: number,
    field: keyof CandidateInterviewSchedule,
    value: any
  ) => {
    setData((prev) =>
      prev.map((interview) =>
        interview.interview_id === interviewId
          ? { ...interview, [field]: value }
          : interview
      )
    );
  };

  const handleUpdate = async (interviewId: number) => {
    const interview = data.find((i) => i.interview_id === interviewId);
    if (!interview || !user?.token) return;
    try {
      const payload = {
        interview_id: interview.interview_id,
        mode: interview.mode,
        location_or_link: interview.location_or_link,
        users: interview.users.map((u) => u.user_id),
        user_id: user.userId,
        status: interview.status,
      };

      await updateCandidateInterviweSchedule(payload, user.token);

      notify.success("Interview updated successfully");
    } catch (err) {
      notify.error("Failed to update interview");
    }
  };

  const handleDelete = async (interviewId: number) => {
    if (!user?.token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );
    if (!confirmed) return;

    try {
      const res = await deleteCandidateInterview(interviewId, user.token);
      if (res) {
        setData((prev) => prev.filter((i) => i.interview_id !== interviewId));
        notify.success("Interview deleted");
      } else notify.error("Failed to delete interview");
    } catch (err) {
      notify.error("Failed to delete interview");
    }
  };

  /* ---------- UI ---------- */
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-muted-foreground">Loading schedules…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Candidate Interview Schedule</h2>

      <Input
        placeholder="Search candidate name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white w-full"
      />

      {filteredData.length ? (
        filteredData.map((interview) => (
          <Card key={interview.interview_id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{interview.candidate.full_name} - <span className="text-gray-500">{interview.candidate.email}</span></CardTitle>
                <div className="flex items-center gap-2">
                  {user?.role === "Admin" || user?.role === "Recruiter" ? (
                    <Select
                      value={interview.status}
                      onValueChange={(val) =>
                        handleInterviewFieldChange(
                          interview.interview_id,
                          "status",
                          val
                        )
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        {INTERVIEW_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`w-full ${
                        interview.status === "Scheduled"
                          ? "bg-blue-500"
                          : interview.status === "Selected"
                          ? "bg-green-500"
                          : interview.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      } p-1 px-2`}
                    >
                      {interview.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Round:</span>{" "}
                  {interview.interview_type.interview_round_name}
                </p>
                <div className="flex flex-row justify-start items-center gap-3">
                  <div className="font-medium">Mode:</div>

                  <Select
                    value={interview.mode}
                    onValueChange={(val) =>
                      handleInterviewFieldChange(
                        interview.interview_id,
                        "mode",
                        val
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p>
                  <span className="font-medium">Start:</span>{" "}
                  {new Date(interview.start_time).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">End:</span>{" "}
                  {new Date(interview.end_time).toLocaleString()}
                </p>
              </div>

              <hr />

              <div className="space-y-3">
                <p className="font-medium">Interviewers</p>

                {interview.users.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Select
                      value={user.user_id}
                      onValueChange={(val) =>
                        handleUserChange(interview.interview_id, idx, val)
                      }
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select interviewer" />
                      </SelectTrigger>

                      <SelectContent>
                        {allUsers.map((u) => (
                          <SelectItem key={u.user_id} value={u.user_id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(interview.interview_id, idx)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addUser(interview.interview_id)}
                >
                  + Add interviewer
                </Button>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Location / Meeting Link
                </label>

                <Input
                  value={interview.location_or_link || ""}
                  placeholder={
                    interview.mode === "Online"
                      ? "Enter meeting link"
                      : "Enter interview location"
                  }
                  onChange={(e) =>
                    handleInterviewFieldChange(
                      interview.interview_id,
                      "location_or_link",
                      e.target.value
                    )
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex gap-4">
                <Label className="text-gray-500">
                  Last Updated By: {interview.scheduled_by_user.name}
                </Label>
                <Label className="text-gray-500">
                  UserID: {interview.scheduled_by_user.user_id}
                </Label>
              </div>

              <hr />

              <div className="flex justify-start gap-2 pt-4">
                <Button
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleUpdate(interview.interview_id)}
                >
                  Update
                </Button>

                {((allowDelete && user?.role === "Admin") ||
                  user?.role === "Recruiter") && (
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => handleDelete(interview.interview_id)}
                  >
                    Delete
                  </Button>
                )}
                {((allowDelete && user?.role === "Admin") ||
                  user?.role === "Interviewer") && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => nevigate("/company/dashboard/list-interview-round/candidates/skills/"+interview.interview_id)}
                  >
                    Show Candidate Info
                  </Button>
                )}
                {((allowDelete && user?.role === "Admin") ||
                  user?.role === "HR") && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => nevigate("/company/dashboard/list-interview-round/candidates/review/"+interview.interview_id)}
                  >
                    Show Candidate Info
                  </Button>
                )}
                {((allowDelete && user?.role === "Admin") ||
                  user?.role === "HR" || user?.role === "Interviewer") && (
                  <Button
                    className="cursor-pointer"
                    onClick={() => nevigate(`/company/dashboard/list-interview-round/candidates/rating-card/${interview.job_id}/${interview.round_number}/${interview.candidate.candidate_id}`)}
                  >
                    Show Score Card
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">No candidates found.</p>
      )}
    </div>
  );
};

export default CandidateInterviewSchedule;
