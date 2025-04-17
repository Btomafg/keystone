// components/ProjectScheduleConsultation.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Adjust path to your dummy data definitions
import { useCreateAppointment, useGetAppointmentByProjectId } from '@/hooks/api/appointments.queries';
import { useGetResources } from '@/hooks/api/resources.queries';
import { addMinutes, format } from 'date-fns';
import { CheckCircle, Clock } from 'lucide-react'; // Added CheckCircle
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { ConsultationScheduler } from './ConsultationScheduler';

// --- Component Props (If needed, e.g., initial scheduled date from parent) ---
interface ProjectScheduleConsultationProps {
  initialScheduledAppointment: any;
  projectId: number | string; // Pass project ID
}

const ProjectScheduleConsultation: React.FC<ProjectScheduleConsultationProps> = ({ initialScheduledAppointment, projectId }) => {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  //
  const [scheduledAppointment, setScheduledAppointment] = useState<Date | null>(
    initialScheduledAppointment ? new Date(initialScheduledAppointment.start_time) : null,
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Date | null>(null);
  const { data, isLoading } = useGetResources();
  const { refetch } = useGetAppointmentByProjectId({ project_id: projectId });
  const router = useRouter();
  // Use optional chaining and provide defaults
  const resource = data?.[0]; // Get the first resource safely
  const resourceAvailabilityRules = resource?.ResourceAvailabilityRules || [];
  // Note: The API response nests rules under 'ResourceAvailabilityRules' (PascalCase)
  // Ensure your types match the casing from the API or transform the data.
  const resourceBlockedTimesFromAPI = resource?.ResourceBlockedTimes || []; // We won't pass this directly anymore
  const duration = resource?.default_slot_duration_minutes ?? 30; // Use nullish coalescing for default
  const minLeadTime = resource?.min_booking_lead_time_hours ?? 24;
  const maxRange = resource?.max_booking_range_days ?? 60;
  const resourceId = resource?.id; // Get the ID safely
  const blockedSlots = resourceBlockedTimesFromAPI.map((slot) => ({
    start: new Date(slot.start),
    end: new Date(slot.end),
  }));
  const { mutateAsync: bookConsultation, isPending: isBooking } = useCreateAppointment();
  const handleSlotSelected = async (selectedSlot: Date) => {
    setSelectedAppointment(selectedSlot);
  };

  const submitBooking = async () => {
    let appointmentData = {
      project_id: projectId,
      resource_id: resourceId,
      start_time: selectedAppointment,
      type: 0,
    };
    if (initialScheduledAppointment) {
      appointmentData.id = initialScheduledAppointment.id;
    }
    const appointment = await bookConsultation(appointmentData);
    refetch(); // Refetch the appointment data
    setScheduledAppointment(selectedAppointment); // Update the scheduled appointment state
    router.refresh();
    // If booking failed, the scheduler remains open for user to try again or cancel
  }; // Update state to show confirmation

  // --- Fetch function (using dummy data version) ---
  const stableFetchUnavailableSlots = useCallback(async (resId: string, start: Date, end: Date): Promise<UnavailableSlot[]> => {
    // In real app, replace mockFetchUnavailableSlots with your actual API call function
    return mockFetchUnavailableSlots(resId, start, end);
  }, []); // Empty dependency array as the mock function doesn't depend on component scope

  // --- Reset function for Reschedule ---
  const handleReschedule = () => {
    setScheduledAppointment(null); // Clear the scheduled state
    setScheduleOpen(true); // Immediately open the scheduler
  };

  return (
    <>
      {/* --- STATE 1: Consultation NOT Yet Scheduled --- */}
      {!scheduledAppointment && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 transition-all duration-300">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Clock className="h-5 w-5" /> Ready for Consultation?
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300 mt-1">
                Your project is ready for the next step. Schedule your consultation call.
              </CardDescription>
            </div>
            <Button
              size="lg"
              onClick={() => setScheduleOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              disabled={scheduleOpen || isBooking} // Disable if already open or booking
            >
              Schedule Consultation
            </Button>
          </CardHeader>

          {/* Conditionally render the scheduler within the CardContent */}
          {scheduleOpen && (
            <CardContent className="pt-4 border-t border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground mb-4">Please select a date and time below.</p>
              <ConsultationScheduler
                resourceId={resourceId}
                slotDurationMinutes={duration}
                availabilityWindows={resourceAvailabilityRules}
                unavailableDates={blockedSlots}
                minBookingLeadTimeHours={minLeadTime}
                maxBookingRangeDays={maxRange}
                projectId={projectId}
                onSlotSelect={handleSlotSelected} // This triggers the booking flow
                fetchUnavailableSlots={stableFetchUnavailableSlots}
              />
              {/* Footer inside the scheduler area */}
              <div className="w-full text-sm flex flex-row justify-end gap-3 mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                <Button variant="outline" onClick={() => setScheduleOpen(false)} disabled={isBooking}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={submitBooking} loading={isBooking} disabled={isBooking}>
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* --- STATE 2: Consultation IS Scheduled --- */}
      {scheduledAppointment && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 transition-all duration-300">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" /> Consultation Scheduled!
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300 mt-1">
                Your appointment is confirmed. We look forward to speaking with you.
              </CardDescription>
            </div>
            {/* Optional: Reschedule Button */}
            <Button variant="outline" size="sm" onClick={handleReschedule}>
              Reschedule
            </Button>
          </CardHeader>
          <CardContent className="pt-4 border-t border-green-200 dark:border-green-800">
            <p className="text-base font-medium text-foreground">Your scheduled time is:</p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-300 mt-1">
              {format(scheduledAppointment, "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
            {/* Optional: Add "Add to Calendar" button */}
            {/* <Button variant="link" className="mt-2 p-0 h-auto text-sm">Add to Calendar</Button> */}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ProjectScheduleConsultation;

// --- Dummy Data Definitions (Import from separate file or define here) ---
// Make sure these are defined or imported correctly

interface UnavailableSlot {
  start: Date;
  end: Date;
} // Ensure this interface is defined

const fixedBookedSlotsData = [{ start: new Date(2025, 3, 23, 10, 0), durationMinutes: 30 }];
const preCalculatedBookedSlots: UnavailableSlot[] = fixedBookedSlotsData.map((slot) => ({
  start: slot.start,
  end: addMinutes(slot.start, slot.durationMinutes),
}));

const mockFetchUnavailableSlots = async (resId: string, start: Date, end: Date): Promise<UnavailableSlot[]> => {
  console.log(`Mock Fetching unavailable slots for resource ${resId} from ${start.toISOString()} to ${end.toISOString()}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const relevantSlots = preCalculatedBookedSlots.filter((slot) => slot.start < end && slot.end > start);
  console.log(`Returning ${relevantSlots.length} dummy booked/blocked slots.`);
  return relevantSlots;
};
