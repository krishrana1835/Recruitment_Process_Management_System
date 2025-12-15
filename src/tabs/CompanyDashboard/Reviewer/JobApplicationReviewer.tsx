import { getAllJobApplications } from "@/api/Candidate_Status_History_api";
import { candidateApplicationListColumns } from "@/components/custom/columns2";
import ListManager from "@/components/custom/ListManager";
import type { CandidateListDto } from "@/interfaces/Candidate_interface";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function JobApplicationReviewer() {
  const { job_title, job_id } = useParams<{
    job_title: string;
    job_id: string;
  }>();

  if (!job_id || !job_title) {
    return (
      <div className="flex items-center justify-center text-red-600 h-full w-full">
        Job title or ID is missing in the URL.
      </div>
    );
  }

  const jobId = parseInt(job_id);

  useEffect(() => {
    sessionStorage.removeItem("currentJobId");
    sessionStorage.setItem("currentJobId", job_id);
  }, []);

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Applications for:{" "}
        <span className="capitalize">{decodeURIComponent(job_title)}</span>
      </h2>

      <ListManager<CandidateListDto>
        fetchFunction={getAllJobApplications}
        fetchArgs={[jobId]}
        addLink=""
        columns={candidateApplicationListColumns}
        addButton={false}
      />
    </div>
  );
}
