// app/admin/settings/_components/room-options-manager.tsx (Example Path)
'use client'; // Needed for state, dialogs, actions

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
import { Image as ImageIcon, Loader2, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- Placeholder Types & Data ---
// Replace with your actual types and fetch data
interface RoomOption {
  id: string | number;
  name: string;
  image_url: string | null;
  active: boolean;
  // Add other fields if needed for display/editing
}

// --- Reusable Form Component (can be in separate file) ---
interface RoomOptionFormProps {
  initialData?: RoomOption | null; // For editing
  onSave: (data: Omit<RoomOption, 'id'> | RoomOption) => Promise<void>;
  onClose: () => void; // Function to close the dialog
}

function RoomOptionForm({ initialData, onSave, onClose }: RoomOptionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || ''); // Handle image URL state
  const [active, setActive] = useState(initialData?.active);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImageUrl(initialData.image_url || '');
      setActive(initialData.active);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = {
      name,
      image_url: imageUrl || null, // Ensure null if empty
      active,
    };
    try {
      if (initialData?.id) {
        await onSave({ ...formData, id: initialData.id }); // Pass ID for update
        toast({ title: 'Success', description: 'Room option updated.' });
      } else {
        await onSave(formData); // No ID for create
        toast({ title: 'Success', description: 'Room option created.' });
      }
      onClose(); // Close dialog on success
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save room option.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Basic Image Upload Placeholder - Replace with actual upload logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload and set URL - REPLACE THIS
      console.log('Simulating upload for:', file.name);
      const tempUrl = URL.createObjectURL(file); // Temporary local URL
      setImageUrl(tempUrl); // In real app, upload then set the returned URL
      toast({ title: 'Info', description: 'Image preview updated. Implement actual upload.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="ro-name">Name</Label>
        <Input id="ro-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ro-image">Image URL / Upload</Label>
        {/* Simple URL input OR an upload button */}
        <Input
          id="ro-image-url"
          placeholder="https://example.com/image.png (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSaving}
        />
        {/* OR */}
        {/* <Input id="ro-image-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={isSaving} /> */}
        {/* {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-16 w-16 object-cover rounded"/>} */}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="ro-active" checked={active} onCheckedChange={setActive} disabled={isSaving} />
        <Label htmlFor="ro-active">Active</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Option
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
const RoomOptionsManager = ({ data: options, isLoading }) => {
  const [isSavingActive, setIsSavingActive] = useState<Record<string | number, boolean>>({}); // Loading state per switch
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<RoomOption | null>(null);
  const { toast } = useToast();

  // --- API Call Placeholders ---
  const handleCreate = async (data: Omit<RoomOption, 'id'>) => {
    console.log('API CALL: Create Room Option', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId = Math.random(); // Generate dummy ID
    const newOption = { ...data, id: newId };
    // throw new Error("Simulated create error"); // Uncomment to test error
  };

  const handleUpdate = async (data: RoomOption) => {
    console.log('API CALL: Update Room Option', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setOptions((prev) => prev.map((opt) => (opt.id === data.id ? data : opt)));
    // throw new Error("Simulated update error"); // Uncomment to test error
  };

  const handleDelete = async (id: string | number) => {
    console.log('API CALL: Delete Room Option', id);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setOptions((prev) => prev.filter((opt) => opt.id !== id));
    toast({ title: 'Success', description: 'Room option deleted.' });
    // throw new Error("Simulated delete error"); // Uncomment to test error
  };

  const handleToggleActive = async (option: RoomOption, newActiveState: boolean) => {
    setIsSavingActive((prev) => ({ ...prev, [option.id]: true }));
    const updatedOption = { ...option, active: newActiveState };
    console.log('API CALL: Update Active Status', updatedOption);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      //setOptions((prev) => prev.map((opt) => (opt.id === option.id ? updatedOption : opt)));
      toast({ title: 'Status Updated', description: `${option.name} is now ${newActiveState ? 'active' : 'inactive'}.` });
    } catch (error) {
      toast({ title: 'Error', description: `Could not update status for ${option.name}.`, variant: 'destructive' });
      // Revert UI on error is good practice but omitted here for brevity
    } finally {
      setIsSavingActive((prev) => ({ ...prev, [option.id]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Button + Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Room Option
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Room Option</DialogTitle>
            <DialogDescription>Define a new option that can be applied to rooms.</DialogDescription>
          </DialogHeader>
          <RoomOptionForm onSave={handleCreate} onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog (State controlled separately) */}
      <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Room Option</DialogTitle>
            <DialogDescription>Update the details for this room option.</DialogDescription>
          </DialogHeader>
          <RoomOptionForm initialData={editingOption} onSave={handleUpdate} onClose={() => setEditingOption(null)} />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : options?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No room options found.
                </TableCell>
              </TableRow>
            ) : (
              options?.map((option) => (
                <TableRow key={option.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={option.image_url || undefined} alt={option.name} />
                      <AvatarFallback>
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{option.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${option.id}`}
                        checked={option.active}
                        onCheckedChange={(checked) => handleToggleActive(option, checked)}
                        disabled={isSavingActive[option.id]} // Disable while saving this specific switch
                      />
                      {isSavingActive[option.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Edit Button triggers Dialog state change */}
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setEditingOption(option)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    {/* Delete Button + Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the room option "{option.name}".
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

export default RoomOptionsManager;
