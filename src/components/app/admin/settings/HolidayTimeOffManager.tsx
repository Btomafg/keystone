// app/admin/settings/_components/holiday-time-off-manager.tsx
'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // For DatePicker
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // For Resource Select
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  useAdminCreateResourceBlockedTimes,
  useAdminDeleteResourceBlockedTimes,
  useAdminGetResources,
} from '@/hooks/api/admin/admin.resources.queries';
import { useOnClickOutside } from '@/hooks/use-on-click-outside'; // Adjust import path for the hook
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { endOfDay, format, isBefore, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, CalendarOff, Loader2, PlusCircle, Trash2, User } from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker'; // For DateRangePicker

// --- Placeholder Types & Data ---
interface Resource {
  // Simplified for dropdown
  id: string;
  name: string;
}
interface BlockedTime {
  id: string | number;
  resource_id: string; // UUID
  resource_name?: string; // Optional: Populated via join/lookup
  start_time: string | Date; // Expect ISO String or Date from API
  end_time: string | Date; // Expect ISO String or Date from API
  reason?: string | null;
}

interface HolidayFormProps {
  onSave: (data: { reason: string; startDate: Date; endDate: Date }) => Promise<void>;
  onClose: () => void;
}
// Inside _components/holiday-time-off-manager.tsx

// --- Holiday Form Props ---
interface HolidayFormProps {
  onSave: (data: { reason: string; startDate: Date; endDate: Date }) => Promise<void>;
  onClose: () => void;
  isSaving?: boolean; // Optional: for loading state
}

