import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { JobInfoForCandidateDto } from "@/interfaces/Jobs_interface";
import { getJob } from "@/api/Job_api";
import { useAuth } from "@/route_protection/AuthContext";
import { notify } from "@/components/custom/Notifications";
import { getSkills } from "@/api/Skill_api";
import { Atom } from "react-loading-indicators";
import {
  applyForJobByCandidate,
  checkAppliedForJob,
} from "@/api/Candidate_Status_History_api";

interface JobDetailsProps {
  jobId: string;
  onBack: () => void;
}

export default function JobDetails({ jobId, onBack }: JobDetailsProps) {
  const [job, setJob] = useState<JobInfoForCandidateDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<any[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<any[]>([]);
  const [applied, setApplied] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    const loadJob = async () => {
      setError("");
      if (!user) {
        notify.error("User not authenticated.");
        return;
      }
      if (!user.token) {
        notify.error("User token not found.");
        return;
      }

      setLoading(true);
      try {
        const data = await getJob(jobId, user.token);
        setJob(data);

        const appliedStatus = await checkAppliedForJob(
          { candidate_id: user.userId, job_id: parseInt(jobId) },
          user.token
        );

        setApplied(appliedStatus.applied); 

        const allSkills = await getSkills();

        const reqSkills = data.jobs_Skills
          .filter((js: any) => js.skill_type === "R")
          .map((js: any) => {
            const skill = allSkills.find((s) => s.skill_id === js.skill_ids);
            return skill || { skill_id: js.skill_ids, skill_name: "Unknown Skill" };
          });
        setRequiredSkills(reqSkills);

        const prefSkills = data.jobs_Skills
          .filter((js: any) => js.skill_type === "P")
          .map((js: any) => {
            const skill = allSkills.find((s) => s.skill_id === js.skill_ids);
            return skill || { skill_id: js.skill_ids, skill_name: "Unknown Skill" };
          });
        setPreferredSkills(prefSkills);
      } catch (error: any) {
        console.error("Error loading job details:", error);
        setError(error.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (user && jobId) loadJob();
  }, [jobId, user]); 

  const handleApply = async () => {
    if (!user) {
      notify.error("User not authenticated.");
      return;
    }
    if (!user.token) {
      notify.error("User token not found.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        candidate_id: user.userId,
        job_id: parseInt(jobId),
      };

      await applyForJobByCandidate(payload, user.email ,user.token);

      notify.success("Applied successfully!");
      setApplied(true); 
    } catch (error: any) {
      console.error("Error applying for job:", error);
      notify.error(error.message || "Failed to apply for job.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Card className="w-full h-full p-4 flex justify-center items-center border-none bg-gray-50">
        <Atom color="#000000" size="medium" text="Loading..." textColor="" />
      </Card>
    );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          onClick={onBack}
          className="bg-gray-600 text-white hover:bg-gray-800"
        >
          Back
        </Button>
      </div>
    );
  }

  if (!job)
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-gray-600 mb-4">Job not found.</p>
        <Button
          onClick={onBack}
          className="bg-[#004080] text-white hover:bg-[#005c8b]"
        >
          Back to Jobs
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 w-full min-h-screen sm:p-6">
      <Card className="w-full max-w-4xl border border-gray-200 shadow-lg rounded-lg bg-white">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-[#004080] text-center sm:text-left break-words">
            {job.job_title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 sm:space-y-8">
          {/* Description */}
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
            <pre className="whitespace-pre-wrap break-words text-gray-700 leading-relaxed bg-white border border-gray-200 rounded-md p-3 sm:p-4 overflow-y-auto max-h-[50vh] text-sm sm:text-base">
              {job.job_description}
            </pre>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Required Skills
            </h3>
            {requiredSkills.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                {requiredSkills.map((skill) => (
                  <li key={skill.skill_id}>{skill.skill_name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">
                No required skills listed.
              </p>
            )}
          </div>

          {/* Preferred Skills */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Preferred Skills
            </h3>
            {preferredSkills.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm sm:text-base">
                {preferredSkills.map((skill) => (
                  <li key={skill.skill_id}>{skill.skill_name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic text-sm sm:text-base">
                No preferred skills listed.
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Status</h3>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200 text-sm sm:text-base">
              <p>
                <strong>Status:</strong> {job.status.status}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
          <Button
            onClick={onBack}
            className="w-full sm:w-auto bg-gray-600 text-white hover:bg-gray-800 transition-colors"
          >
            Back to Jobs
          </Button>

          {!applied ? (
            <Button
              onClick={handleApply}
              className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-800 transition-colors"
            >
              Apply
            </Button>
          ) : (
            <div className="text-gray-600 font-medium flex items-center justify-center w-full sm:w-auto">
              Already Applied
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}