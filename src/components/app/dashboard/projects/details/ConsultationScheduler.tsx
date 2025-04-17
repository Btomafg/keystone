// components/ConsultationScheduler.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
// Ensure all needed date-fns functions are imported
import { addDays, addHours, addMinutes, endOfMonth, format, isAfter, isBefore, parse, startOfDay, startOfMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // Keep for timezone calculations
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker'; // Import DateRange for disabled prop type

// --- Prop Type Definitions ---
interface TimeSlot {
  start_time: string; // "HH:mm" format
  end_time: string; // "HH:mm" format
}

interface AvailabilityWindow {
  // Assuming these come from your API/DB matching the structure logged previously
  id?: string | number; // Optional ID if needed as key later
  day_of_week: number; // 0=Sun, 1=Mon,... 6=Sat
  start_time: string; // Expect "HH:mm:ss" or "HH:mm" format
  end_time: string; // Expect "HH:mm:ss" or "HH:mm" format
  resource_id?: string | number; // Optional reference
}

// Represents a fetched booked appointment or blocked time
interface UnavailableSlot {
  start: Date; // Should be a valid Date object
  end: Date; // Should be a valid Date object
}

interface ConsultationSchedulerProps {
  /** ID of the resource (e.g., consultant) to book with */
  resourceId: string;
  /** Duration of each consultation slot in minutes */
  slotDurationMinutes: number;
  /** General recurring availability windows for the resource */
  availabilityWindows: AvailabilityWindow[];
  /** Specific dates that are entirely unavailable (e.g., holidays) */
  unavailableDates?: Date[];
  /** Minimum hours in advance a booking can be made */
  minBookingLeadTimeHours?: number;
  /** How many days into the future bookings are allowed */
  maxBookingRangeDays?: number;
  /** Optional ID of the project this booking relates to */
  projectId?: number | string;
  /** Callback function when a valid time slot is selected. Returns the start time as a Date object. */
  onSlotSelect: (selectedSlot: Date) => void;
  /** Optional callback when the selected date changes */
  onDateChange?: (date: Date | undefined) => void;
  /** Optional callback when the displayed month changes */
  onMonthChange?: (month: Date) => void;
  /** Async function to fetch unavailable slots (booked appointments + blocked times) for a given resource and date range */
  fetchUnavailableSlots: (resourceId: string, startDate: Date, endDate: Date) => Promise<UnavailableSlot[]>;
}

// --- Helper: Get Timezone ---
const getTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York'; // Example fallback
};

