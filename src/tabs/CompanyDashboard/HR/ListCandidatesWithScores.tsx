import { getCandidatesWithScore } from "@/api/RatingCard_api";
import ListManager from "@/components/custom/ListManager";
import { useNavigate, useParams } from "react-router-dom";
import type { CandidateDto } from "@/interfaces/Candidate_interface";
// import { Button } from "@/components/ui/button";
// import { Check, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
// import { useAuth } from "@/route_protection/AuthContext";
// import { updateInterviewStatus } from "@/api/Interview_api";
// import { notify } from "@/components/custom/Notifications";
// import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CandidatesWithScores {
  interview_id: number;
  score: number;
  status: string;
  candidate: CandidateDto;
}

export default function ListCandidatesWithScores() {
  const { jobId, roundNumber } = useParams<{
    jobId: string;
    roundNumber: string;
  }>();
  const JobIdNum = Number(jobId);
  const nevigate = useNavigate();
  // const { user } = useAuth();

  // const [statusMap, setStatusMap] = useState<Record<number, string>>({});

  // const handleStatusChange = async (
  //   candidate: CandidatesWithScores,
  //   newStatus: "Selected" | "Rejected"
  // ) => {
  //   const oldStatus =
  //     statusMap[candidate.interview_id] ?? candidate.status ?? "";

  //   if (oldStatus === newStatus) return;

  //   if (!user?.token) {
  //     notify.error("Session Expired", "Please login again");
  //     return;
  //   }

  //   try {
  //     await updateInterviewStatus(
  //       { interview_id: candidate.interview_id, status: newStatus },
  //       user.token
  //     );
  //     notify.success("Status Change", `Candidate ${newStatus} Successfully`);

  //     setStatusMap((prev) => ({
  //       ...prev,
  //       [candidate.interview_id]: newStatus,
  //     }));
  //   } catch (err: any) {
  //     notify.error("Error", err.message);
  //   }
  // };

  const columns: ColumnDef<CandidatesWithScores>[] = [
    { accessorKey: "candidate.candidate_id", header: "Candidate ID" },
    { accessorKey: "candidate.full_name", header: "Full Name" },
    { accessorKey: "candidate.email", header: "Email" },
    { accessorKey: "score", header: "Score" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            className={`${
              status == "Rejected"
                ? "bg-red-500 text-white"
                : status == "Selected"
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            } p-2`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const candidate = row.original;
        return (
          <Button
            onClick={() =>
              nevigate(
                `/company/dashboard/list-interview-round/candidates/overall-rating-card/${JobIdNum}/${roundNumber}/${candidate.candidate.candidate_id}`
              )
            }
          >
            Rating Card
          </Button>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     const candidate = row.original;
    //     const currentStatus =
    //       statusMap[candidate.interview_id] ?? candidate.status ?? "";

    //     return (
    //       <div className="flex items-center gap-2">
    //         {currentStatus === "Selected" ? (
    //           <Button
    //             size="icon"
    //             variant="destructive"
    //             onClick={() => handleStatusChange(candidate, "Rejected")}
    //           >
    //             <X className="h-4 w-4" />
    //           </Button>
    //         ) : (
    //           <Button
    //             size="icon"
    //             variant={"default"}
    //             onClick={() => handleStatusChange(candidate, "Selected")}
    //           >
    //             <Check className="h-4 w-4" />
    //           </Button>
    //         )}
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <Card className="w-full h-full p-6">
      <CardTitle>
        <h1>Candidate Scores</h1>
      </CardTitle>
      <CardContent>
        <ListManager<CandidatesWithScores>
          fetchFunction={getCandidatesWithScore}
          fetchArgs={[{ job_id: JobIdNum, round_number: roundNumber }]}
          addLink=""
          columns={columns}
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
