import { UpdateUploadStatus } from "@/api/CandidateDocument_api";
import { GetSelectedCandidates } from "@/api/DocVerification_api";
import DocumentListModal from "@/components/custom/DocumentListModal";
import ListManager from "@/components/custom/ListManager";
import { notify } from "@/components/custom/Notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SelectedCandidatesDto } from "@/interfaces/Candidate_interface";
import { useAuth } from "@/route_protection/AuthContext";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function SelectedCandidates() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();

  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );

  const handleStatusChange = async (candidate_id: string, status: boolean) => {
    if (!user?.token) {
      notify.error("Session error", "Please login again");
      return;
    }

    try {
      await UpdateUploadStatus(
        { candidate_id, doc_upload: status },
        user.token
      );

      setStatusMap((prev) => ({
        ...prev,
        [candidate_id]: status,
      }));
    } catch (err: any) {
      notify.error("Error", err.message || "Something went wrong");
    }
  };

  const jobListDocVerification: ColumnDef<SelectedCandidatesDto>[] = [
    {
      accessorKey: "candidate_id",
      header: "Candidate ID",
    },
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "doc_upload",
      header: "Allow to Upload",
      cell: ({ row }) => {
        const candidate = row.original;

        const currentStatus =
          statusMap[candidate.candidate_id] ?? candidate.doc_upload ?? false;

        return (
          <Button
            size="sm"
            className="cursor-pointer"
            onClick={() =>
              handleStatusChange(candidate.candidate_id, !currentStatus)
            }
            disabled={user?.role === "Viewer"}
          >
            {currentStatus ? "Don't Allow" : "Allow"}
          </Button>
        );
      },
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const candidate = row.original;

        return (
          <Button
            size="sm"
            onClick={() => {
              setSelectedCandidate(candidate.candidate_id);
              setOpenModal(true);
            }}
          >
            List Documents
          </Button>
        );
      },
    },
  ];

  return (
    <Card className="w-full h-full">
      <CardContent className="w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Selected Candidates
        </h1>

        <ListManager<SelectedCandidatesDto>
          fetchFunction={GetSelectedCandidates}
          fetchArgs={[Number(jobId)]}
          addLink=""
          columns={jobListDocVerification}
          addButton={false}
        />

        {selectedCandidate && (
          <DocumentListModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            candidateId={selectedCandidate}
          />
        )}
      </CardContent>
    </Card>
  );
}
