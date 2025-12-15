import { useEffect, useState } from "react";
import CandidateProfileView from "../Admin/CandidateProfileView";
import { notify } from "@/components/custom/Notifications";
import { useParams } from "react-router-dom";
import { useAuth } from "@/route_protection/AuthContext";
import { Button } from "@/components/ui/button";
import type {
  CandidateStatus,
  ChangeCandidateStatusDto,
} from "@/interfaces/Candidate_Status_History_interface";
import { updateCandidateStatus } from "@/api/Candidate_Status_History_api";
import { Card } from "@/components/ui/card";
import { Atom } from "react-loading-indicators";
import { getCandidateDashProfile } from "@/api/Candidate_api";

export default function ShortListCandidate() {
  const [jobId, setJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [email, setCandidateEmail] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if(!id){
        notify.error("Candidate ID is missing.");
        return;
      }
      if(!user){
        notify.error("User not authenticated.");
        return;
      }
      if(!user.token){
        notify.error("User token not found.");
        return;
      }
      try {
      const storedId = sessionStorage.getItem("currentJobId");
      if (!storedId) throw new Error("Job ID is missing in session storage.");
      setJobId(parseInt(storedId) || null);

      const response = await getCandidateDashProfile(id, user?.token);
      setCandidateEmail(response.email)
    } catch (error) {
      notify.error(
        "Unable to retrieve Job ID. Please navigate from the job applications list."
      );
      console.error("Error retrieving Job ID from session storage:", error);
    }
    }
    fetchData()
  }, []);

  // --- Handle Status Change ---
  const handleStatusChange = async (status: keyof typeof CandidateStatus) => {
    if (!id || !jobId) {
      notify.error("Candidate or Job ID is missing.");
      return;
    }

    if (!user?.token || !user?.userId) {
      notify.error("User authentication info missing.");
      return;
    }

    setLoading(true);
    try {
      const dto: ChangeCandidateStatusDto = {
        candidate_id: id,
        job_id: jobId,
        status,
        reason: "Candidate is shortlisted for job",
        changed_by: user.userId,
      };

      await updateCandidateStatus(dto,email, user.token);
      notify.success(`Candidate status updated to "${status}".`);
    } catch (error: any) {
      console.error("Error updating status:", error);
      notify.error(error.message || "Failed to update candidate status.");
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

  return (
    <>
      <CandidateProfileView
        allowUpdate={false}
        tabs={["Reviews", "Skills", "Status History"]}
      />
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        {/* Buttons Section */}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            disabled={loading}
            onClick={() => handleStatusChange("Shortlisted")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Updating..." : "Accept"}
          </Button>

          <Button
            disabled={loading}
            onClick={() => handleStatusChange("Rejected")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Updating..." : "Reject"}
          </Button>

          <Button
            disabled={loading}
            onClick={() => handleStatusChange("Applied")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {loading ? "Updating..." : "Pending"}
          </Button>
        </div>
      </div>
    </>
  );
}