function HolidayForm({ onSave, onClose, isSaving }: HolidayFormProps) {
  const [reason, setReason] = useState('Holiday');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  // Refs for click-outside detection
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  // Close calendar when clicking outside
  useOnClickOutside(calendarRef, () => setIsCalendarOpen(false), triggerButtonRef);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Close calendar automatically when a range is fully selected
    if (range?.from && range?.to) {
      setIsCalendarOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        /*...*/
      });
      return;
    }
    const endDateInclusive = endOfDay(dateRange.to);

    try {
      await onSave({ reason, startDate: dateRange.from, endDate: endDateInclusive });
      toast({ title: 'Success', description: 'Holiday block created.' });
      onClose();
    } catch (error) {
      /* ... */
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="hol-reason">Reason</Label>
        <Input id="hol-reason" value={reason} onChange={(e) => setReason(e.target.value)} required disabled={isSaving} />
      </div>
      <div className="grid gap-2">
        <Label>Date Range</Label>
        {/* Use a relative container for positioning the manual popover */}
        <div className="relative">
          {/* Button to show selected range and toggle calendar */}
          <Button
            ref={triggerButtonRef} // Attach ref to trigger
            id="date-range-button"
            type="button"
            variant={'outline'}
            className={cn('w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)} // Toggle visibility
            disabled={isSaving}
            aria-expanded={isCalendarOpen} // Accessibility
            aria-controls="date-range-calendar-popover"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                </>
              ) : (
                format(dateRange.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>

          {/* Conditionally render Calendar in an absolutely positioned div */}
          {isCalendarOpen && (
            <div
              ref={calendarRef} // Attach ref to popover content
              id="date-range-calendar-popover"
              role="dialog" // Accessibility
              className="absolute z-50 mt-1 w-auto bg-popover text-popover-foreground border rounded-md shadow-lg p-0 animate-in fade-in-0 zoom-in-95" // Added basic animation
              // Position below the button (adjust if needed)
              style={{ top: '100%', left: 0 }}
            >
              <Calendar
                initialFocus // Focus calendar when opened
                mode="range"
                defaultMonth={dateRange?.from || new Date()}
                selected={dateRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                disabled={{ before: startOfDay(new Date()) }}
              />
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving || !dateRange?.from || !dateRange?.to}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Holiday Block
        </Button>
      </DialogFooter>
    </form>
  );
}

// Form for adding/editing Time Off (specific resource)
interface TimeOffFormProps {
  resources: Resource[]; // List of available resources
  onSave: (data: { resourceId: string; reason: string; startTime: Date; endTime: Date }) => Promise<void>;
  onClose: () => void;
  isSaving?: boolean; // Optional: for loading state
  // Optional: initialData for editing
}
function TimeOffForm({ resources, onSave, onClose, isSaving }: TimeOffFormProps) {
  const [resourceId, setResourceId] = useState<string>(resources[0].id);
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState('17:00');
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const { toast } = useToast();
  // Refs for click outside
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);

  // Close handlers
  const closeStartCalendar = useCallback(() => setIsStartCalendarOpen(false), []);
  const closeEndCalendar = useCallback(() => setIsEndCalendarOpen(false), []);

  // Click outside hooks
  useOnClickOutside(startCalendarRef, closeStartCalendar, startTriggerRef);
  useOnClickOutside(endCalendarRef, closeEndCalendar, endTriggerRef);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    closeStartCalendar(); // Close calendar on select
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(undefined);
    }
  };
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    closeEndCalendar(); // Close calendar on select
  };

  const toggleStartCalendar = () => {
    setIsStartCalendarOpen(!isStartCalendarOpen);
    setIsEndCalendarOpen(false); // Close other calendar
  };
  const toggleEndCalendar = () => {
    setIsEndCalendarOpen(!isEndCalendarOpen);
    setIsStartCalendarOpen(false); // Close other calendar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    await onSave({
      resourceId,
      reason,
      startTime: new Date(`${startDate?.toISOString().split('T')[0]}T${startTime}`),
      endTime: new Date(`${endDate?.toISOString().split('T')[0]}T${endTime}`),
    });
  };

  const handleSelect = (value: string) => {
    console.log('Selected Resource:', value);
    setResourceId(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resource Select */}
      <div className="grid gap-2">
        <Label htmlFor="to-resource">Resource</Label>
        <Select value={resourceId} onValueChange={setResourceId} required disabled={isSaving}>
          <SelectTrigger id="to-resource">
            <SelectValue placeholder="Select Resource..." />
          </SelectTrigger>
          <SelectContent>
            {resources?.length > 0 ? (
              resources.map((resource) => (
                <SelectItem key={resource.id} value={resource.id}>
                  {resource.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="no-resources">
                No resources found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      {/* Reason Input */}
      <div className="grid gap-2">
        <Label htmlFor="to-reason">Reason (Optional)</Label>
        <Input
          id="to-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSaving}
          placeholder="e.g., Vacation, Meeting"
        />
      </div>

      {/* Start Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {/* Start Date */}
        <div className="grid gap-2">
          <Label>Start Date</Label>
          <div className="relative">
            {/* Relative container for popover positioning */}
            <Button
              ref={startTriggerRef} // Attach ref
              type="button"
              variant={'outline'}
              className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}
              onClick={toggleStartCalendar}
              disabled={isSaving}
              aria-expanded={isStartCalendarOpen}
              aria-controls="start-date-calendar-popover"
            >
              <CalendarIcon className="mr-2 h-4 w-4" /> {startDate ? format(startDate, 'PPP') : <span>Pick date</span>}
            </Button>
            {isStartCalendarOpen && (
              <div
                ref={startCalendarRef} // Attach ref
                id="start-date-calendar-popover"
                role="dialog"
                className="absolute z-50 mt-1 w-auto bg-popover text-popover-foreground border rounded-md shadow-lg p-0 animate-in fade-in-0 zoom-in-95"
                style={{ top: '100%', left: 0 }}
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  initialFocus
                  disabled={{ before: startOfDay(new Date()) }}
                />
              </div>
            )}
          </div>
        </div>
        {/* Start Time */}
        <div className="grid gap-2">
          <Label htmlFor="to-start-time">Start Time</Label>
          <Input
            id="to-start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
      </div>

      {/* End Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {/* End Date */}
        <div className="grid gap-2">
          <Label>End Date</Label>
          <div className="relative">
            {/* Relative container */}
            <Button
              ref={endTriggerRef} // Attach ref
              type="button"
              variant={'outline'}
              className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}
              onClick={toggleEndCalendar}
              disabled={isSaving || !startDate} // Disable if no start date
              aria-expanded={isEndCalendarOpen}
              aria-controls="end-date-calendar-popover"
            >
              <CalendarIcon className="mr-2 h-4 w-4" /> {endDate ? format(endDate, 'PPP') : <span>Pick date</span>}
            </Button>
            {isEndCalendarOpen && (
              <div
                ref={endCalendarRef} // Attach ref
                id="end-date-calendar-popover"
                role="dialog"
                className="absolute z-50 mt-1 w-auto bg-popover text-popover-foreground border rounded-md shadow-lg p-0 animate-in fade-in-0 zoom-in-95"
                style={{ top: '100%', left: 0 }} // Adjust positioning if needed
              >
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={{ before: startDate || startOfDay(new Date()) }}
                />
              </div>
            )}
          </div>
        </div>
        {/* End Time */}
        <div className="grid gap-2">
          <Label htmlFor="to-end-time">End Time</Label>
          <Input id="to-end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required disabled={isSaving} />
        </div>
      </div>

      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving || !resourceId || !startDate || !endDate}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Time Off
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
export function HolidayTimeOffManager() {
  // Replace DUMMY DATA with state fetched from your API\
  const { data: resourceData, isLoading: resourceLoading } = useAdminGetResources();
  const { mutateAsync: createBlockedTime, isPending: isSaving } = useAdminCreateResourceBlockedTimes();
  const { mutateAsync: deleteBlockedTime, isPending: isDeleting } = useAdminDeleteResourceBlockedTimes();
  const resources: Resource[] = useMemo(() => {
    return (
      resourceData?.map((resource) => ({
        id: resource.id,
        name: resource.name,
        active: resource.active,
        default_slot_duration_minutes: resource.default_slot_duration_minutes,
        min_booking_lead_time_hours: resource.min_booking_lead_time_hours,
        max_booking_range_days: resource.max_booking_range_days,
      })) || []
    );
  }, [resourceData]);

  const blockedTimes: BlockedTime[] = useMemo(() => {
    if (!resourceData) return [];

    return resourceData.flatMap((resource) =>
      (resource.ResourceBlockedTimes || []).map((block) => ({
        ...block,
        resource_id: resource.id,
        resource_name: resource.name, // Attach name for convenience
      })),
    );
  }, [resourceData]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHolidayDialog, setShowHolidayDialog] = useState(false);
  const [showTimeOffDialog, setShowTimeOffDialog] = useState(false);
  const { toast } = useToast();

  // TODO: Add useEffect to fetch resources and blockedTimes on mount

  // --- API Call Placeholders ---
  const handleAddHoliday = async (data: { reason: string; startDate: Date; endDate: Date }) => {
    await createBlockedTime({
      resource_id: '4dd99b62-afae-4eba-aeda-e4a0f97220d9',
      start_time: data.startDate,
      end_time: data.endDate,
      reason: data.reason,
      company_holiday: true,
    });

    toast({ title: 'Success', description: 'Holiday block created.' });
  };

  const handleAddTimeOff = async (data: { resourceId: string; reason: string; startTime: Date; endTime: Date }) => {
    await createBlockedTime({
      resource_id: data.resourceId,
      start_time: data.startTime,
      end_time: data.endTime,
      reason: data.reason,
    });
  };

  const handleDeleteBlock = async (id: string | number, reason?: string | null) => {
    await deleteBlockedTime({
      id: id,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add Holiday Dialog */}
        <Dialog open={showHolidayDialog} onOpenChange={setShowHolidayDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Company Holiday
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Company Holiday</DialogTitle>
              <DialogDescription> Block this date range for ALL active resources. </DialogDescription>
            </DialogHeader>
            <HolidayForm isSaving={isSaving} onSave={handleAddHoliday} onClose={() => setShowHolidayDialog(false)} />
          </DialogContent>
        </Dialog>

        {/* Add Time Off Dialog */}
        <Dialog open={showTimeOffDialog} onOpenChange={setShowTimeOffDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Specific Time Off
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Resource Time Off</DialogTitle>
              <DialogDescription> Block specific dates/times for one resource (e.g., vacation, meeting). </DialogDescription>
            </DialogHeader>
            <TimeOffForm isSaving={isSaving} resources={resources} onSave={handleAddTimeOff} onClose={() => setShowTimeOffDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table of Existing Blocks */}
      <h3 className="text-lg font-semibold pt-4">Current Blocked Times</h3>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Resource</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : blockedTimes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No holidays or time off scheduled.
                </TableCell>
              </TableRow>
            ) : (
              blockedTimes?.map((block) => (
                <TableRow key={block.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {block.resource_name === 'All Resources' ? (
                      <CalendarOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    {block.resource_name || block.resource_id}
                  </TableCell>
                  <TableCell>{block.reason || 'Blocked'}</TableCell>
                  <TableCell className="text-xs">{format(new Date(block.start_time), 'Pp')}</TableCell> {/* Format date & time */}
                  <TableCell className="text-xs">{format(new Date(block.end_time), 'Pp')}</TableCell> {/* Format date & time */}
                  <TableCell className="text-right">
                    {/* Add Edit button if needed */}
                    {/* Delete Button + Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-7 w-7"
                          title="Delete Block"
                        >
                          <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the blocked time: {block.reason || 'Entry'} from {format(new Date(block.start_time), 'Pp')} to
                            {format(new Date(block.end_time), 'Pp')} for {block.resource_name || block.resource_id}. This might affect
                            multiple resources if it's a holiday.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            variant="destructive"
                            disabled={isDeleting}
                            loading={isDeleting}
                            onClick={() => handleDeleteBlock(block.id, block.reason)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
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
