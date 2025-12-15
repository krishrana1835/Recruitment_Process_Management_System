import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import {
  MdOutlinePreview,
  MdOutlineDelete,
  MdAdd,
  MdFormatListBulleted,
} from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import type { ListAllJobsDto } from "@/interfaces/Jobs_interface";
import { AiOutlineSchedule } from "react-icons/ai";

/**
 * Column definitions for the jobs list table.
 * @type {ColumnDef<ListAllJobsDto>[]}
 */
export const jobListColumns: ColumnDef<ListAllJobsDto>[] = [
  //for Admin Job Manage Page
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("job_id")}
      </div>
    ),
  },
  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const statusObj = row.getValue("status") as ListAllJobsDto["status"];
      return <div className="capitalize">{statusObj?.status || "Unknown"}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a =
        (rowA.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      const b =
        (rowB.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      return a.localeCompare(b);
    },
    // 👇 add this
    filterFn: (row, columnId, filterValue) => {
      const statusObj = row.getValue(columnId) as { status?: string };
      const statusText = statusObj?.status?.toLowerCase() ?? "";
      return statusText.includes(filterValue.toLowerCase());
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/jobs/view/${job.job_id}`}
                className="flex flex-row"
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/jobs/update/${job.job_id}`}
                className="flex flex-row"
              >
                <FaRegEdit className="size-5 mr-2" />
                Update Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <Link
                to={`/company/dashboard/users/jobs-data/delete/${row.getValue(
                  "job_id"
                )}`}
                className="flex flex-row"
              >
                <MdOutlineDelete className="size-5 mr-2 text-red-500" />
                Delete Job
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const jobListColumnsReviewer: ColumnDef<ListAllJobsDto>[] = [
  //for Reviewer Job Manage Page
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("job_id")}
      </div>
    ),
  },
  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const statusObj = row.getValue("status") as ListAllJobsDto["status"];
      return <div className="capitalize">{statusObj?.status || "Unknown"}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a =
        (rowA.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      const b =
        (rowB.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      return a.localeCompare(b);
    },
    // 👇 add this
    filterFn: (row, columnId, filterValue) => {
      const statusObj = row.getValue(columnId) as { status?: string };
      const statusText = statusObj?.status?.toLowerCase() ?? "";
      return statusText.includes(filterValue.toLowerCase());
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/jobs/view/${job.job_id}`}
                className="flex flex-row"
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/view-job-applications/${job.job_title}/${job.job_id}`}
                className="flex flex-row"
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View Applications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const jobListColumnsRecruiter: ColumnDef<ListAllJobsDto>[] = [
  //for Reviewer Job Manage Page
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("job_id")}
      </div>
    ),
  },
  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const statusObj = row.getValue("status") as ListAllJobsDto["status"];
      return <div className="capitalize">{statusObj?.status || "Unknown"}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a =
        (rowA.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      const b =
        (rowB.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      return a.localeCompare(b);
    },
    // 👇 add this
    filterFn: (row, columnId, filterValue) => {
      const statusObj = row.getValue(columnId) as { status?: string };
      const statusText = statusObj?.status?.toLowerCase() ?? "";
      return statusText.includes(filterValue.toLowerCase());
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scheduled
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("scheduled")}</div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/job-scheduled-add/${job.job_id}`}
                className="flex flex-row"
              >
                <MdAdd className="size-5 mr-2" />
                Add Schedule
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/list-interview-round/${job.job_id}`}
                className="flex flex-row"
              >
                <MdFormatListBulleted className="size-5 mr-2" />
                List Rounds
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer">
              <Link
                to={`/company/dashboard/delete-interview-round/${job.job_id}`}
                className="flex flex-row"
              >
                <Trash2 className="size-5 mr-2 text-red-500" />
                Delete Schedule
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const jobListColumnsInterviewer: ColumnDef<ListAllJobsDto>[] = [
  //for Reviewer Job Manage Page
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("job_id")}
      </div>
    ),
  },
  {
    accessorKey: "job_title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const statusObj = row.getValue("status") as ListAllJobsDto["status"];
      return <div className="capitalize">{statusObj?.status || "Unknown"}</div>;
    },
    sortingFn: (rowA, rowB) => {
      const a =
        (rowA.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      const b =
        (rowB.getValue("status") as ListAllJobsDto["status"])?.status ?? "";
      return a.localeCompare(b);
    },
    // 👇 add this
    filterFn: (row, columnId, filterValue) => {
      const statusObj = row.getValue(columnId) as { status?: string };
      const statusText = statusObj?.status?.toLowerCase() ?? "";
      return statusText.includes(filterValue.toLowerCase());
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Scheduled
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("scheduled")}</div>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const job = row.original;

      return (
        <Link
          to={`/company/dashboard/list-interview-round/${job.job_id}`}
          className="flex flex-row bg-gray-500 p-2 rounded-md text-white justify-center hover:bg-gray-800 hover:duration-200"
        >
          <AiOutlineSchedule className="size-5 mr-2" />
          Show Schedule
        </Link>
      );
    },
  },
];
