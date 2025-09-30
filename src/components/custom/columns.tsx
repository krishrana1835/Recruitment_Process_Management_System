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
import type { CandidateListDto, candidateSkills } from "@/interfaces/Candidate_interface";
import { Download, Trash2, Replace } from "lucide-react";
import { Badge } from "../ui/badge";
import type { CandidateDocumentDto } from "@/interfaces/Candidate_Documents_interface";
import type { InterviewDtoCandidate } from "@/interfaces/Interview_interface";
import type { CandidateStatusHistoryDto } from "@/interfaces/Candidate_Status_History_interface";

/**
 * @file This file contains column definitions for various data tables used in the application.
 * Each column definition specifies the data to be displayed, how it should be formatted, and what actions can be performed on it.
 */

/**
 * Column definitions for the user list table.
 * @type {ColumnDef<UsersList>[]} 
 */
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
                to={`/company/dashboard/users/users-data/delete/${row.getValue(
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

/**
 * Column definitions for the interview feedback table.
 * @type {ColumnDef<Interview_FeedbackDto>[]} 
 */
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
      // Using a more detailed format, but you can revert to toLocaleDateString()
      const formatted = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>;
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

/**
 * Column definitions for the candidate review table.
 * @type {ColumnDef<Candidate_ReviewDto>[]} 
 */
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

/**
 * Column definitions for the job table.
 * @type {ColumnDef<JobDto>[]} 
 */
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

/**
 * Column definitions for the candidates list table.
 * @type {ColumnDef<CandidateListDto>[]} 
 */
export const candidateListColumns: ColumnDef<CandidateListDto>[] = [
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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      // Using a more detailed format, but you can revert to toLocaleDateString()
      const formatted = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidate = row.original;

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
                to={`/company/dashboard/candidates/profile/view/${candidate.candidate_id}`}
                className="flex flex-row"
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View Candidate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link
                to={`/company/dashboard/candidates/profile/update/${candidate.candidate_id}`}
                className="flex flex-row"
              >
                <FaRegEdit className="size-5 mr-2" />
                Update Candidate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" variant="destructive">
              <Link
                to={`/company/dashboard/candidates/candidates-data/delete/${candidate.candidate_id}`}
                className="flex flex-row"
              >
                <MdOutlineDelete className="size-5 mr-2" />
                Delete Candidate
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(candidate.email)}
              className="cursor-pointer"
            >
              <MdContentCopy className="size-5" /> Copy Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Column definitions for the candidate documents table.
 * @type {ColumnDef<CandidateDocumentDto>[]} 
 */
export const documentColumns: ColumnDef<CandidateDocumentDto>[] = [
  {
    accessorKey: "document_type",
    header: "Document Type",
    cell: ({ row }) => {
      const document = row.original;
      return (
        <a
          href={document.file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {document.document_type}
        </a>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "verification_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("verification_status") as string;

      // Determine badge variant based on status
      const getVariant = (): "default" | "secondary" | "destructive" => {
        switch (status.toLowerCase()) {
          case "verified":
            return "default"; // Greenish in default themes
          case "pending":
            return "secondary"; // Bluish/Grayish
          case "rejected":
          default:
            return "destructive"; // Red
        }
      };

      return (
        <Badge variant={getVariant()} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "uploaded_at",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Uploaded At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("uploaded_at"));
      // Using a more detailed format, but you can revert to toLocaleDateString()
      const formatted = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "download",
    header: () => <div className="text-right">Download</div>,
    cell: ({ row }) => {
      const document = row.original;
      return (
        <div className="text-right">
          <Button asChild variant="ghost" size="icon">
            <a href={document.file_path} download>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download document</span>
            </a>
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const document = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              // onClick={() => handleReplaceDocument(document.document_id)}
            >
              <Replace className="mr-2 h-4 w-4" />
              Upload New
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              // onClick={() => handleDeleteDocument(document.document_id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Column definitions for the candidate reviews table.
 * @type {ColumnDef<Candidate_ReviewDto>[]} 
 */
export const reviewColumns: ColumnDef<Candidate_ReviewDto>[] = [
  {
    accessorKey: "review_id",
    header: "ID",
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="w-[300px] whitespace-normal">
        {row.getValue("comments")}
      </div>
    ),
  },
  {
    accessorKey: "job",
    header: "Job Title",
    cell: ({ row }) => {
      const job = row.getValue("job") as JobDto;
      return <div className="capitalize">{job?.job_title || "N/A"}</div>;
    }
  },
  {
    accessorKey: "user_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Reviewer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "reviewed_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("reviewed_at"));
      const formatted = date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const review = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              // onClick={() => handleUpdateReview(review.review_id)}
            >
              <FaRegEdit className="size-5 mr-2" />
              Update Review
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              // onClick={() => handleDeleteReview(review.review_id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/**
 * Column definitions for the candidate skills table.
 * @type {ColumnDef<candidateSkills>[]} 
 */
export const candidateSkillColumns: ColumnDef<candidateSkills>[] = [
  {
    // Accessor function is needed for nested data
    accessorFn: (row) => row.skill.skill_name,
    id: "skill_name", // A unique ID is required when using an accessor function
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Skill Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.skill.skill_name}</div>
  },
  {
    accessorKey: "years_experience",
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Years of Experience
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
        const years = row.getValue("years_experience");
        return <div className="text-center">{`${years} years`}</div>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const candidateSkill = row.original;

      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                className="cursor-pointer"
                // onClick={() => handleUpdateSkill(candidateSkill.candidate_skill_id)}
                >
                <FaRegEdit className="size-5 mr-2" />
                Update Skill
                </DropdownMenuItem>
                <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                // onClick={() => handleDeleteSkill(candidateSkill.candidate_skill_id)}
                >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Skill
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];

/**
 * Column definitions for the candidate interviews table.
 * @type {ColumnDef<InterviewDtoCandidate>[]} 
 */
export const candidateInterviewColumns: ColumnDef<InterviewDtoCandidate>[] = [
  {
    accessorKey: "interview_id",
    header: "Interview ID",
  },
  {
    // Accessor function for nested data
    accessorFn: (row) => row.job.job_title,
    id: "job_title", // Unique ID for the column
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Job Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
     cell: ({ row }) => <div className="font-medium">{row.original.job.job_title}</div>
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const interview = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                // onClick={() => handleViewInterview(interview.interview_id)}
              >
                <MdOutlinePreview className="size-5 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                // onClick={() => handleCancelInterview(interview.interview_id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel Interview
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

/**
 * Column definitions for the candidate status history table.
 * @type {ColumnDef<CandidateStatusHistoryDto>[]} 
 */
export const candidateStatusHistoryColumns: ColumnDef<CandidateStatusHistoryDto>[] = [
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            
            const getVariant = (): "default" | "secondary" | "destructive" | "outline" => {
                switch (status.toLowerCase()) {
                    case "hired":
                    case "offered":
                        return "default"; // Green
                    case "interviewing":
                    case "screening":
                        return "secondary"; // Blue/Gray
                    case "applied":
                        return "outline"; // Bordered
                    default:
                        return "destructive"; // Red (for Rejected, etc.)
                }
            };

            return (
                <Badge variant={getVariant()} className="capitalize">
                    {status}
                </Badge>
            );
        }
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => <div className="w-[300px] whitespace-normal">{row.getValue("reason")}</div>
    },
    {
        accessorKey: "changed_at",
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("changed_at"));
            const formatted = date.toLocaleDateString("en-US", {
                year: 'numeric', month: 'short', day: 'numeric'
            });
            return <div className="font-medium">{formatted}</div>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
          const statusHistory = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    // onClick={() => handleUpdateStatusReason(statusHistory.candidate_status_id)}
                  >
                    <FaRegEdit className="mr-2 h-4 w-4" />
                    Update Reason
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    // onClick={() => handleDeleteStatusRecord(statusHistory.candidate_status_id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Record
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
];