// app/admin/projects/[projectId]/_components/AdminProjectAppointmentsTab.tsx

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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For Resource selection potentially
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminGetResources } from '@/hooks/api/admin/admin.resources.queries';
import { useToast } from '@/hooks/use-toast';
import { addMinutes, differenceInMinutes, format, isValid } from 'date-fns';
import { CalendarOff, CalendarPlus, Loader2, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { ConsultationScheduler } from '../../dashboard/projects/details/ConsultationScheduler';
// Import necessary types and dummy data/fetch hooks for resources if needed for scheduling

// --- Type Definitions --- (Defined above or imported)
interface Appointment {
  /* ... */
}
interface ProjectWithAppointments {
  /* ... */
}
interface ResourceSummary {
  /* ... */
}
interface UnavailableSlot {
  /* ... */
} // Needed for fetch function type

// --- Placeholder Mappings ---
// !!! UPDATE THESE MAPPINGS !!!
const APPOINTMENT_TYPE_MAP: { [key: number]: string } = {
  0: 'Consultation',
  1: 'Site Measure',
  2: 'Installation',
  // Add others
};
const APPOINTMENT_STATUS_MAP: {
  [key: string]: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' };
} = {
  'confirmed': { label: 'Confirmed', variant: 'success' },
  'cancelled': { label: 'Cancelled', variant: 'destructive' },
  'pending': { label: 'Pending', variant: 'warning' },
  // Add others
};

// --- Helper ---
const formatDate = (date: Date | string | null | undefined, fmt: string = 'Pp'): string => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), fmt);
  } catch (error) {
    // Use new Date() for flexibility
    return 'Invalid Date';
  }
};

// --- Component Props ---
interface AdminProjectAppointmentsTabProps {
  project: ProjectWithAppointments | null;
  isLoading?: boolean; // Loading state from parent
}

