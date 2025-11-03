import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { ListOpenJobsForCandidateDto } from "@/interfaces/Jobs_interface";
import { Atom } from "react-loading-indicators";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { getAllJobs } from "@/api/Job_api";
import JobDetails from "./JobDetails";

export default function OpenJobList () {
  const [jobs, setJobs] = useState<ListOpenJobsForCandidateDto[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    const loadJobs = async () => {
      if (!user) {
        notify.error("User not authenticated.");
        return;
      }
      if (!user.token) {
        notify.error("User token not found.");
        return;
      }
      try {
        const data = await getAllJobs(user?.token);
        const jobData = data.filter((job) => job.status.status === "Open");
        setJobs(jobData);
      } catch (error: any) {
        setError(error.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  if (selectedJobId !== null) {
    // Render JobDetails when a job is selected
    return (
      <JobDetails jobId={selectedJobId.toString()} onBack={() => setSelectedJobId(null)} />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-[#004080] mb-6">
        Available Jobs
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card
            key={job.job_id}
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            onClick={() => setSelectedJobId(job.job_id)}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-800">
                {job.job_title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Status: {job.status.status}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};