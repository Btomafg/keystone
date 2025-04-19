// app/admin/projects/[projectId]/_components/AdminProjectRoomsTab.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { toUSD } from '@/utils/common';
import { Eye, Loader2, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AdminRoomForm } from './AdminRoomForm'; // Import the form

// --- Placeholder Types & Data ---
interface Room {
  id: string | number;
  project_id: string | number;
  name: string;
  type: number | string; // Match form/mapping
  status?: number | string | null; // Example status
  estimate?: number | null;
  // Add other relevant fields for display
}

// DUMMY DATA - Replace with API call using useEffect and projectId prop
const DUMMY_PROJECT_ROOMS: Room[] = [
  { id: 95, project_id: 68, name: 'Upstairs Kitchen', type: 0, status: 'Design Pending', estimate: 15008.51 },
  { id: 98, project_id: 68, name: 'Bath', type: 1, status: 'Approved', estimate: 6415.58 },
  { id: 101, project_id: 68, name: 'Basement Bar', type: 5, status: 'New', estimate: 8200.0 },
];

// --- Placeholder Room Type and Status Mapping ---
// !!! Replace with your actual mappings !!!
const ROOM_TYPES_MAP: { [key: string | number]: string } = { 0: 'Kitchen', 1: 'Bathroom', 5: 'Other' };
const ROOM_STATUS_MAP: {
  [key: string | number]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' };
} = {
  'New': { label: 'New', variant: 'info' },
  'Design Pending': { label: 'Design Pending', variant: 'secondary' },
  'Approved': { label: 'Approved', variant: 'success' },
};

// --- Main Manager Component ---
interface AdminProjectRoomsTabProps {
  project: any;
  isLoading?: boolean; // Optional loading state
}

export function AdminProjectRoomsTab({ project, isLoading }: AdminProjectRoomsTabProps) {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const { toast } = useToast();
  const rooms = project?.rooms || []; // Use project data or empty array

  // --- API Call Placeholders ---
  const handleSaveRoom = async (data: Omit<Room, 'id'> | Room) => {
    console.log('API CALL: Save Room', data);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API
    // In real app: Call API, then refetch data
  };

  const handleDeleteRoom = async (id: string | number) => {
    console.log('API CALL: Delete Room', id);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API
    // Refetch data
    toast({ title: 'Success', description: 'Room deleted.' });
  };

  // --- Event Handlers ---
  const openAddDialog = () => {
    setEditingRoom(null); // Ensure not editing
    setShowFormDialog(true);
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setShowFormDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Add Button + Dialog */}
      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogTrigger asChild>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
            <DialogDescription>
              {editingRoom ? 'Update the details for this room.' : 'Define a new room within this project.'}
            </DialogDescription>
          </DialogHeader>
          <AdminRoomForm
            initialData={editingRoom}
            projectId={project?.id}
            onSave={handleSaveRoom}
            onClose={() => setShowFormDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Estimate</TableHead>
              <TableHead className="w-[180px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No rooms added to this project yet.
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => {
                const statusInfo = room.status ? ROOM_STATUS_MAP[room.status] : null;
                return (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{ROOM_TYPES_MAP[room.type] || `Type ${room.type}`}</TableCell>
                    <TableCell>
                      {statusInfo ? (
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{toUSD(room.estimate)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Link to Designer Page */}
                      <Button variant="outline" size="xs" asChild title="Open Designer/Manage Walls & Cabinets">
                        {/* Adjust href based on your routing structure */}
                        <Link href={`/admin/projects/${project.id}/designer/${room.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          {/* <span className="ml-1 hidden sm:inline">Design</span> */}
                        </Link>
                      </Button>
                      {/* Edit Room Details */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditDialog(room)}
                        title="Edit Room Details"
                      >
                        <Pencil className="h-4 w-4" /> <span className="sr-only">Edit</span>
                      </Button>
                      {/* Delete Room */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-7 w-7"
                            title="Delete Room"
                          >
                            <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            {' '}
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>{' '}
                            <AlertDialogDescription>
                              {' '}
                              This action cannot be undone. This will permanently delete the room "{room.name}" and all its associated walls
                              and cabinets.{' '}
                            </AlertDialogDescription>{' '}
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            {' '}
                            <AlertDialogCancel>Cancel</AlertDialogCancel>{' '}
                            <AlertDialogAction
                              onClick={() => handleDeleteRoom(room.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {' '}
                              Delete Room{' '}
                            </AlertDialogAction>{' '}
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
