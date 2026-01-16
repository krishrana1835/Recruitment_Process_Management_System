import { getShortlistedCandidates } from "@/api/Interview_api";
import ListManager from "@/components/custom/ListManager";
import { Button } from "@/components/ui/button";
import type { CreateBulkCandidate } from "@/interfaces/Candidate_interface";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const doc_url = import.meta.env.VITE_DOCUMENT_URL;

export const columns: ColumnDef<CreateBulkCandidate>[] = [
  {
    accessorKey: "candidate_id",
    header: "Candidate ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("candidate_id")}
      </div>
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => <div>{row.getValue("phone")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original;

      return (
        <Link to={doc_url+candidate.resume_path}>
          <Button size="sm" className="cursor-pointer bg-gray-600 text-white hover:bg-gray-800 duration-300">
            View Resume
          </Button>
        </Link>
      );
    },
  },
];

export default function ShortlistedCandidates() {
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
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-semibold text-gray-800">
        Shortlisted Candidates for:{" "}
        <span className="capitalize">{decodeURIComponent(job_title)}</span>
      </h2>
      <ListManager<CreateBulkCandidate>
        fetchFunction={getShortlistedCandidates}
        addLink=""
        fetchArgs={[Number(job_id)]}
        columns={columns}
        addButton={false}
      />
    </div>
  );
}
