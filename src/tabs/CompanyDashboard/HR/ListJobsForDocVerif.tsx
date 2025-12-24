import { getAllJobs } from "@/api/Job_api";
import ListManager from "@/components/custom/ListManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

const jobListDocVerification: ColumnDef<ListAllJobsDto>[] = [
  {
    accessorKey: "job_id",
    header: "Job ID",
  },
  {
    accessorKey: "job_title",
    header: "Job Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusObj = row.getValue("status") as ListAllJobsDto["status"];
      return <div className="capitalize">{statusObj?.status || "Unknown"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const created = row.getValue("created_at") as string;
      const date = new Date(created).toLocaleString().split(",")[0];
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "scheduled",
    header: "Scheduled",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <Button asChild size="sm">
          <Link
            to={`/company/dashboard/candidate-doc-verification/selected/${job.job_id}`}
          >
            Selected Candidates
          </Link>
        </Button>
      );
    },
  },
];

export default function ListJobsDocVerification() {
  return (
    <Card className="w-full h-full flex justify-center">
      <CardContent className="w-full">
        <ListManager<ListAllJobsDto>
          fetchFunction={getAllJobs}
          addLink=""
          columns={jobListDocVerification}
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
