import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

import type { CandidateListDto } from "@/interfaces/Candidate_interface";


export const candidateApplicationListColumns: ColumnDef<CandidateListDto>[] = [
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
        <Link to={`/company/dashboard/shortlist-candidate/${candidate.candidate_id}`}>
          <Button size="sm" className="cursor-pointer bg-gray-600 text-white hover:bg-gray-800 duration-300">
            View Details
          </Button>
        </Link>
      );
    },
  },
];