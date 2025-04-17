// app/admin/settings/_components/scheduling-resources-manager.tsx
'use client';

import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Needed for Form
import { Label } from '@/components/ui/label'; // Needed for Form
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil, PlusCircle, Settings2, Trash2 } from 'lucide-react'; // Added Settings2, LinkIcon
import Link from 'next/link'; // For linking to detailed availability page
import React, { useState } from 'react';

// --- Placeholder Types & Data ---
interface Resource {
  id: string; // Assuming UUID
  name: string;
  active: boolean;
  default_slot_duration_minutes: number;
  min_booking_lead_time_hours: number;
  max_booking_range_days: number;
  // Include other fields if needed for display
}

// DUMMY DATA - Replace with API call using useEffect
const DUMMY_RESOURCES: Resource[] = [
  {
    id: '520bbcd9-389c-450c-a20d-2dcd55df99cf',
    name: 'Sales Team Calendar',
    active: true,
    default_slot_duration_minutes: 30,
    min_booking_lead_time_hours: 12,
    max_booking_range_days: 45,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-abcdef123456',
    name: 'John Doe (Consultant)',
    active: true,
    default_slot_duration_minutes: 60,
    min_booking_lead_time_hours: 24,
    max_booking_range_days: 90,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-bcdefa234567',
    name: 'Design Review Room',
    active: false,
    default_slot_duration_minutes: 45,
    min_booking_lead_time_hours: 4,
    max_booking_range_days: 30,
  },
];

// --- Reusable Form Component (ResourceForm) ---
interface ResourceFormProps {
  initialData?: Resource | null;
  onSave: (data: Omit<Resource, 'id' | 'created_at' | 'updated_at'> | Resource) => Promise<void>; // Adjust Omit based on actual create/update payload
  onClose: () => void;
}

function ResourceForm({ initialData, onSave, onClose }: ResourceFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [duration, setDuration] = useState(String(initialData?.default_slot_duration_minutes ?? '60'));
  const [leadTime, setLeadTime] = useState(String(initialData?.min_booking_lead_time_hours ?? '24'));
  const [range, setRange] = useState(String(initialData?.max_booking_range_days ?? '90'));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = {
      name,
      active,
      default_slot_duration_minutes: parseInt(duration, 10) || 60, // Provide defaults
      min_booking_lead_time_hours: parseInt(leadTime, 10) || 24,
      max_booking_range_days: parseInt(range, 10) || 90,
    };
    // Simple validation
    if (formData.default_slot_duration_minutes <= 0 || formData.min_booking_lead_time_hours < 0 || formData.max_booking_range_days <= 0) {
      toast({ title: 'Validation Error', description: 'Numeric fields must be positive.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }

    try {
      if (initialData?.id) {
        await onSave({ ...formData, id: initialData.id }); // Pass ID for update
        toast({ title: 'Success', description: 'Resource updated.' });
      } else {
        await onSave(formData); // No ID for create
        toast({ title: 'Success', description: 'Resource created.' });
      }
      onClose(); // Close dialog on success
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save resource.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="res-name">Resource Name</Label>
        <Input
          id="res-name"
          placeholder="e.g., Sales Consultant A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSaving}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="res-duration">Slot Duration (min)</Label>
          <Input
            id="res-duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="res-lead">Lead Time (hours)</Label>
          <Input
            id="res-lead"
            type="number"
            min="0"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="res-range">Booking Range (days)</Label>
          <Input
            id="res-range"
            type="number"
            min="1"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="res-active" checked={active} onCheckedChange={setActive} disabled={isSaving} />
        <Label htmlFor="res-active">Active (Available for Booking)</Label>
      </div>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Resource
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
export function SchedulingResourcesManager() {
  // Replace DUMMY_RESOURCES with state fetched from your API
  const [resources, setResources] = useState<Resource[]>(DUMMY_RESOURCES);
  const [isLoading, setIsLoading] = useState(false); // For API loading
  const [isSavingActive, setIsSavingActive] = useState<Record<string, boolean>>({}); // Loading state per switch
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const { toast } = useToast();

  // --- API Call Placeholders ---
  // Add useEffect here to fetch resources on mount

  const handleCreate = async (data: Omit<Resource, 'id'>) => {
    console.log('API CALL: Create Resource', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId = crypto.randomUUID(); // Use browser API for demo UUID
    setResources((prev) => [...prev, { ...data, id: newId }]);
  };

  const handleUpdate = async (data: Resource) => {
    console.log('API CALL: Update Resource', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResources((prev) => prev.map((res) => (res.id === data.id ? data : res)));
  };

  const handleDelete = async (id: string) => {
    console.log('API CALL: Delete Resource', id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setResources((prev) => prev.filter((res) => res.id !== id));
    toast({ title: 'Success', description: 'Resource deleted.' });
  };

  const handleToggleActive = async (resource: Resource, newActiveState: boolean) => {
    setIsSavingActive((prev) => ({ ...prev, [resource.id]: true }));
    const updatedResource = { ...resource, active: newActiveState };
    console.log('API CALL: Update Active Status', { id: resource.id, active: newActiveState });
    try {
      // Simulate update - replace with actual call
      await handleUpdate(updatedResource);
      toast({ title: 'Status Updated', description: `${resource.name} is now ${newActiveState ? 'active' : 'inactive'}.` });
    } catch (error) {
      toast({ title: 'Error', description: `Could not update status for ${resource.name}.`, variant: 'destructive' });
      // Optional: revert UI on error
    } finally {
      setIsSavingActive((prev) => ({ ...prev, [resource.id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Button + Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            {' '}
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Resource{' '}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            {' '}
            <DialogTitle>Add New Scheduling Resource</DialogTitle>{' '}
            <DialogDescription> Define a new bookable entity like a consultant or room. </DialogDescription>{' '}
          </DialogHeader>
          <ResourceForm onSave={handleCreate} onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingResource} onOpenChange={(open) => !open && setEditingResource(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            {' '}
            <DialogTitle>Edit Resource</DialogTitle>{' '}
            <DialogDescription> Update the details for this scheduling resource. </DialogDescription>{' '}
          </DialogHeader>
          <ResourceForm initialData={editingResource} onSave={handleUpdate} onClose={() => setEditingResource(null)} />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slot (min)</TableHead>
              <TableHead>Lead (hr)</TableHead>
              <TableHead>Range (d)</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No resources found.
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.default_slot_duration_minutes}</TableCell>
                  <TableCell>{resource.min_booking_lead_time_hours}</TableCell>
                  <TableCell>{resource.max_booking_range_days}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${resource.id}`}
                        checked={resource.active}
                        onCheckedChange={(checked) => handleToggleActive(resource, checked)}
                        disabled={isSavingActive[resource.id]}
                      />
                      {isSavingActive[resource.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Link/Button to manage detailed availability (RULES/BLOCKS) */}
                    {/* Adjust href based on your routing structure */}
                    <Link href={`/admin/settings/resources/${resource.id}/availability`} passHref>
                      <Button variant="outline" size="xs" className="h-7 px-2" title="Manage Availability Rules & Blocks">
                        <Settings2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Manage Availability</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setEditingResource(resource)}
                      title="Edit Resource Settings"
                    >
                      <Pencil className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                          title="Delete Resource"
                        >
                          <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent> {/* ... Delete Confirmation ... */} </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
