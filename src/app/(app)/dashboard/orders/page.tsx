'use client';

import { ConsultationScheduler } from '@/components/app/dashboard/projects/details/ConsultationScheduler';
import { addMinutes, setDate, setHours, setMinutes } from 'date-fns';
import { useCallback } from 'react';

interface TimeSlot {
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "09:30"
}

interface AvailabilityWindow {
  daysOfWeek: number[]; // 0-6 (Sun-Sat)
  startTime: string; // HH:mm e.g., "09:00"
  endTime: string; // HH:mm e.g., "17:00"
}

// Data fetched from API representing booked/blocked slots
interface UnavailableSlot {
  start: Date; // Use Date objects for easier comparison
  end: Date;
}

interface ConsultationSchedulerProps {
  /** ID of the resource (e.g., consultant) to book with */
  resourceId: string;

  /** Duration of each consultation slot in minutes */
  slotDurationMinutes: number;

  /** General availability windows (can be fetched or passed as prop) */
  // Example: [{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' }]
  availabilityWindows: AvailabilityWindow[];

  /** Specific dates that are entirely unavailable (e.g., holidays - can be fetched or passed) */
  // Example: [new Date('2025-05-26'), new Date('2025-07-04')]
  unavailableDates?: Date[];

  /** Minimum hours in advance a booking can be made (e.g., 24 for 1 day) */
  minBookingLeadTimeHours?: number;

  /** How many days into the future bookings are allowed (e.g., 90) */
  maxBookingRangeDays?: number;

  /** Optional ID of the project this booking relates to */
  projectId?: number | string;

  /** Callback function when a valid time slot is selected. Returns the start time as a Date object. */
  onSlotSelect: (selectedSlot: Date) => void;

  /** Optional callback when the selected date changes */
  onDateChange?: (date: Date | undefined) => void;

  /** Optional callback when the displayed month changes */
  onMonthChange?: (month: Date) => void;

  /** Function to fetch unavailable slots for a given date range */
  // Takes start/end dates of the range, returns booked/blocked slots
  // This replaces needing to pass bookedSlots directly
  fetchUnavailableSlots: (resourceId: string, startDate: Date, endDate: Date) => Promise<UnavailableSlot[]>;
}
// --- Dummy Props Data ---

const dummyResourceId = 'consultant-abc';
const dummySlotDuration = 60; // 60 minutes slots

// Availability: Monday - Friday, 9 AM - 5 PM
const dummyAvailabilityWindows = [
  { daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '17:00' },
  // Add more windows here if needed, e.g., different hours on Friday
];

// Unavailable Dates (e.g., Holidays) - Use YYYY, MM-1, DD format for Date constructor
const dummyUnavailableDates = [
  new Date(2025, 4, 26), // Example: Memorial Day 2025 (May is month 4)
  new Date(2025, 6, 4), // Example: July 4th, 2025 (July is month 6)
];

const dummyMinLeadTime = 24; // 24 hours in advance
const dummyMaxRange = 90; // 90 days from today
const dummyProjectId = 'PROJ-101';

// --- Mock fetchUnavailableSlots ---
// Simulates fetching booked/blocked times from an API

// Define some fixed dummy booked slots relative to a hypothetical 'today'
// For consistency, let's use April 16th, 2025 as a reference for these bookings
const baseBookingDate = new Date(2025, 3, 16); // April 16th, 2025 (Month is 0-indexed)

const fixedBookedSlotsData = [
  // Specific Appointments
  { start: setHours(setMinutes(baseBookingDate, 0), 11), durationMinutes: 60 }, // April 16th @ 11:00 AM for 1 hour
  { start: setHours(setMinutes(setDate(baseBookingDate, 21), 0), 14), durationMinutes: 60 }, // April 21st @ 2:00 PM for 1 hour
  { start: setHours(setMinutes(setDate(baseBookingDate, 23), 0), 9), durationMinutes: 90 }, // April 23rd @ 9:00 AM for 1.5 hours
  // Recurring Block (e.g., Lunch - more complex logic needed for true recurrence)
  // For mocking, just add a few instances
  { start: setHours(setMinutes(baseBookingDate, 0), 12), durationMinutes: 60 }, // Lunch April 16th
  { start: setHours(setMinutes(setDate(baseBookingDate, 17), 0), 12), durationMinutes: 60 }, // Lunch April 17th
  { start: setHours(setMinutes(setDate(baseBookingDate, 18), 0), 12), durationMinutes: 60 }, // Lunch April 18th
  { start: setHours(setMinutes(setDate(baseBookingDate, 21), 0), 12), durationMinutes: 60 }, // Lunch April 21st
];
const fetchBookedSlotsFromApi = async (resourceId: string, startDate: Date, endDate: Date): Promise<UnavailableSlot[]> => {
  // ... your API call logic ...
  console.log(`ACTUAL Fetching unavailable slots for resource ${resourceId}`);
  const response = await fetch(
    `/api/availability/<span class="math-inline">\{resourceId\}?start\=</span>{startDate.toISOString()}&end=${endDate.toISOString()}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch slots');
  }
  const data = await response.json();
  // Ensure the data returned matches UnavailableSlot[] with Date objects
  return data.map((slot: any) => ({
    start: new Date(slot.start), // IMPORTANT: Convert string dates to Date objects
    end: new Date(slot.end),
  }));
};

// Convert fixed data to UnavailableSlot format with start/end Date objects
const preCalculatedBookedSlots: UnavailableSlot[] = fixedBookedSlotsData.map((slot) => ({
  start: slot.start,
  end: addMinutes(slot.start, slot.durationMinutes),
}));

// --- Placeholder onSlotSelect ---
const handleSlotSelected = (slot: Date) => {
  console.log('Booking confirmed for:', slot);
  // ... trigger booking API ...
};
export default function Orders() {
  const resourceId = 'consultant-abc';
  const stableFetchUnavailableSlots = useCallback(async (resId: string, start: Date, end: Date): Promise<UnavailableSlot[]> => {
    return fetchBookedSlotsFromApi(resId, start, end);
    // Dependencies for useCallback: Include anything from the parent's scope used inside fetchBookedSlotsFromApi
    // If it doesn't use anything from parent scope (like here), the dependency array can be empty.
  }, []);
  return (
    <div>
      ORDERS PAGE
      <ConsultationScheduler
        resourceId={resourceId}
        slotDurationMinutes={dummySlotDuration}
        availabilityWindows={dummyAvailabilityWindows}
        unavailableDates={dummyUnavailableDates}
        minBookingLeadTimeHours={dummyMinLeadTime}
        maxBookingRangeDays={dummyMaxRange}
        projectId={dummyProjectId}
        onSlotSelect={handleSlotSelected}
        fetchUnavailableSlots={stableFetchUnavailableSlots}
        // Optional: Add onDateChange or onMonthChange handlers if needed for testing those
        // onDateChange={(date) => console.log("Date changed:", date)}
        // onMonthChange={(month) => console.log("Month changed:", month)}
      />
    </div>
  );
}
