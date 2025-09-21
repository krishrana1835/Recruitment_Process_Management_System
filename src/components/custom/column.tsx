import type { UsersList } from "@/interfaces/User_interface";
import type { ColumnDef } from "@tanstack/react-table";
import type { RoleDto } from "@/interfaces/Roles_interface";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  MdContentCopy,
  MdOutlineDelete,
  MdOutlinePreview,
} from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router-dom";
import type { Interview_FeedbackDto } from "@/interfaces/Interview_Feedbacks_interface";
import type { Candidate_ReviewDto } from "@/interfaces/Candidate_Review_interface";
import type { Jobs_StatusDto } from "@/interfaces/Jobs_Status_interface";
import type { JobDto } from "@/interfaces/Jobs_interface";

// Column definitions for the user list table
export const userListColumns: ColumnDef<UsersList>[] = [
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("user_id")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      if (column.getCanSort()) {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown /> {/* Sorting icon */}
          </Button>
        );
      } else {
        return "Role";
      }
    },
    cell: ({ row }) => {
      const roles: RoleDto[] = row.getValue("role");
      return (
        <div className="capitalize">
          {roles.map((r) => r.role_name).join(", ")}{" "}
          {/* Display role names separated by commas */}
        </div>
      );
    },
    enableColumnFilter: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal /> {/* Three dots icon for more options */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Dropdown menu items for user actions */}
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/users/profile/view/${row.getValue(
                  "user_id"
                )}`}
                className="flex flex-row"
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/users/profile/update/${row.getValue(
                  "user_id"
                )}`}
                className="flex flex-row"
              >
                <FaRegEdit className="size-5 mr-2" />
                Update User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <Link
                to={`/company/dashboard/users/delete/${row.getValue(
                  "user_id"
                )}`}
                className="flex flex-row"
              >
                <MdOutlineDelete className="size-5 mr-2" />
                Delete User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
              className="cursor-pointer"
            >
              <MdContentCopy className="size-5" /> Copy Email ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Column definitions for the interview feedback table
export const interviewFeedbackColumns: ColumnDef<Interview_FeedbackDto>[] = [
  // Feedback ID Column
  {
    accessorKey: "feedback_id",
    header: "Feedback ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("feedback_id")}
      </div>
    ),
  },

  // Rating Column (Sortable)
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("rating")}</div>
    ),
  },

  // Comments Column
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("comments")}</div>
    ),
  },

  // Feedback Date Column (Sortable)
  {
    accessorKey: "feedback_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Feedback Date
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("feedback_at"));
      const formattedDate = date.toLocaleDateString(); // Format date for display
      return <div>{formattedDate}</div>;
    },
  },

  // Interview ID Column
  {
    accessorKey: "interview_id",
    header: "Interview ID",
  },

  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const feedbackId = row.original.feedback_id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal /> {/* Three dots icon for more options */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Dropdown menu items for feedback actions */}
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`feedback/${feedbackId}`} className="flex flex-row">
                <MdOutlinePreview className="size-5 mr-2" />
                View User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`feedback/${feedbackId}`} className="flex flex-row">
                <FaRegEdit className="size-5 mr-2" />
                Update User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <MdOutlineDelete className="size-5" /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Column definitions for the candidate review table
export const candidateReviewColumns: ColumnDef<Candidate_ReviewDto>[] = [
  // Review ID Column
  {
    accessorKey: "review_id",
    header: "Review ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("review_id")}
      </div>
    ),
  },

  // Comments Column
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      // Truncate long comments for better table layout
      <div className="truncate max-w-sm">{row.getValue("comments")}</div>
    ),
  },

  // Reviewed Date Column (Sortable)
  {
    accessorKey: "reviewed_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reviewed Date
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("reviewed_at"));
      // Formats the date to a more readable local format (e.g., "9/17/2025")
      const formattedDate = date.toLocaleDateString();
      return <div>{formattedDate}</div>;
    },
  },

  // Candidate ID Column
  {
    accessorKey: "candidate_id",
    header: "Candidate ID",
  },

  // Job ID Column
  {
    accessorKey: "job_id",
    header: "Job ID",
  },

  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const reviewId = row.original.review_id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal /> {/* Three dots icon for more options */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Dropdown menu items for review actions */}
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`review/${reviewId}`} className="flex flex-row">
                <MdOutlinePreview className="size-5 mr-2" />
                View User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`review/${reviewId}`} className="flex flex-row">
                <FaRegEdit className="size-5 mr-2" />
                Update User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <MdOutlineDelete className="size-5" /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Column definitions for the job table
export const jobColumns: ColumnDef<JobDto>[] = [
  // Job ID Column
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">
        {row.getValue("job_id")}
      </div>
    ),
  },

  // Job Title Column (Sortable)
  {
    accessorKey: "job_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("job_title")}</div>
    ),
  },

  // Description Column
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="truncate max-w-md">{row.getValue("description")}</div>
    ),
  },

  // Status Column (Handles nested object)
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Accessing the nested status_name property from the status object
      const status = row.getValue("status") as Jobs_StatusDto;
      return (
        <div className="font-medium capitalize">{status?.status || "N/A"}</div>
      );
    },
    // Optional: Enable filtering on this column
    filterFn: (row, id, value) => {
      const status = row.getValue(id) as Jobs_StatusDto;
      return value.includes(status?.status);
    },
  },

  // Created Date Column (Sortable)
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" /> {/* Sorting icon */}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = date.toLocaleDateString(); // Format date for display
      return <div>{formattedDate}</div>;
    },
  },

  // Actions Column
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const jobId = row.original.job_id;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal /> {/* Three dots icon for more options */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* Dropdown menu items for job actions */}
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`job/${jobId}`} className="flex flex-row">
                <MdOutlinePreview className="size-5 mr-2" />
                View User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`job/${jobId}`} className="flex flex-row">
                <FaRegEdit className="size-5 mr-2" />
                Update User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <MdOutlineDelete className="size-5" /> Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
