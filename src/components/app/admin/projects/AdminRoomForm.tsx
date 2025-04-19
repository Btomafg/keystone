// app/admin/projects/[projectId]/_components/AdminRoomForm.tsx
'use client';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Define Room Type (adjust based on your actual type definitions/enum)
interface Room {
  id?: string | number; // Optional for create
  name: string;
  type: number | string; // Or string if using names directly
  status?: number | string | null; // Optional status
  // Add other simple editable fields if necessary (e.g., height?)
}

// --- Placeholder Room Type Mapping ---
// !!! Replace with your actual room type definitions !!!
const ROOM_TYPES: { value: number; label: string }[] = [
  { value: 0, label: 'Kitchen' },
  { value: 1, label: 'Bathroom' },
  { value: 2, label: 'Office' },
  { value: 3, label: 'Bedroom' },
  { value: 4, label: 'Living Room' },
  { value: 5, label: 'Other' },
];

interface AdminRoomFormProps {
  initialData?: Room | null; // For editing
  projectId: string | number;
  onSave: (data: Omit<Room, 'id'> | Room) => Promise<void>;
  onClose: () => void;
}

export function AdminRoomForm({ initialData, projectId, onSave, onClose }: AdminRoomFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>(''); // Use string for Select value
  // Add other fields like status if needed
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(String(initialData.type ?? '')); // Ensure type is string for Select
    } else {
      // Reset for create form
      setName('');
      setType('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) {
      toast({ title: 'Error', description: 'Please provide a name and select a type.', variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const formData = {
      project_id: projectId, // Add projectId if needed by API
      name,
      type: parseInt(type, 10), // Convert back to number for saving
      // Add other fields
    };

    try {
      if (initialData?.id) {
        await onSave({ ...formData, id: initialData.id });
        toast({ title: 'Success', description: 'Room details updated.' });
      } else {
        await onSave(formData);
        toast({ title: 'Success', description: 'Room created.' });
      }
      onClose(); // Close dialog on success
    } catch (error) {
      console.error('Save Room failed:', error);
      toast({ title: 'Error', description: 'Could not save room details.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="room-name">Room Name</Label>
        <Input
          id="room-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isSaving}
          placeholder="e.g., Master Bathroom"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="room-type">Room Type</Label>
        <Select value={type} onValueChange={setType} required disabled={isSaving}>
          <SelectTrigger id="room-type">
            <SelectValue placeholder="Select type..." />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {ROOM_TYPES.map((rt) => (
              <SelectItem key={rt.value} value={String(rt.value)}>
                {rt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Add other fields like Status dropdown, Height input if needed */}
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving || !name || !type}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Add Room'}
        </Button>
      </DialogFooter>
    </form>
  );
}
