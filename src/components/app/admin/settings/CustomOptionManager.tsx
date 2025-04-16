// app/admin/settings/_components/custom-options-manager.tsx (Example Path)
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

import { Loader2, Pencil, PlusCircle, Shapes, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

// --- Placeholder Types & Data ---
interface CustomOption {
  id: string | number;
  name: string;
  type: string; // Consider using an enum or union type 'Hardware' | 'Accessory' etc.
  value: number | string | null; // Price or configuration value? Assuming number for now.
  image_url: string | null;
  active: boolean;
  room_option_id?: string | number | null; // Optional link
  // Include related room option name if fetched/joined
  // roomOptionName?: string | null;
}

// DUMMY DATA - Replace with API call
const DUMMY_CUSTOM_OPTIONS: CustomOption[] = [
  {
    id: 101,
    name: 'Pull-out Trash Bin (Double)',
    type: 'Accessory',
    value: 150.0,
    image_url: 'https://via.placeholder.com/40/CCCCCC/FFFFFF?text=TR',
    active: true,
    room_option_id: null,
  },
  { id: 102, name: 'Lazy Susan Corner Shelf', type: 'Hardware', value: 95.5, image_url: null, active: true },
  {
    id: 103,
    name: 'Matte Black Handles (Set)',
    type: 'Hardware',
    value: 12.0,
    image_url: 'https://via.placeholder.com/40/000000/FFFFFF?text=BH',
    active: false,
  },
  { id: 104, name: 'Under Cabinet Lighting (LED Strip)', type: 'Accessory', value: 75.0, image_url: null, active: true },
];

// Assume RoomOptions are fetched for linking (needed for the form's Select)
interface SimpleRoomOption {
  id: string | number;
  name: string;
}
const DUMMY_ROOM_OPTIONS_LIST: SimpleRoomOption[] = [
  { id: 1, name: 'Crown Molding - Style A' },
  { id: 2, name: 'Baseboards - 4 inch' },
];

// --- Reusable Form Component ---
interface CustomOptionFormProps {
  initialData?: CustomOption | null;
  roomOptionsList?: SimpleRoomOption[]; // Pass fetched room options for linking
  onSave: (data: Omit<CustomOption, 'id'> | CustomOption) => Promise<void>;
  onClose: () => void;
}

function CustomOptionForm({ initialData, roomOptionsList = [], onSave, onClose }: CustomOptionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || ''); // Consider predefined types
  const [value, setValue] = useState<string>(String(initialData?.value ?? '')); // Keep as string for input, convert on save
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [linkedRoomOptionId, setLinkedRoomOptionId] = useState<string>(String(initialData?.room_option_id ?? ''));
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const numericValue = parseFloat(value); // Convert value to number
    const formData = {
      name,
      type,
      value: isNaN(numericValue) ? null : numericValue, // Handle potential NaN
      image_url: imageUrl || null,
      active,
      room_option_id: linkedRoomOptionId ? linkedRoomOptionId : null, // Send null if empty string
    };
    try {
      if (initialData?.id) {
        await onSave({ ...formData, id: initialData.id });
        toast({ title: 'Success', description: 'Custom option updated.' });
      } else {
        await onSave(formData);
        toast({ title: 'Success', description: 'Custom option created.' });
      }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save custom option.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Placeholder - implement actual image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* ... */
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="co-name">Name</Label>
        <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="co-type">Type</Label>
        <Input
          id="co-type"
          placeholder="e.g., Hardware, Accessory"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          disabled={isSaving}
        />
      </div>
      {/* You might replace the Type Input with a Select if you have predefined types */}
      <div className="grid gap-2">
        <Label htmlFor="co-value">Value / Price</Label>
        <Input
          id="co-value"
          type="number"
          step="0.01"
          placeholder="e.g., 99.99"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isSaving}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="co-image">Image URL / Upload</Label>
        <Input
          id="co-image-url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSaving}
        />
        {/* Add upload button if needed */}
      </div>
      {/* Optional: Link to Room Option */}
      {/* <div className="grid gap-2">
                <Label htmlFor="co-room-option">Link to Room Option (Optional)</Label>
                <Select value={linkedRoomOptionId} onValueChange={setLinkedRoomOptionId} disabled={isSaving}>
                    <SelectTrigger id="co-room-option"> <SelectValue placeholder="None" /> </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {roomOptionsList.map(opt => ( <SelectItem key={opt.id} value={String(opt.id)}>{opt.name}</SelectItem> ))}
                    </SelectContent>
                </Select>
             </div> */}
      <div className="flex items-center space-x-2">
        <Switch id="co-active" checked={active} onCheckedChange={setActive} disabled={isSaving} /> <Label htmlFor="co-active">Active</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Option
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
const CustomOptionsManager = ({ data: options, isLoading }) => {
  // Replace DUMMY DATA/LISTS with state fetched from your API
  const [roomOptionsList, setRoomOptionsList] = useState<SimpleRoomOption[]>(DUMMY_ROOM_OPTIONS_LIST); // Fetch this
  const [isSavingActive, setIsSavingActive] = useState<Record<string | number, boolean>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<CustomOption | null>(null);
  const { toast } = useToast();

  // --- API Call Placeholders ---
  const handleCreate = async (data: Omit<CustomOption, 'id'>) => {
    /* ... Replace with API call ... */ console.log('API CALL: Create Custom Option', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId = Math.random();
    //setOptions((prev) => [...prev, { ...data, id: newId }]);
  };
  const handleUpdate = async (data: CustomOption) => {
    /* ... Replace with API call ... */ console.log('API CALL: Update Custom Option', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setOptions((prev) => prev.map((opt) => (opt.id === data.id ? data : opt)));
  };
  const handleDelete = async (id: string | number) => {
    /* ... Replace with API call ... */ console.log('API CALL: Delete Custom Option', id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setOptions((prev) => prev.filter((opt) => opt.id !== id));
    toast({ title: 'Success', description: 'Custom option deleted.' });
  };
  const handleToggleActive = async (option: CustomOption, newActiveState: boolean) => {
    /* ... Replace with API call ... */ setIsSavingActive((prev) => ({ ...prev, [option.id]: true }));
    console.log('API CALL: Update Active Status', { id: option.id, active: newActiveState });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      //setOptions((prev) => prev.map((opt) => (opt.id === option.id ? { ...option, active: newActiveState } : opt)));
      toast({ title: 'Status Updated', description: `${option.name} is now ${newActiveState ? 'active' : 'inactive'}.` });
    } catch (error) {
      toast({ title: 'Error', description: `Could not update status for ${option.name}.`, variant: 'destructive' });
    } finally {
      setIsSavingActive((prev) => ({ ...prev, [option.id]: false }));
    }
  };

  // TODO: Add useEffect to fetch options and roomOptionsList on mount

  return (
    <div className="space-y-4">
      {/* Create Button + Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Custom Option
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          {/* Adjusted width */}
          <DialogHeader>
            <DialogTitle>Add New Custom Option</DialogTitle>
            <DialogDescription> Define specific features like hardware or accessories. </DialogDescription>
          </DialogHeader>
          <CustomOptionForm roomOptionsList={roomOptionsList} onSave={handleCreate} onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Custom Option</DialogTitle>
            <DialogDescription> Update the details for this custom option. </DialogDescription>
          </DialogHeader>
          <CustomOptionForm
            initialData={editingOption}
            roomOptionsList={roomOptionsList}
            onSave={handleUpdate}
            onClose={() => setEditingOption(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value/Price</TableHead>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : options?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No custom options found.
                </TableCell>
              </TableRow>
            ) : (
              options?.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={option.image_url || undefined} alt={option.name} />
                      <AvatarFallback>
                        <Shapes className="w-4 h-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{option.name}</TableCell>
                  <TableCell>{option.type}</TableCell>
                  <TableCell>{typeof option.value === 'number' ? `$${option.value.toFixed(2)}` : option.value || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${option.id}`}
                        checked={option.active}
                        onCheckedChange={(checked) => handleToggleActive(option, checked)}
                        disabled={isSavingActive[option.id]}
                      />
                      {isSavingActive[option.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                    <div className="col-span-4 flex md:col-span-1">
                      <label className="inline-flex items-center me-5 cursor-pointer">{option.active}</label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setEditingOption(option)}>
                      <Pencil className="h-4 w-4" /> <span className="sr-only">Edit</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete "{option.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(option.id)}
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
    </div>
  );
};

export default CustomOptionsManager;
