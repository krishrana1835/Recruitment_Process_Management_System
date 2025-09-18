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
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`profile/${row.getValue("user_id")}`} className="flex items-center gap-2 w-full">
                <MdOutlinePreview className="h-5 w-5" />
                View User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`profile/${row.getValue("user_id")}`} className="flex items-center gap-2 w-full">
                <FaRegEdit className="h-5 w-5" />
                Update User
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-2">
              <MdOutlineDelete className="h-5 w-5" />
              Delete User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
              className="cursor-pointer flex items-center gap-2"
            >
              <MdContentCopy className="h-5 w-5" />
              Copy Email ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const interviewFeedbackColumns: ColumnDef<Interview_FeedbackDto>[] = [
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
    accessorKey: "feedback_id",
    header: "Feedback ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("feedback_id")}</div>
    ),
  },
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
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="truncate max-w-xs">{row.getValue("comments")}</div>
    ),
  },
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
  {
    accessorKey: "interview_id",
    header: "Interview ID",
  },
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
              <Link to={`/feedback/${feedbackId}`} className="flex items-center gap-2 w-full">
                <MdOutlinePreview className="h-5 w-5" />
                View Feedback
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`/feedback/edit/${feedbackId}`} className="flex items-center gap-2 w-full">
                <FaRegEdit className="h-5 w-5" />
                Update Feedback
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-2">
              <MdOutlineDelete className="h-5 w-5" />
              Delete Feedback
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const candidateReviewColumns: ColumnDef<Candidate_ReviewDto>[] = [
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
    accessorKey: "review_id",
    header: "Review ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("review_id")}</div>
    ),
  },
  {
    accessorKey: "candidate_name",
    header: "Candidate Name",
  },
  {
    accessorKey: "reviewer_name",
    header: "Reviewer Name",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "review_date",
    header: "Review Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("review_date"));
      const formattedDate = date.toLocaleDateString();
      return <div>{formattedDate}</div>
    }
  },
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
              <Link to={`/review/${reviewId}`} className="flex items-center gap-2 w-full">
                <MdOutlinePreview className="h-5 w-5" />
                View Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`/review/edit/${reviewId}`} className="flex items-center gap-2 w-full">
                <FaRegEdit className="h-5 w-5" />
                Update Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-2">
              <MdOutlineDelete className="h-5 w-5" />
              Delete Review
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const jobStatusColumns: ColumnDef<Jobs_StatusDto>[] = [
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
    accessorKey: "status_id",
    header: "Status ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("status_id")}</div>
    ),
  },
  {
    accessorKey: "status_name",
    header: "Status Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const statusId = row.original.status_id;

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
              <Link to={`/status/${statusId}`} className="flex items-center gap-2 w-full">
                <MdOutlinePreview className="h-5 w-5" />
                View Status
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`/status/edit/${statusId}`} className="flex items-center gap-2 w-full">
                <FaRegEdit className="h-5 w-5" />
                Update Status
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-2">
              <MdOutlineDelete className="h-5 w-5" />
              Delete Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const jobsColumns: ColumnDef<JobDto>[] = [
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
    accessorKey: "job_id",
    header: "Job ID",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.getValue("job_id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: "Job Title",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
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
              <Link to={`/job/${jobId}`} className="flex items-center gap-2 w-full">
                <MdOutlinePreview className="h-5 w-5" />
                View Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Link to={`/job/edit/${jobId}`} className="flex items-center gap-2 w-full">
                <FaRegEdit className="h-5 w-5" />
                Update Job
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" className="cursor-pointer flex items-center gap-2">
              <MdOutlineDelete className="h-5 w-5" />
              Delete Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]