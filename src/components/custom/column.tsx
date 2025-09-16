import type { UsersList } from "@/interfaces/User_interface"
import type { ColumnDef } from "@tanstack/react-table"
import type { RoleDto } from "@/interfaces/Roles_interface"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { MdContentCopy, MdOutlineDelete, MdOutlinePreview } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Link } from "react-router-dom";
import type { Interview_FeedbackDto } from "@/interfaces/Interview_Feedbacks_interface"
import type { Candidate_ReviewDto } from "@/interfaces/Candidate_Review_interface"
import type { Jobs_StatusDto } from "@/interfaces/Jobs_Status_interface"
import type { JobDto } from "@/interfaces/Jobs_interface"

export const userListColumns: ColumnDef<UsersList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("user_id")}</div>
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
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
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
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roles: RoleDto[] = row.getValue("role")
      return (
        <div className="capitalize">
          {roles.map((r) => r.role_name).join(", ")}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuItem className="cursor-pointer"><Link to={`profile/${row.getValue("user_id")}`} className="flex flex-row"><MdOutlinePreview className="size-5 mr-2"/>View User</Link></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer"><Link to={`profile/${row.getValue("user_id")}`} className="flex flex-row"><FaRegEdit className="size-5 mr-2"/>Update User</Link></DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer"><MdOutlineDelete className="size-5"/> Delete User</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
              className="cursor-pointer"
            >
              <MdContentCopy className="size-5"/> Copy Email ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const interviewFeedbackColumns: ColumnDef<Interview_FeedbackDto>[] = [
  // 1. Select Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Feedback ID Column
  {
    accessorKey: "feedback_id",
    header: "Feedback ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("feedback_id")}</div>
    ),
  },

  // 3. Rating Column (Sortable)
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("rating")}</div>,
  },

  // 4. Comments Column
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("comments")}</div>
    ),
  },

  // 5. Feedback Date Column (Sortable)
  {
    accessorKey: "feedback_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Feedback Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("feedback_at"));
        const formattedDate = date.toLocaleDateString();
        return <div>{formattedDate}</div>
    }
  },

  // 6. Interview ID Column
  {
    accessorKey: "interview_id",
    header: "Interview ID",
  },
  
  // 7. Actions Column
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
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/feedback/${feedbackId}`} className="flex items-center w-full">
                    <MdOutlinePreview className="mr-2 h-5 w-5" />
                    View Feedback
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/feedback/edit/${feedbackId}`} className="flex items-center w-full">
                    <FaRegEdit className="mr-2 h-5 w-5" />
                    Update Feedback
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">
                <MdOutlineDelete className="mr-2 h-5 w-5" /> 
                Delete Feedback
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const candidateReviewColumns: ColumnDef<Candidate_ReviewDto>[] = [
  // 1. Select Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Review ID Column
  {
    accessorKey: "review_id",
    header: "Review ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("review_id")}</div>
    ),
  },

  // 3. Comments Column
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
        // Truncate long comments for better table layout
        <div className="truncate max-w-sm">{row.getValue("comments")}</div>
    ),
  },

  // 4. Reviewed Date Column (Sortable)
  {
    accessorKey: "reviewed_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reviewed Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("reviewed_at"));
        // Formats the date to a more readable local format (e.g., "9/17/2025")
        const formattedDate = date.toLocaleDateString();
        return <div>{formattedDate}</div>
    }
  },

  // 5. Candidate ID Column
  {
    accessorKey: "candidate_id",
    header: "Candidate ID",
  },
  
  // 6. Job ID Column
  {
    accessorKey: "job_id",
    header: "Job ID",
  },

  // 7. Actions Column
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
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/reviews/${reviewId}`} className="flex items-center w-full">
                    <MdOutlinePreview className="mr-2 h-5 w-5" />
                    View Review
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/reviews/edit/${reviewId}`} className="flex items-center w-full">
                    <FaRegEdit className="mr-2 h-5 w-5" />
                    Update Review
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-500">
                <MdOutlineDelete className="mr-2 h-5 w-5" /> 
                Delete Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const jobColumns: ColumnDef<JobDto>[] = [
  // 1. Select Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2. Job ID Column
  {
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("job_id")}</div>
    ),
  },

  // 3. Job Title Column (Sortable)
  {
    accessorKey: "job_title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Job Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("job_title")}</div>,
  },

  // 4. Description Column
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
        <div className="truncate max-w-md">{row.getValue("description")}</div>
    ),
  },

  // 5. Status Column (Handles nested object)
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        // Accessing the nested status_name property from the status object
        const status = row.getValue("status") as Jobs_StatusDto;
        return <div className="font-medium capitalize">{status?.status || "N/A"}</div>
    },
    // Optional: Enable filtering on this column
    filterFn: (row, id, value) => {
      const status = row.getValue(id) as Jobs_StatusDto;
      return value.includes(status?.status);
    },
  },

  // 6. Created Date Column (Sortable)
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const formattedDate = date.toLocaleDateString();
        return <div>{formattedDate}</div>
    }
  },
  
  // 7. Actions Column
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
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/jobs/${jobId}`} className="flex items-center w-full">
                    <MdOutlinePreview className="mr-2 h-5 w-5" />
                    View Job
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
                <Link to={`/jobs/edit/${jobId}`} className="flex items-center w-full">
                    <FaRegEdit className="mr-2 h-5 w-5" />
                    Update Job
                </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-500">
                <MdOutlineDelete className="mr-2 h-5 w-5" /> 
                Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]