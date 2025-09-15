import type { UsersList } from "@/interfaces/User_interface"
import type { ColumnDef } from "@tanstack/react-table"
import type { Roles } from "@/interfaces/Roles_interface"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { MdContentCopy, MdOutlineDelete, MdOutlinePreview } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Link } from "react-router-dom";

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
      const roles: Roles[] = row.getValue("role")
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