// Example Path: app/admin/settings/resources/[resourceId]/availability/page.tsx
// Or components/admin/ResourceAvailabilityManager.tsx

'use client';

import { Alert } from '@/components/ui/alert';
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
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdminGetResourceById } from '@/hooks/api/admin/admin.resources.queries';
import { useOnClickOutside } from '@/hooks/use-on-click-outside'; // Adjust path
import { useToast } from '@/hooks/use-toast';
import { cn, formatDate, formatTime } from '@/lib/utils';
import { format, isBefore } from 'date-fns';
import { ArrowLeft, Calendar as CalendarIcon, Loader2, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react';

// --- Type Definitions --- (Assuming placed above or imported)
interface Resource {
  id: string;
  name: string /* ... */;
}
interface AvailabilityRule {
  id: string | number;
  resource_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}
interface BlockedTime {
  id: string | number;
  resource_id: string;
  start_time: Date;
  end_time: Date;
  reason?: string | null;
} // Use Date objects here
// Define types matching your data structures
interface Resource {
  id: string;
  name: string;
  // other fields if needed
}

interface AvailabilityRule {
  id: string | number;
  resource_id: string;
  day_of_week: number; // 0=Sun, 6=Sat
  start_time: string; // "HH:mm" or "HH:mm:ss"
  end_time: string; // "HH:mm" or "HH:mm:ss"
}

interface ResourceAvailabilityManagerProps {
  resourceId: string;
}
// --- Helper Functions ---

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// --- Availability Rule Form ---
interface AvailabilityRuleFormProps {
  initialData?: AvailabilityRule | null;
  resourceId: string;
  onSave: (data: Omit<AvailabilityRule, 'id' | 'resource_id'> | AvailabilityRule) => Promise<void>;
  onClose: () => void;
}

function AvailabilityRuleForm({ initialData, resourceId, onSave, onClose }: AvailabilityRuleFormProps) {
  // State for the form (allows selecting multiple days for the same time block)
  const [selectedDays, setSelectedDays] = useState<number[]>(initialData ? [initialData.day_of_week] : []);
  const [startTime, setStartTime] = useState(initialData?.start_time.substring(0, 5) || '09:00'); // Expect HH:mm format for input
  const [endTime, setEndTime] = useState(initialData?.end_time.substring(0, 5) || '17:00'); // Expect HH:mm format for input
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays((prev) => (prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one day.', variant: 'destructive' });
      return;
    }
    // Basic time validation (ensure format is HH:mm and end > start)
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      toast({ title: 'Error', description: 'Please enter valid start and end times in HH:mm format.', variant: 'destructive' });
      return;
    }
    if (startTime >= endTime) {
      toast({ title: 'Error', description: 'End time must be after start time.', variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      // If editing, only one rule is saved. If creating, multiple rules might be created by parent/backend.
      // Let's assume onSave handles creating multiple if needed based on selectedDays array
      const commonData = {
        start_time: `${startTime}:00`, // Add seconds if needed by backend TIME type
        end_time: `${endTime}:00`,
        // Pass selected days separately for creation logic if needed,
        // or just pass the first day if editing (assuming edit doesn't change day)
        day_of_week: initialData ? initialData.day_of_week : selectedDays[0], // Simplification for edit
        selectedDays: initialData ? undefined : selectedDays, // Pass array only for create maybe? Adjust API contract.
      };

      if (initialData?.id) {
        await onSave({ ...commonData, id: initialData.id, resource_id: resourceId }); // Pass ID for update
        toast({ title: 'Success', description: 'Availability rule updated.' });
      } else {
        // Assuming onSave can handle the array of selectedDays for creating multiple rules
        await onSave({ ...commonData, resource_id: resourceId });
        toast({ title: 'Success', description: `Availability rule(s) created for selected day(s).` });
      }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save availability rule.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!initialData && (
        <div className="grid gap-2">
          <Label>Select Day(s)</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {daysOfWeek.map((day, index) => (
              <Button
                key={day}
                type="button"
                variant={selectedDays.includes(index) ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleDayToggle(index)}
                className="text-xs"
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      )}
      {initialData && (
        <div className="grid gap-2">
          <Label>Day</Label>
          <Input value={daysOfWeek[initialData.day_of_week]} readOnly disabled />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="rule-start-time">Start Time</Label>
          <Input
            id="rule-start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            disabled={isSaving}
            step="1800"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rule-end-time">End Time</Label>
          <Input
            id="rule-end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            disabled={isSaving}
            step="1800"
          />
        </div>
      </div>

      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button loading={isSaving} type="submit" disabled={isSaving || (!initialData && selectedDays.length === 0)}>
          {initialData ? 'Update Rule' : 'Add Rule(s)'}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Blocked Time Form ---
interface BlockedTimeFormProps {
  resourceId: string;
  // initialData?: BlockedTime | null; // Add if edit functionality is needed
  onSave: (data: { resourceId: string; reason: string; startTime: Date; endTime: Date }) => Promise<void>;
  onClose: () => void;
}

function BlockedTimeForm({ resourceId, onSave, onClose }: BlockedTimeFormProps) {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('00:00'); // Default start time for block
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState('23:59'); // Default end time for block (full day-ish)
  const [isSaving, setIsSaving] = useState(false);
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  const { toast } = useToast();

  // Refs and hook for click outside
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const startTriggerRef = useRef<HTMLButtonElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);
  const endTriggerRef = useRef<HTMLButtonElement>(null);
  useOnClickOutside(startCalendarRef, () => setIsStartCalendarOpen(false), startTriggerRef);
  useOnClickOutside(endCalendarRef, () => setIsEndCalendarOpen(false), endTriggerRef);

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    setIsStartCalendarOpen(false);
    if (date && endDate && isBefore(endDate, date)) {
      setEndDate(undefined);
    }
  };
  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setIsEndCalendarOpen(false);
  };
  const toggleStartCalendar = () => {
    setIsStartCalendarOpen(!isStartCalendarOpen);
    setIsEndCalendarOpen(false);
  };
  const toggleEndCalendar = () => {
    setIsEndCalendarOpen(!isEndCalendarOpen);
    setIsStartCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Please select start/end dates.', variant: 'destructive' });
      return;
    }
    try {
      const startDateTime = new Date(startDate);
      const [startH, startM] = startTime.split(':').map(Number);
      startDateTime.setHours(startH, startM, 0, 0);

      const endDateTime = new Date(endDate);
      const [endH, endM] = endTime.split(':').map(Number);
      endDateTime.setHours(endH, endM, 0, 0);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime()) || !isBefore(startDateTime, endDateTime)) {
        toast({ title: 'Error', description: 'Invalid date/time range. End must be after start.', variant: 'destructive' });
        return;
      }

      setIsSaving(true);
      await onSave({ resourceId, reason: reason || 'Time Off', startTime: startDateTime, endTime: endDateTime });
      toast({ title: 'Success', description: 'Blocked time created.' });
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save blocked time.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="bt-reason">Reason</Label>
        <Input
          id="bt-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSaving}
          placeholder="e.g., Vacation, Meeting, Lunch"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <div className="grid gap-2">
          <Label>Start Date</Label>
          <div className="relative">
            <Button
              ref={startTriggerRef}
              type="button"
              variant={'outline'}
              className={cn(/*...*/)}
              onClick={toggleStartCalendar}
              disabled={isSaving}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : 'Pick date'}
              </span>
            </Button>
            {isStartCalendarOpen && (
              <div
                ref={startCalendarRef}
                className="absolute z-50 mt-1 w-auto bg-popover text-popover-foreground border rounded-md shadow-lg p-0"
                style={{ top: '100%', left: 0 }}
              >
                <Calendar mode="single" selected={startDate} onSelect={handleStartDateSelect} initialFocus />
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bt-start-time">Start Time</Label>
          <Input
            id="bt-start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <div className="grid gap-2">
          <Label>End Date</Label>
          <div className="relative">
            <Button
              ref={endTriggerRef}
              type="button"
              variant={'outline'}
              className={cn(/*...*/)}
              onClick={toggleEndCalendar}
              disabled={isSaving || !startDate}
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : 'Pick date'}
              </span>
            </Button>
            {isEndCalendarOpen && (
              <div
                ref={endCalendarRef}
                className="absolute z-50 mt-1 w-auto bg-popover text-popover-foreground border rounded-md shadow-lg p-0"
                style={{ top: '100%', left: 0 }}
              >
                <Calendar mode="single" selected={endDate} onSelect={handleEndDateSelect} initialFocus disabled={{ before: startDate }} />
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bt-end-time">End Time</Label>
          <Input id="bt-end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required disabled={isSaving} />
        </div>
      </div>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving || !startDate || !endDate}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Blocked Time
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Availability Manager Component ---
export function ResourceAvailabilityManager() {
  const pathName = usePathname();
  const resourceId = pathName.split('/')[4]; // Adjust based on your routing structure
  const { data: resource, isLoading } = useAdminGetResourceById({ id: resourceId });
  const rules = resource?.ResourceAvailibilityRules || [];
  const blockedTimes = resource?.ResourceBlockedTimes || [];
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<AvailabilityRule | null>(null); // For editing rules
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  // Fetch data on mount or when resourceId changes

  // --- API Call Placeholders ---
  const handleSaveRule = async (data: Omit<AvailabilityRule, 'id' | 'resource_id'> | AvailabilityRule) => {
    // If creating multiple days, backend needs to handle loop or frontend calls multiple times
    console.log('API CALL: Save Availability Rule(s)', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In real app: Call API, then refetch data
    // Refetch data on success
  };

  const handleDeleteRule = async (id: string | number) => {
    console.log('API CALL: Delete Availability Rule', id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Refetch data
    toast({ title: 'Success', description: 'Availability rule deleted.' });
  };

  const handleSaveBlock = async (data: { resourceId: string; reason: string; startTime: Date; endTime: Date }) => {
    console.log('API CALL: Save Blocked Time', { ...data, startTime: data.startTime.toISOString(), endTime: data.endTime.toISOString() }); // Send ISO string likely
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Refetch data
  };

  const handleDeleteBlock = async (id: string | number, reason?: string | null) => {
    console.log('API CALL: Delete Blocked Time', id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Refetch data
    toast({ title: 'Success', description: `Blocked time (${reason || 'entry'}) deleted.` });
  };

  // Group rules by day for display
  const rulesByDay = useMemo(() => {
    const grouped: { [key: number]: AvailabilityRule[] } = {};
    rules.forEach((rule) => {
      if (!grouped[rule.day_of_week]) {
        grouped[rule.day_of_week] = [];
      }
      grouped[rule.day_of_week].push(rule);
      // Sort blocks within the day
      grouped[rule.day_of_week].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    return grouped;
  }, [rules]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!resource) {
    return <Alert variant="destructive">Resource not found.</Alert>;
  }

  return (
    <div className="space-y-8">
      <Button className="hover:cursor-pointer" variant="outline" size="sm" asChild onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources List
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recurring Weekly Availability</CardTitle>
            <CardDescription>Set the standard available hours for each day.</CardDescription>
          </div>

          <Dialog
            open={showRuleDialog}
            onOpenChange={(open) => {
              setShowRuleDialog(open);
              if (!open) setEditingRule(null);
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit' : 'Add'} Availability Rule</DialogTitle>
                <DialogDescription>Define a block of available time for one or more days.</DialogDescription>
              </DialogHeader>
              <AvailabilityRuleForm
                initialData={editingRule}
                resourceId={resourceId}
                onSave={handleSaveRule}
                onClose={() => {
                  setShowRuleDialog(false);
                  setEditingRule(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b pb-3 last:border-b-0">
              <Label className="w-full sm:w-24 flex-shrink-0 pt-1 font-medium">{day}</Label>
              <div className="flex-grow space-y-1.5">
                {rulesByDay[index] && rulesByDay[index].length > 0 ? (
                  rulesByDay[index].map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between text-sm bg-muted/40 p-1.5 rounded text-muted-foreground"
                    >
                      <span>
                        {formatTime(rule.start_time)} - {formatTime(rule.end_time)}
                      </span>
                      <div className="space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setEditingRule(rule);
                            setShowRuleDialog(true);
                          }}
                        >
                          <span className="sr-only">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-6 w-6">
                              <span className="sr-only">
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete the {formatTime(rule.start_time)} - {formatTime(rule.end_time)} block for {day}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRule(rule.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Specific Date Overrides / Time Off</CardTitle>
            <CardDescription>Add specific dates or times when this resource is unavailable (e.g., holidays, vacations).</CardDescription>
          </div>

          <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <span>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Blocked Time
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Blocked Time</DialogTitle>
                <DialogDescription>Block specific dates/times for this resource.</DialogDescription>
              </DialogHeader>
              <BlockedTimeForm
                resourceId={resourceId}
                resources={[resource]} // Pass current resource only? Or all? Pass current for simplicity.
                onSave={handleSaveBlock}
                onClose={() => setShowBlockDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reason</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blockedTimes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No specific blocked times found.
                    </TableCell>
                  </TableRow>
                ) : (
                  blockedTimes.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell>{block.reason || 'Blocked'}</TableCell>
                      <TableCell className="text-xs">{formatDate(block.start_time)}</TableCell>
                      <TableCell className="text-xs">{formatDate(block.end_time)}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-7 w-7"
                              title="Delete Block"
                            >
                              <span className="sr-only">
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Delete blocked time: {block.reason || 'Entry'} from {formatDate(block.start_time)} to
                                {formatDate(block.end_time)}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBlock(block.id, block.reason)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
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
        </CardContent>
      </Card>
    </div>
  );
}

// Dummy Data (for testing inside this component file if needed)
// In real app, remove these and fetch data in fetchData function
const DUMMY_RULES_DATA: AvailabilityRule[] = [
  { id: 1, resource_id: '520bbcd9-389c-450c-a20d-2dcd55df99cf', day_of_week: 1, start_time: '09:00:00', end_time: '12:00:00' },
  { id: 2, resource_id: '520bbcd9-389c-450c-a20d-2dcd55df99cf', day_of_week: 1, start_time: '13:00:00', end_time: '17:00:00' },
  { id: 3, resource_id: '520bbcd9-389c-450c-a20d-2dcd55df99cf', day_of_week: 2, start_time: '09:00:00', end_time: '15:00:00' },
  // Add more rules as needed
];
