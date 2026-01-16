import { getScheduledJobs } from "@/api/Job_api";
import ListManager from "@/components/custom/ListManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link
              to={`/company/dashboard/manage-employee/jobs/selected/${job.job_id}`}
            >
              Selected Candidates
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link
              to={`/company/dashboard/manage-employee/jobs/employee/${job.job_id}`}
            >
              Employees
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export default function ListJobemployeeManage() {
  return (
    <Card className="w-full min-h-full">
      <CardTitle className="text-3xl font-semibold mx-auto">
        Upload Offer Latter
      </CardTitle>
      <CardContent className="w-full">
        <ListManager<ListAllJobsDto>
          fetchFunction={getScheduledJobs}
          fetchArgs={["Scheduled"]}
          addLink=""
          columns={jobListDocVerification}
          addButton={false}
        />
      </CardContent>
    </Card>
  );
}