// --- The Component ---
export function ConsultationScheduler({
  resourceId,
  slotDurationMinutes,
  availabilityWindows,
  unavailableDates = [],
  minBookingLeadTimeHours = 24,
  maxBookingRangeDays = 90,
  projectId,
  onSlotSelect,
  onDateChange,
  onMonthChange,
  fetchUnavailableSlots,
}: ConsultationSchedulerProps) {
  // --- State ---
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(toZonedTime(new Date(), getTimeZone())));
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<UnavailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Memoized Values ---
  const userTimeZone = useMemo(() => getTimeZone(), []);
  const today = useMemo(() => startOfDay(toZonedTime(new Date(), userTimeZone)), [userTimeZone]);

  const minBookingDateTime = useMemo(() => {
    return addHours(toZonedTime(new Date(), userTimeZone), minBookingLeadTimeHours);
  }, [minBookingLeadTimeHours, userTimeZone]);

  const minBookingDateDayStart = useMemo(() => startOfDay(minBookingDateTime), [minBookingDateTime]);
  const maxBookingDate = useMemo(() => addDays(today, maxBookingRangeDays), [today, maxBookingRangeDays]);

  // --- Data Fetching ---
  const loadUnavailableSlots = useCallback(
    async (month: Date) => {
      setIsLoadingSlots(true);
      setError(null);
      const startDate = startOfMonth(month);
      const endDate = endOfMonth(month);
      try {
        const unavailable = await fetchUnavailableSlots(resourceId, startDate, endDate);
        // Ensure fetched dates are actual Date objects
        // This assumes your fetch function returns objects where start/end can be passed to new Date()
        const parsedUnavailable = unavailable.map((slot) => ({
          start: new Date(slot.start),
          end: new Date(slot.end),
        }));
        // Add validation if needed: filter out slots where start/end are Invalid Date
        const validUnavailable = parsedUnavailable.filter((slot) => !isNaN(slot.start.getTime()) && !isNaN(slot.end.getTime()));
        console.log(`DEBUG: Fetched and parsed ${validUnavailable.length} valid unavailable slots.`);
        setBookedSlots(validUnavailable);
      } catch (err: any) {
        console.error('Error fetching unavailable slots:', err);
        setError(`Could not load availability: ${err.message || 'Unknown error'}`);
        setBookedSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [resourceId, fetchUnavailableSlots],
  );

  useEffect(() => {
    if (resourceId) {
      // Only fetch if resourceId is available
      loadUnavailableSlots(currentMonth);
    } else {
      // Handle case where resourceId might not be ready immediately
      setIsLoadingSlots(false);
      setBookedSlots([]);
    }
  }, [currentMonth, resourceId, loadUnavailableSlots]); // Add resourceId dependency

  // --- Generate and Filter Time Slots ---
  useEffect(() => {
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      setAvailableTimes([]);
      return;
    }

    const dayOfWeek = selectedDate.getDay();
    const applicableWindows = availabilityWindows.filter((w) => w?.day_of_week === dayOfWeek);

    if (!applicableWindows || applicableWindows.length === 0) {
      setAvailableTimes([]);
      return;
    }

    const allGeneratedTimes: TimeSlot[] = [];

    applicableWindows.forEach((window, windowIndex) => {
      // console.log(`DEBUG: Processing Window ${windowIndex + 1}: start='${window.start_time}', end='${window.end_time}' for date ${selectedDate.toISOString()}`);
      try {
        // *** Use Manual Date Construction instead of parse ***
        const [startH, startM, startS] = (window.start_time || '00:00:00').split(':').map(Number);
        const [endH, endM, endS] = (window.end_time || '00:00:00').split(':').map(Number);

        let currentTime = new Date(selectedDate);
        currentTime.setHours(startH, startM, startS || 0, 0); // Set H, M, S, MS

        const windowEndTime = new Date(selectedDate);
        windowEndTime.setHours(endH, endM, endS || 0, 0);

        // Check if construction resulted in valid dates and order
        if (isNaN(currentTime.getTime()) || isNaN(windowEndTime.getTime()) || !isBefore(currentTime, windowEndTime)) {
          console.warn(`Skipping window due to invalid time construction or order: ${JSON.stringify(window)}`);
          return; // Skip this window
        }

        // Loop through time slots within this window
        while (isBefore(currentTime, windowEndTime)) {
          const slotEndTime = addMinutes(currentTime, slotDurationMinutes);
          if (isAfter(slotEndTime, windowEndTime)) break; // Don't exceed window

          // Check lead time
          if (isBefore(currentTime, minBookingDateTime)) {
            currentTime = slotEndTime;
            continue; // Skip if too early
          }

          // Check booked slots overlap
          const isBooked = bookedSlots.some((blocked) => isBefore(currentTime, blocked.end) && isAfter(slotEndTime, blocked.start));

          if (!isBooked) {
            allGeneratedTimes.push({
              start_time: format(currentTime, 'HH:mm'),
              end_time: format(slotEndTime, 'HH:mm'),
            });
          }
          currentTime = slotEndTime;
        }
      } catch (e) {
        console.error(`Error processing time window: ${JSON.stringify(window)}`, e);
      }
    });

    allGeneratedTimes.sort((a, b) => a.start_time.localeCompare(b.start_time));
    setAvailableTimes(allGeneratedTimes);

    // Corrected Dependency Array
  }, [selectedDate, availabilityWindows, slotDurationMinutes, bookedSlots, minBookingDateTime]);

  // --- Calendar Disabled Dates Logic ---
  const disabledDays = useMemo(() => {
    const disabled: (Date | DateRange | { daysOfWeek: number[] } | ((date: Date) => boolean))[] = [];
    disabled.push({ before: minBookingDateDayStart });
    disabled.push({ after: maxBookingDate });
    const availableDaysSet = new Set(availabilityWindows.flatMap((w) => w.day_of_week));
    const unavailableWeekDays: number[] = [];
    for (let i = 0; i < 7; i++) {
      if (!availableDaysSet.has(i)) {
        unavailableWeekDays.push(i);
      }
    }
    if (unavailableWeekDays.length > 0) {
      disabled.push({ daysOfWeek: unavailableWeekDays });
    }
    disabled.push(...unavailableDates);
    return disabled;
  }, [minBookingDateDayStart, maxBookingDate, availabilityWindows, unavailableDates]);

  // --- Event Handlers ---
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedTime(undefined); // Reset time selection first
    if (date) {
      const selectedDayStart = startOfDay(date);
      if (isBefore(selectedDayStart, minBookingDateDayStart)) {
        setSelectedDate(undefined);
        if (onDateChange) onDateChange(undefined);
      } else {
        setSelectedDate(selectedDayStart);
        if (onDateChange) onDateChange(selectedDayStart);
      }
    } else {
      setSelectedDate(undefined);
      if (onDateChange) onDateChange(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const selectedDateTime = addMinutes(addHours(selectedDate, hours), minutes);
      onSlotSelect(selectedDateTime);
    }
  };

  const handleMonthChangeInternal = (month: Date) => {
    const newMonthStart = startOfMonth(month);
    if (isBefore(newMonthStart, startOfMonth(today)) || isAfter(newMonthStart, startOfMonth(maxBookingDate))) {
      return;
    }
    setCurrentMonth(newMonthStart);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setAvailableTimes([]);
    if (onMonthChange) onMonthChange(newMonthStart);
    // Fetching handled by useEffect watching currentMonth
  };

  // --- JSX Rendering ---
  return (
    <Card className="w-full max-w-xl mx-auto bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-center">Schedule Consultation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={handleMonthChangeInternal}
            disabled={disabledDays}
            fromDate={today}
            toDate={maxBookingDate}
            className="rounded-md border p-3 bg-background"
            footer={
              <p className="text-xs text-center pt-2 px-1 text-muted-foreground">
                {selectedDate ? `Selected: ${format(selectedDate, 'PPP')}` : 'Please select an available date.'}
              </p>
            }
          />
        </div>

        {/* Time Slots */}
        <div className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 min-h-[280px] flex flex-col">
          <h3 className="text-base font-medium mb-3 text-center md:text-left flex-shrink-0">
            Available Slots for {selectedDate ? format(selectedDate, 'MMM d') : '...'}
          </h3>
          <div className="flex-grow flex flex-col justify-center">
            {isLoadingSlots ? (
              <div className="text-center p-2">
                <Loader2 className="h-6 w-6 animate-spin inline-block text-muted-foreground" />
              </div>
            ) : error ? (
              <Badge variant="destructive" className="p-2 text-center block whitespace-normal h-auto">
                {error}
              </Badge>
            ) : selectedDate ? (
              availableTimes.length > 0 ? (
                <ScrollArea className="h-full max-h-[275px] pr-3">
                  <div className="grid grid-cols-1 gap-2">
                    {availableTimes.map((slot) => (
                      <Button
                        key={slot.start_time}
                        variant={selectedTime === slot.start_time ? 'default' : 'outline'}
                        onClick={() => handleTimeSelect(slot.start_time)}
                        className="w-full justify-center text-xs sm:text-sm"
                      >
                        {/* Format time using parse just for display */}
                        {format(parse(slot.start_time, 'HH:mm', selectedDate), 'h:mm a')}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full px-4">
                  <CalendarX className="h-8 w-8 mb-2" />
                  <p className="text-sm">No available slots found for this day.</p>
                  <p className="text-xs mt-1">(Check availability rules or existing bookings)</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full px-4">
                <CalendarCheck className="h-8 w-8 mb-2" />
                <p className="text-sm">Select a date on the calendar to see available times.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {/* Confirmation Footer */}
      {selectedDate && selectedTime && (
        <div className="p-3 border-t justify-center bg-muted/50 rounded-b-md">
          <p className="text-sm font-medium text-center my-auto text-foreground">
            Selected: {format(selectedDate, 'EEE, MMM d, yyyy')} at {format(parse(selectedTime, 'HH:mm', selectedDate), 'h:mm a')}
          </p>
          {/* Reminder: The actual booking action is triggered by the parent component */}
        </div>
      )}
    </Card>
  );
}

// Default export might be needed depending on file structure
// export default ConsultationScheduler;
