// components/ProjectTable.tsx (or wherever it resides)

'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
// Removed Checkbox import
import { Badge } from '@/components/ui/badge'; // Added Badge
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import SawLoader from '@/components/ui/loader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProjectStatusEnum, ProjectStatusLabels, ProjectTypeLabels } from '@/constants/enums/project.enums'; // Assuming ProjectStatusEnum exists for variant mapping
import { Project } from '@/constants/models/object.types'; // Adjust path as needed
import { APP_ROUTES } from '@/constants/routes'; // Adjust path
import { useGetProjects } from '@/hooks/api/projects.queries'; // Adjust path
import { format } from 'date-fns'; // For formatting dates
import { ArrowUpDown, ChevronDown, FolderOpen, Inbox } from 'lucide-react'; // Added Inbox

// Helper function for status badge variant (similar to admin side)
// !!! Adjust based on your actual ProjectStatusEnum/Labels and desired colors !!!
const getProjectStatusVariant = (
  status: number | string,
): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' => {
  // Example mapping - replace with your logic
  const statusStr = String(status); // Handle potential number keys
  if (status === ProjectStatusEnum.Completed || statusStr.toLowerCase().includes('complete')) return 'success';
  if (
    status === ProjectStatusEnum.Manufacturing ||
    statusStr.toLowerCase().includes('progress') ||
    statusStr.toLowerCase().includes('manufacturing')
  )
    return 'warning';
  if (status === ProjectStatusEnum.Consultation || statusStr.toLowerCase().includes('design')) return 'info';
  if (status === ProjectStatusEnum.Archived || statusStr.toLowerCase().includes('hold')) return 'secondary';
  return 'default';
};

// Helper function for date formatting
const formatDate = (date: Date | string | null | undefined, placeholder = 'N/A'): string => {
  if (!date) return placeholder;
  try {
    return format(new Date(date), 'PP');
  } catch (error) {
    // e.g., Oct 27, 2023
    return 'Invalid Date';
  }
};

export function ProjectTable() {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'updated_at', desc: true }, // Default sort by last updated descending
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  // Removed rowSelection state
  const router = useRouter();

  // Assuming useGetProjects fetches the data needed, including updated_at, target_install_date
  const { data, isLoading } = useGetProjects(); // Added isLoading

  // Handle loading state gracefully
  const projects = React.useMemo(() => data || [], [data]);

  const columns: ColumnDef<Project>[] = [
    // Removed 'select' column
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status');
        const label = ProjectStatusLabels[status as keyof typeof ProjectStatusLabels] || `Status ${status}`;

        return <Badge className="capitalize text-xs text-white">{label}</Badge>;
      },
      enableFiltering: true, // Enable filtering for status if needed later
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const typeVal = row.getValue('type');
        return <div>{ProjectTypeLabels[typeVal as keyof typeof ProjectTypeLabels] || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'target_install_date', // Added Target Install Date
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Target Install <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{formatDate(row.getValue('target_install_date'), 'Not Set')}</div>,
    },
    {
      accessorKey: 'updated_at', // Added Last Updated
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last Updated <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-xs text-muted-foreground">{formatDate(row.getValue('updated_at'))}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Button
            variant="outline" // Changed variant
            size="sm" // Standardized size
            onClick={() => {
              router.push(`${APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path}/${project?.id}`);
            }}
          >
            <FolderOpen className="mr-2 h-4 w-4" /> {/* Changed Icon */}
            View Project {/* Changed Label */}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: projects,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      // Removed rowSelection state management
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    // Removed onRowSelectionChange
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      // Set initial pagination size
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Filter and Column Visibility */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by project name..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm h-9 mt-3" // Adjusted height
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9">
              {' '}
              {/* Adjusted height */}
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide() && column.id !== 'actions') // Don't allow hiding actions
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {/* Simple way to format ID to label */}
                  {column.id.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? ( // Loading state for table body
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <SawLoader className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'} // Keep data-state even without checkbox
                  className="cursor-pointer hover:bg-muted/50" // Add hover effect
                  onClick={() => router.push(`${APP_ROUTES.DASHBOARD.PROJECTS.PROJECTS.path}/${row.original.id}`)} // Make row clickable
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      // Prevent action cell from triggering row click
                      onClick={(e) => {
                        if (cell.column.id === 'actions') e.stopPropagation();
                      }}
                      style={cell.column.id === 'actions' ? { width: cell.column.getSize() } : {}}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Enhanced Empty State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Inbox className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-semibold">No Projects Found</h3>
                    <p className="text-sm text-muted-foreground">You haven't created any projects yet.</p>
                    {/* Optional: Add create button if relevant here */}
                    {/* <Button size="sm" className="mt-4">Create New Project</Button> */}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        {/* Removed Row Selection Count Text */}
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
