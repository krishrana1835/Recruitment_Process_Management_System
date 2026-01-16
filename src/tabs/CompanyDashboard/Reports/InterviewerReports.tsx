import { getJobTitles } from "@/api/Job_api";
import { notify } from "@/components/custom/Notifications";
import { useAuth } from "@/route_protection/AuthContext";
import { useEffect, useState } from "react";
import type { JobTitleInterface } from "../Admin/AddMail";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchRounds, getInterviewers } from "@/api/Interview_api";
import type { DeleteRound } from "../Recruiter/DeleteRound";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import InterviewerSummary, {
  type InterviewSummaryResponse,
} from "@/components/custom/InterviewerSummary";
import { getInterviewerSummary } from "@/api/Reports_api";
import { getAllInterviewers } from "@/api/Users_api";

export interface Interviewer {
  user_id: string;
  name: string;
  role: string[];
}

export interface InterviewerReportReq {
  userId: string | undefined;
  jobId: number | undefined;
  roundNumber: number | undefined;
  includeCandidateInfo: boolean;
  lastInterviewDate: null;
}

export default function InterviewerReports() {
  const [jobTitles, setJobTitles] = useState<JobTitleInterface[] | null>(null);
  const [interviewers, setInterviewers] = useState<Interviewer[] | null>(null);
  const [rounds, setRounds] = useState<DeleteRound | null>();

  const [jobId, setJobId] = useState<number>();
  const [roundNumber, setRoundNumber] = useState<number>();
  const [selectedCandidates, setSelectedCandidates] = useState<boolean>(false);
  const [interviewerId, setInterviewerId] = useState<string>();

  const [summary, setSummary] = useState<InterviewSummaryResponse[]>();

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    const fetchData = async () => {
      try {
        var res = await getJobTitles(user.token);
        setJobTitles(res);
      } catch (error: any) {
        notify.error("Error", error.message);
      }
    };
    fetchData();
  }, []);

  const handleInterviewerChange = async (jobId: number) => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }

    try {
      if (jobId === 0) {
        const res = await getAllInterviewers(user.token);

        const transformedInterviewers: Interviewer[] = res.map((item: any) => ({
          user_id: item.user_id,
          name: item.name,
          role: Array.isArray(item.roles)
            ? item.roles.map((r: any) => r.role_name)
            : [],
        }));

        setInterviewers(transformedInterviewers);
        setRounds(null);
        return;
      }

      if (jobId === undefined) {
        notify.error("Validation Error", "Job is required");
        return;
      }

      const res = await getInterviewers(jobId, user.token);

      setInterviewers(res);
    } catch (error: any) {
      notify.error("Error", error.message);
    }
  };

  const fetchJobRounds = async (jobId: number) => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    try {
      var res = await fetchRounds(jobId, user.token);
      setRounds(res);
    } catch (error: any) {
      notify.error("Error", error.message);
    }
  };

  const handleSubmit = async () => {
    if (!user?.token) {
      notify.error("Session Expired", "Please login again");
      return;
    }
    try {
      const payload: InterviewerReportReq = {
        userId: interviewerId,
        jobId: jobId == 0 ? undefined : jobId,
        roundNumber: roundNumber == 0 ? undefined : roundNumber,
        includeCandidateInfo: selectedCandidates,
        lastInterviewDate: null,
      };

      var res = await getInterviewerSummary(payload, user.token);
      setSummary(res);
    } catch (error: any) {
      notify.error("Error", error.message);
    }
  };
  return (
    <Card className="w-full min-h-full">
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Select Job</label>
            <Select
              onValueChange={(value) => {
                const jobId = Number(value);
                setJobId(jobId);
                handleInterviewerChange(jobId);

                if (jobId !== 0) {
                  fetchJobRounds(jobId);
                } else {
                  setRounds(null);
                  setRoundNumber(undefined);
                }
              }}
              required
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select a Job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key={0} value={String(0)}>
                  All Jobs
                </SelectItem>
                {jobTitles?.map((job) => (
                  <SelectItem key={job.job_id} value={String(job.job_id)}>
                    {job.job_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {interviewers && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Select Interviewer
              </label>
              <Select
                onValueChange={(value) => setInterviewerId(value)}
                required
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select an Interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {interviewers.map((interviewer) => (
                    <SelectItem
                      key={interviewer.user_id}
                      value={String(interviewer.user_id)}
                    >
                      {`${interviewer.name} (${interviewer.role.join(" / ")})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {rounds && (
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Select Round</label>
              <Select
                onValueChange={(value) => setRoundNumber(Number(value))}
                required
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key={0} value="0">
                    All Rounds
                  </SelectItem>
                  {rounds.roundData.map((round) => (
                    <SelectItem
                      key={round.round_number}
                      value={String(round.round_number)}
                    >
                      {round.interview_round_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!(jobId === undefined) && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="selectedCandidates"
                onChange={() => setSelectedCandidates(!selectedCandidates)}
              />
              <label
                htmlFor="selectedCandidates"
                className="text-sm font-medium"
              >
                Include Selected Candidate List
              </label>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleSubmit}
            className="mt-2 w-max"
          >
            Generate Report
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {summary && summary.length > 0 ? (
            <InterviewerSummary
              interviewerName={
                interviewers?.filter((i) => i.user_id === interviewerId)[0]
                  ?.name || ""
              }
              summaries={summary}
            />
          ) : (
            <div className="text-gray-500 text-center mt-4">
              No summary available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