export function AdminProjectAppointmentsTab({ project, isLoading = false }: AdminProjectAppointmentsTabProps) {
  const [showSchedulerDialog, setShowSchedulerDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to manage which resource to schedule for (if multiple options exist)
  const { toast } = useToast();
  const { data: resources } = useAdminGetResources(); // Fetch resources for scheduling
  const [selectedResourceId, setSelectedResourceId] = useState<string | undefined>(() => resources?.[0]?.id); // Default to first resource for demo
  const selectedResourceDetails = resources?.find((res) => res.id === selectedResourceId); // Get details of selected resource
  console.log(selectedResourceId);
  useEffect(() => {
    if (resources?.length) {
      setSelectedResourceId(resources[0].id); // Reset to first resource if available
    }
  }, [resources]);
  // Extract appointments safely
  const appointments = project?.appointments || [];

  // --- API Call Placeholders ---
  const handleScheduleNew = async (slot: Date) => {
    if (!selectedResourceId) {
      toast({ title: 'Error', description: 'Please select a resource to schedule with.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    console.log('API CALL: Create Appointment', {
      projectId: project?.id,
      resourceId: selectedResourceId,
      startTime: slot.toISOString(), // Send ISO string
      endTime: addMinutes(slot, 60).toISOString(), // Calculate end time based on duration (fetch from resource?)
      // Add other needed fields like type, customer info etc.
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      toast({ title: 'Success', description: `Appointment scheduled for ${formatDate(slot)}.` });
      setShowSchedulerDialog(false);
      // !!! IMPORTANT: Need to trigger a refetch of the main 'project' data in the parent component !!!
      // Or manually update the project state passed down if possible.
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      toast({ title: 'Error', description: 'Could not schedule appointment.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string | number) => {
    console.log('API CALL: Cancel Appointment', appointmentId);
    setIsSubmitting(true); // Use general submitting state or specific cancel state
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      toast({ title: 'Success', description: 'Appointment cancelled.' });
      // !!! IMPORTANT: Need to trigger a refetch of the main 'project' data in the parent component !!!
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast({ title: 'Error', description: 'Could not cancel appointment.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Mock Fetch for Scheduler ---
  // Re-declare or import mockFetchUnavailableSlots and its dependencies/types if needed
  // Ensure UnavailableSlot type is available
  const stableFetchUnavailableSlots = useCallback(async (resId: string, start: Date, end: Date): Promise<UnavailableSlot[]> => {
    // Use your actual fetch logic or the mock
    return mockFetchUnavailableSlots(resId, start, end);
  }, []);

  return (
    <div className="space-y-4">
      {/* Schedule New Appointment Button + Dialog */}
      <Dialog open={showSchedulerDialog} onOpenChange={setShowSchedulerDialog}>
        <DialogTrigger asChild>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" /> Schedule New Appointment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          {/* Wider dialog for scheduler */}
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Select a resource (if applicable) and choose an available date/time slot for this project.
            </DialogDescription>
          </DialogHeader>
          {/* Optional: Resource Selection if multiple resources */}
          {resources?.length > 1 && (
            <div className="mb-4">
              <Label htmlFor="schedule-resource" className="mb-2 block text-sm font-medium">
                Resource
              </Label>
              <Select value={selectedResourceId} onValueChange={setSelectedResourceId}>
                <SelectTrigger id="schedule-resource">
                  <SelectValue placeholder="Select resource..." />
                </SelectTrigger>
                <SelectContent>
                  {resources.map((res) => (
                    <SelectItem key={res.id} value={res.id}>
                      {res.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Render Scheduler only if a resource is selected/available */}
          {selectedResourceId && selectedResourceDetails ? (
            <ConsultationScheduler
              key={selectedResourceId} // Force re-mount if resource changes
              resourceId={selectedResourceId}
              // Fetch resource-specific settings or use defaults
              slotDurationMinutes={selectedResourceDetails.default_slot_duration_minutes || 60}
              availabilityWindows={selectedResourceDetails.ResourceAvailabilityRules || []} // Pass fetched rules for THIS resource
              unavailableDates={[]} // Pass specific holiday dates if needed
              minBookingLeadTimeHours={selectedResourceDetails.min_booking_lead_time_hours || 24}
              maxBookingRangeDays={selectedResourceDetails.max_booking_range_days || 90}
              projectId={project.id}
              onSlotSelect={handleScheduleNew} // Triggers the actual booking attempt
              fetchUnavailableSlots={stableFetchUnavailableSlots} // Use the stable fetch function
            />
          ) : (
            <p className="text-center text-muted-foreground p-6">Please select a resource to view schedule.</p>
          )}
          {/* No explicit 'Book' button needed here if onSlotSelect triggers booking */}
          <DialogFooter className="mt-4 sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table of Existing Appointments */}
      <h3 className="text-lg font-semibold pt-4">Scheduled Appointments</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No appointments scheduled for this project.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => {
                const statusInfo = APPOINTMENT_STATUS_MAP[appt.status] || { label: appt.status, variant: 'secondary' };
                const startDate = new Date(appt.start_time);
                const endDate = new Date(appt.end_time);
                const duration = isValid(startDate) && isValid(endDate) ? `${differenceInMinutes(endDate, startDate)} min` : 'N/A';
                const resourceName = appt.resource?.name || 'Unknown'; // *** Requires resource data in appointment object ***

                return (
                  <TableRow key={appt.id}>
                    <TableCell className="text-xs font-medium">
                      {isValid(startDate) ? format(startDate, 'MMM d, yyyy') : 'Invalid'}
                    </TableCell>
                    <TableCell className="text-xs">{isValid(startDate) ? format(startDate, 'h:mm a') : 'Invalid'}</TableCell>
                    <TableCell className="text-xs">{duration}</TableCell>
                    <TableCell className="text-xs">{APPOINTMENT_TYPE_MAP[appt.type] || `Type ${appt.type}`}</TableCell>
                    <TableCell className="text-xs ">
                      {' '}
                      <span className="flex gap-1">
                        <User className="h-3 w-3 text-muted-foreground my-auto" /> {resourceName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className="text-xs">
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {/* Reschedule could open the scheduler dialog again */}
                      {/* <Button variant="ghost" size="icon" className="h-7 w-7" title="Reschedule"><CalendarPlus className="h-4 w-4" /></Button> */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild disabled={appt.status === 'cancelled' || isSubmitting}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-7 w-7"
                            title="Cancel Appointment"
                            disabled={appt.status === 'cancelled' || isSubmitting}
                          >
                            <CalendarOff className="h-4 w-4" /> <span className="sr-only">Cancel</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel the appointment on {formatDate(appt.start_time)}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancel Appointment
                            </AlertDialogAction>
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

// --- Mock Fetch/Data for Scheduler (if needed for testing within this file) ---
// Make sure UnavailableSlot is defined if using mock data here
// const DUMMY_RESOURCES_LIST: ResourceSummary[] = [ { id: '520bbcd9-389c-450c-a20d-2dcd55df99cf', name: 'Sales Team Calendar'} ]; // Example
// const mockFetchUnavailableSlots = async (resId: string, start: Date, end: Date): Promise<UnavailableSlot[]> => { /* ... */ return []; };
