// components/ProjectScheduleConsultation.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Adjust path to your dummy data definitions
import { addMinutes, format } from 'date-fns';
import { CheckCircle, Clock } from 'lucide-react'; // Added CheckCircle
import React, { useCallback, useState } from 'react';
import { ConsultationScheduler } from './ConsultationScheduler';

// --- Component Props (If needed, e.g., initial scheduled date from parent) ---
interface ProjectScheduleConsultationProps {
  // Pass the initially scheduled appointment if it exists from parent data
  initialScheduledAppointment?: Date | string | null;
  projectId: number | string; // Pass project ID
  // Add other necessary props
}

// --- The Component ---

const ProjectScheduleConsultation: React.FC<ProjectScheduleConsultationProps> = ({
  initialScheduledAppointment,
  projectId = dummyProjectId, // Use dummy if not provided
}) => {
  const [scheduleOpen, setScheduleOpen] = useState(false);
  // State to hold the confirmed appointment date/time
  const [scheduledAppointment, setScheduledAppointment] = useState<Date | null>(
    initialScheduledAppointment ? new Date(initialScheduledAppointment) : null,
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Date | null>(null); // State for selected appointment
  const [isBooking, setIsBooking] = useState(false); // State for booking process

  // --- Mock function for simulating API call to book ---
  const bookConsultation = async (slot: Date): Promise<boolean> => {
    setIsBooking(true);
    console.log(`Simulating booking API call for project ${projectId}, resource ${dummyResourceId} at ${slot.toISOString()}`);
    // Replace with your actual API call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
    const success = Math.random() > 0.1; // Simulate 90% success rate
    setIsBooking(false);
    if (success) {
      console.log('Booking successful!');
      return true;
    } else {
      console.error('Booking failed!');
      alert('Failed to book appointment. Please try again.');
      return false;
    }
  };

  // --- Callback for ConsultationScheduler ---
  const handleSlotSelected = async (selectedSlot: Date) => {
    console.log('Slot selected in Scheduler:', selectedSlot);
    setSelectedAppointment(selectedSlot);
  };

  const submitBooking = async () => {
    console.log('Booking confirmed for:', selectedAppointment);
    const success = await bookConsultation(selectedAppointment);
    if (success) {
      setScheduledAppointment(selectedAppointment); // Update state to show confirmation
      setScheduleOpen(false); // Close the scheduler UI
    }
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
                resourceId={dummyResourceId} // Use actual resource ID
                slotDurationMinutes={dummySlotDuration}
                availabilityWindows={dummyAvailabilityWindows}
                unavailableDates={dummyUnavailableDates}
                minBookingLeadTimeHours={dummyMinLeadTime}
                maxBookingRangeDays={dummyMaxRange}
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

const dummyResourceId = 'consultant-abc';
const dummySlotDuration = 60;
const dummyAvailabilityWindows = [{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' }];
const dummyUnavailableDates = [new Date(2025, 4, 26), new Date(2025, 6, 4)];
const dummyMinLeadTime = 24;
const dummyMaxRange = 90;
const dummyProjectId = 'PROJ-101';

const baseBookingDate = new Date(2025, 3, 16); // April 16th, 2025

const fixedBookedSlotsData = [
  { start: new Date(2025, 3, 16, 11, 0), durationMinutes: 60 },
  { start: new Date(2025, 3, 21, 14, 0), durationMinutes: 60 },
  { start: new Date(2025, 3, 23, 9, 0), durationMinutes: 90 },
  { start: new Date(2025, 3, 16, 12, 0), durationMinutes: 60 },
  { start: new Date(2025, 3, 17, 12, 0), durationMinutes: 60 },
  { start: new Date(2025, 3, 18, 12, 0), durationMinutes: 60 },
  { start: new Date(2025, 3, 21, 12, 0), durationMinutes: 60 },
];
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
