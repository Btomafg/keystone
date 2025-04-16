// components/ConsultationScheduler.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addDays, addHours, addMinutes, endOfMonth, format, isAfter, isBefore, parse, startOfDay, startOfMonth, subMonths } from 'date-fns'; // Date utility functions
import { toZonedTime } from 'date-fns-tz'; // For timezone handling
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// --- Prop Types (Defined Above) ---
interface TimeSlot {
  startTime: string;
  endTime: string;
}
interface AvailabilityWindow {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
}
interface UnavailableSlot {
  start: Date;
  end: Date;
}
interface ConsultationSchedulerProps {
  resourceId: string;
  slotDurationMinutes: number;
  availabilityWindows: AvailabilityWindow[];
  unavailableDates?: Date[];
  minBookingLeadTimeHours?: number;
  maxBookingRangeDays?: number;
  projectId?: number | string;
  onSlotSelect: (selectedSlot: Date) => void;
  onDateChange?: (date: Date | undefined) => void;
  onMonthChange?: (month: Date) => void;
  fetchUnavailableSlots: (resourceId: string, startDate: Date, endDate: Date) => Promise<UnavailableSlot[]>;
}

// --- Helper: Get Timezone (Consider making this configurable) ---
const getTimeZone = (): string => {
  // Attempt to get user's timezone, fallback to a default
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
};

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
  const userTimeZone = getTimeZone();
  const today = startOfDay(toZonedTime(new Date(), userTimeZone)); // Today in user's timezone

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined); // "HH:mm"
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(today));
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [bookedSlots, setBookedSlots] = useState<UnavailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Calculate Date Boundaries ---
  const minBookingDate = addHours(toZonedTime(new Date(), userTimeZone), minBookingLeadTimeHours);
  const maxBookingDate = addDays(today, maxBookingRangeDays);

  // --- Fetch Unavailable Slots ---
  const loadUnavailableSlots = useCallback(
    async (month: Date) => {
      setIsLoadingSlots(true);
      setError(null);
      const startDate = startOfMonth(month);
      const endDate = endOfMonth(month); // Fetch for the entire month

      try {
        // Convert range to UTC for API consistency, assuming API expects UTC
        // Adjust if your API expects local time or a specific timezone
        // const startUTC = zonedToUtc(startDate, userTimeZone);
        // const endUTC = zonedToUtc(endDate, userTimeZone);
        // Fetch slots (assuming fetchUnavailableSlots handles timezone conversion if needed)
        //const unavailable = await fetchUnavailableSlots(resourceId, startDate, endDate);
        // setBookedSlots(unavailable);
      } catch (err) {
        console.error('Error fetching unavailable slots:', err);
        setError('Could not load availability. Please try again later.');
        setBookedSlots([]); // Clear potentially stale data on error
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [resourceId, fetchUnavailableSlots, userTimeZone],
  ); // Include userTimeZone if it affects fetching

  // Initial fetch and refetch when month changes
  useEffect(() => {
    loadUnavailableSlots(currentMonth);
  }, [currentMonth, loadUnavailableSlots]);

  // --- Generate and Filter Time Slots ---
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([]);
      setSelectedTime(undefined); // Clear selected time when date is deselected
      return;
    }

    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const applicableWindow = availabilityWindows.find((w) => w.daysOfWeek.includes(dayOfWeek));

    if (!applicableWindow) {
      setAvailableTimes([]);
      return;
    }

    const generatedTimes: TimeSlot[] = [];
    let currentTime = parse(applicableWindow.startTime, 'HH:mm', selectedDate);
    const endTime = parse(applicableWindow.endTime, 'HH:mm', selectedDate);

    while (isBefore(currentTime, endTime)) {
      const slotEndTime = addMinutes(currentTime, slotDurationMinutes);
      // Ensure slot doesn't exceed the end time
      if (isAfter(slotEndTime, endTime)) break;

      const slotStartTimeString = format(currentTime, 'HH:mm');
      const slotEndTimeString = format(slotEndTime, 'HH:mm');

      // 1. Check Lead Time: Ensure slot start is after min booking date/time
      if (isBefore(currentTime, minBookingDate)) {
        currentTime = slotEndTime; // Move to next potential slot
        continue;
      }

      // 2. Check Booked/Blocked Slots: Compare with fetched unavailable slots
      // Convert generated slot times to user's timezone for comparison IF bookedSlots are also in user timezone
      // IMPORTANT: Ensure consistent timezone handling between generated slots and bookedSlots
      const isBooked = bookedSlots.some((blocked) => {
        // Check for overlap: (SlotStart < BlockEnd) and (SlotEnd > BlockStart)
        const slotStartUserTz = currentTime;
        const slotEndUserTz = slotEndTime;
        // Assuming blocked.start/end are already Date objects in the correct timezone for comparison
        return isBefore(slotStartUserTz, blocked.end) && isAfter(slotEndUserTz, blocked.start);
      });

      if (!isBooked) {
        generatedTimes.push({ startTime: slotStartTimeString, endTime: slotEndTimeString });
      }

      currentTime = slotEndTime; // Move to the next slot start time
    }
    setAvailableTimes(generatedTimes);
    setSelectedTime(undefined); // Clear previous time selection when available times update
  }, [selectedDate, availabilityWindows, slotDurationMinutes, bookedSlots, userTimeZone]); // Added userTimeZone

  // --- Calendar Disabled Dates Logic ---
  const disabledDays = useMemo(() => {
    const disabled: (Date | { from: Date; to: Date } | { daysOfWeek: number[] } | Function)[] = [];

    // 1. Dates before minimum lead time or after max range
    disabled.push({ from: new Date(1970, 0, 1), to: subMonths(minBookingDate, 1) }); // Disable past dates relative to lead time
    disabled.push({ from: addDays(maxBookingDate, 1), to: new Date(2100, 0, 1) }); // Disable dates beyond max range

    // 2. Weekends if not in availabilityWindows
    const availableDays = new Set(availabilityWindows.flatMap((w) => w.daysOfWeek));
    const unavailableWeekDays: number[] = [];
    for (let i = 0; i < 7; i++) {
      if (!availableDays.has(i)) {
        unavailableWeekDays.push(i);
      }
    }
    if (unavailableWeekDays.length > 0) {
      disabled.push({ daysOfWeek: unavailableWeekDays });
    }

    // 3. Specific unavailable dates (holidays etc.)
    disabled.push(...unavailableDates);

    // 4. TODO (Advanced): Disable days that are *fully* booked based on bookedSlots
    // This requires checking generated slots against booked slots for the *entire day*
    // Can be complex, might be simpler to let user click and see no slots available.
    // Example check function (run this for dates in the current month):
    // const isDayFullyBooked = (day: Date): boolean => { ... logic ... };
    // disabled.push(isDayFullyBooked);

    return disabled;
  }, [minBookingDate, maxBookingDate, availabilityWindows, unavailableDates /*, bookedSlots */]); // Add bookedSlots if implementing full-day check

  // --- Event Handlers ---
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Ensure selected date is not in the past part of today (use startOfDay)
      const selectedDayStart = startOfDay(date);
      if (isBefore(selectedDayStart, startOfDay(minBookingDate))) {
        setSelectedDate(undefined); // Prevent selecting invalid past date part
        if (onDateChange) onDateChange(undefined);
      } else {
        setSelectedDate(selectedDayStart);
        if (onDateChange) onDateChange(selectedDayStart);
      }
    } else {
      setSelectedDate(undefined);
      if (onDateChange) onDateChange(undefined);
    }
    setSelectedTime(undefined); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const selectedDateTime = addMinutes(addHours(selectedDate, hours), minutes);

      // Convert selected time to UTC before passing to callback, if your backend expects UTC
      // const selectedUTC = zonedToUtc(selectedDateTime, userTimeZone);
      // onSlotSelect(selectedUTC);

      // Or pass the Date object as is (represents local time)
      onSlotSelect(selectedDateTime);
    }
  };

  const handleMonthChangeInternal = (month: Date) => {
    const newMonthStart = startOfMonth(month);
    // Prevent navigating to months completely outside the booking range
    if (isBefore(newMonthStart, startOfMonth(today)) || isAfter(newMonthStart, startOfMonth(maxBookingDate))) {
      // Optionally provide feedback or just prevent navigation
      return;
    }
    setCurrentMonth(newMonthStart);
    setSelectedDate(undefined); // Clear selection when month changes
    setSelectedTime(undefined);
    if (onMonthChange) onMonthChange(newMonthStart);
  };

  return (
    <Card className="w-full max-w-xl mx-auto bg-white">
      {' '}
      {/* Adjust max-width as needed */}
      <CardHeader>
        <CardTitle className="text-lg font-medium text-center">Schedule Consultation</CardTitle>
        {/* Optional: Add description or consultant name */}
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={handleMonthChangeInternal}
            disabled={disabledDays}
            fromDate={today} // Visually disable past days clearly
            toDate={maxBookingDate} // Disable future dates beyond range
            className="rounded-md border p-3"
            // Modifiers for styling booked/unavailable days if needed
            // modifiers={{ booked: bookedDays }}
            // modifiersClassNames={{ booked: 'bg-red-100 text-red-800 opacity-50' }}
            footer={
              selectedDate ? (
                <p className="text-sm text-center pt-2">Selected: {format(selectedDate, 'PPP')}</p>
              ) : (
                <p className="text-sm text-center pt-2 text-muted-foreground">Please select a date.</p>
              )
            }
          />
        </div>

        {/* Time Slots */}
        <div className="flex-1 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
          <h3 className="text-base font-medium mb-3 text-center md:text-left">
            Available Slots for {selectedDate ? format(selectedDate, 'MMM d') : '...'}
          </h3>
          {isLoadingSlots ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <Badge variant="destructive" className="w-full justify-center text-center py-2">
              {error}
            </Badge>
          ) : selectedDate ? (
            availableTimes.length > 0 ? (
              <ScrollArea className="h-full pr-3">
                {' '}
                {/* Adjust height as needed */}
                <div className="flex flex-col gap-2">
                  {availableTimes.map((slot) => (
                    <Button
                      key={slot.startTime}
                      variant={selectedTime === slot.startTime ? 'default' : 'outline'}
                      onClick={() => handleTimeSelect(slot.startTime)}
                      className="w-full justify-center text-xs sm:text-sm"
                      // Disable button if already selected to prevent double callback? Or rely on visual state.
                    >
                      {/* Format time for display (e.g., 9:00 AM) */}
                      {format(parse(slot.startTime, 'HH:mm', selectedDate), 'h:mm a')}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-32">
                <CalendarX className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No available slots on this day.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-32">
              <CalendarCheck className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Select a date to see available times.</p>
            </div>
          )}
        </div>
      </CardContent>
      {/* Optional Footer for confirmation/summary */}
      {selectedDate && selectedTime && (
        <div className=" py-4 border-t justify-center">
          <p className="text-sm font-medium text-center my-auto">
            Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {format(parse(selectedTime, 'HH:mm', selectedDate), 'h:mm a')}
          </p>
          {/* The actual booking happens when parent component handles onSlotSelect */}
        </div>
      )}
    </Card>
  );
}
