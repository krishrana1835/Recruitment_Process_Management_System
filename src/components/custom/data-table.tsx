"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import type { VisibilityState, SortingState, ColumnDef, ColumnFiltersState,} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

// Define props for the DataTable component
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[] // Array of column definitions
  data: TData[] // Array of data objects to display in the table
}

// Generic DataTable component for displaying tabular data with sorting, filtering, and pagination
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State for managing sorting of columns
  const [sorting, setSorting] = React.useState<SortingState>([])
  // State for managing column filters
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  // State for managing column visibility
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  // State for managing row selection
  const [rowSelection, setRowSelection] = React.useState({})
  // State for the currently selected column to filter by
  const [searchCol, setSearchCol] = React.useState<string>("");

  // Initialize the React Table instance with various features
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* Dropdown for selecting a column to filter */}
        <Select onValueChange={(value) => setSearchCol(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a column" />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide() && column.getCanFilter() // Filter out columns that cannot be hidden or don't have an accessor, and exclude columns that cannot be filtered
              )
              .map((column) => {
                const header = column.columnDef.header;
                return (
                  <SelectItem key={column.id} value={column.id}>
                    {typeof header === "string"
                      ? header
                      : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
        {/* Input field for filtering data based on the selected column */}
        <Input
          placeholder="Filter values..."
          value={searchCol ? (table.getColumn(searchCol)?.getFilterValue() as string) ?? "" : ""}
          onChange={(event) =>
            searchCol && table.getColumn(searchCol)?.setFilterValue(event.target.value) // Set filter value for the selected column
          }
          className="max-w-sm mx-3"
          disabled={!searchCol} // Disable input if no column is selected for filtering
        />
        {/* Dropdown menu for toggling column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown /> {/* Icon for dropdown */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide()) // Only show columns that can be hidden
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value) // Toggle column visibility
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* Display number of selected rows */}
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* Pagination buttons */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
