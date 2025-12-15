import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  CandidateInterview,
  CandidateInterviewReq,
} from "@/interfaces/Interview_interface";
import { fetchCandidateInterviwes } from "@/api/Interview_api";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { fetchAppliedJobs } from "@/api/Candidate_Status_History_api";

interface AppliedJob {
  job_id: number;
  job_title: string;
  sheduled: string;
}

export default function CandidateInterviewScheduleData() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [interviewsByJob, setInterviewsByJob] = useState<
    Record<number, CandidateInterview[]>
  >({});
  const [loadingJobId, setLoadingJobId] = useState<number | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user?.token) {
        notify.error("User not authenticated");
        return;
      }
      if (!user?.userId) {
        notify.error("User id not found");
        return;
      }
      try {
        const res = await fetchAppliedJobs(user.userId, user.token);
        setJobs(res);
      } catch (err: any) {
        notify.error(err.message);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
  if (!selectedJobId) {
    const first = jobs.find(j => j.sheduled === "Sheduled");
    if (first) {
      setSelectedJobId(first.job_id);
      fetchInterviewSchedule(first.job_id);
    }
  }
}, [jobs]);

  const fetchInterviewSchedule = async (jobId: number) => {
    if (!user?.token || !user?.userId) return;
    if (interviewsByJob[jobId]) return;

    setLoadingJobId(jobId);
    try {
      const payload: CandidateInterviewReq = {
        job_id: jobId,
        candidate_id: user.userId,
      };

      const res = await fetchCandidateInterviwes(payload, user.token);

      setInterviewsByJob(() => ({
        [jobId]: res,
      }));
    } catch (err: any) {
      notify.error(err.message);
    } finally {
      setLoadingJobId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-black rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6">Your Interview Schedule</h2>

      {/* ✅ SHOW ONLY "Sheduled" JOB TITLES */}
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jobs
          .filter((job) => job.sheduled === "Sheduled")
          .map((job) => {
            const isSelected = selectedJobId === job.job_id;

            return (
              <Card
                key={job.job_id}
                onClick={() => {
                  setSelectedJobId(job.job_id);
                  fetchInterviewSchedule(job.job_id);
                }}
                className={`
            group cursor-pointer border transition-all
            ${
              isSelected
                ? "border-black ring-2 ring-black/20 bg-black/5"
                : "border-black/10 hover:border-black/30 hover:bg-black/[0.03]"
            }
          `}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-black">
                      {job.job_title}
                    </h3>
                    <p className="text-xs text-black/60 mt-1">
                      Interview scheduled
                    </p>
                  </div>

                  {/* subtle indicator */}
                  <div
                    className={`
                h-2.5 w-2.5 rounded-full transition
                ${
                  isSelected
                    ? "bg-black"
                    : "bg-black/20 group-hover:bg-black/40"
                }
              `}
                  />
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* ✅ INTERVIEWS */}
      {jobs
        .filter(
          (job) =>
            job.sheduled === "Sheduled" && interviewsByJob[job.job_id]?.length
        )
        .map((job) => (
          <div key={job.job_id} className="mb-10">
            <h3 className="text-xl font-semibold mb-4">{job.job_title}</h3>

            {loadingJobId === job.job_id && (
              <p className="text-center mb-4">Loading interviews...</p>
            )}

            <div className="space-y-6">
              {interviewsByJob[job.job_id].map((interview) => (
                <Card
                  key={interview.interview_id}
                  className="border border-black/10 shadow-none"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                      Round {interview.round_number} ·{" "}
                      {interview.interview_type.interview_round_name}
                    </CardTitle>

                    <Badge
                      variant="outline"
                      className={`
    text-xs
    ${
      interview.status === "Selected"
        ? "bg-green-500 text-white"
        : interview.status === "Rejected"
        ? "bg-red-600 text-white border-red/50 line-through"
        : "bg-white text-black border-black"
    }
  `}
                    >
                      {interview.status}
                    </Badge>
                  </CardHeader>

                  <hr />

                  <CardContent className="space-y-3 pt-4">
                    <p className="text-sm text-black/70">
                      {interview.interview_type.process_descreption}
                    </p>

                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(interview.start_time).toLocaleDateString()}
                      </p>

                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {new Date(interview.start_time).toLocaleTimeString()} –{" "}
                        {new Date(interview.end_time).toLocaleTimeString()}
                      </p>

                      <p>
                        <span className="font-medium">Mode:</span>{" "}
                        {interview.mode}
                      </p>

                      {interview.mode === "Offline" ? (
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {interview.location_or_link}
                        </p>
                      ) : (
                        <p>
                          <span className="font-medium">Link:</span>{" "}
                          <a
                            href={interview.location_or_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700"
                          >
                            {interview.location_or_link}
                          </a>
                        </p>
                      )}

                      <p>
                        <span className="font-medium">Interviewers:</span>{" "}
                        {interview.users.map((u) => u.name).join(", ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
