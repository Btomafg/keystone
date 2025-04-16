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
import SawLoader from '@/components/ui/loader';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAdminCreateSettings, useAdminDeleteSettings, useAdminUpdateSettings } from '@/hooks/api/admin/admin.settings.queries';
import { useToast } from '@/hooks/use-toast';
import { Image as ImageIcon, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// --- Placeholder Types & Data ---
// Replace with your actual types and fetch data
interface RoomOption {
  id: string | number;
  name: string;
  image_url: string | null;
  active: boolean;
  cabinet_types: string[]; // Array of cabinet type IDs
  // Add other fields if needed for display/editing
}

// --- Reusable Form Component (can be in separate file) ---
interface RoomOptionFormProps {
  initialData?: RoomOption | null; // For editing
  cabinetTypes: any[]; // Replace with actual type for cabinet types

  onClose: () => void; // Function to close the dialog
}

function RoomOptionForm({ initialData, cabinetTypes, onClose }: RoomOptionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || ''); // Handle image URL state
  const [active, setActive] = useState(initialData?.active);
  const [cabinetType, setCabinetType] = useState(initialData?.cabinet_types || []);

  const { toast } = useToast();
  const { mutateAsync: updateRoomOption, isPending: isSaving } = useAdminUpdateSettings();
  const { mutateAsync: createRoomOption, isPending: isCreating } = useAdminCreateSettings();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImageUrl(initialData.image_url || '');
      setActive(initialData.active);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      image_url: imageUrl || null, // Ensure null if empty
      active,
      cabinet_types: cabinetType,
      id: initialData?.id || undefined,
    };
    const updateData = {
      updateType: 'RoomOptions',
      updateData: { ...formData },
    };

    try {
      if (formData?.id) {
        await updateRoomOption(updateData);
      } else {
        await createRoomOption(updateData);
      }
      onClose(); // Close dialog on success
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save room option.', variant: 'destructive' });
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
        <ToggleGroup type="multiple" value={cabinetType} onValueChange={(val) => setCabinetType(val)} className="w-full">
          {cabinetTypes?.map((type) => {
            return (
              <ToggleGroupItem key={type.id} value={type.id} className={`w-1/2 text-xs p-2 rounded-md hover:text-white`}>
                {type.name}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
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
        <Button type="submit" disabled={isSaving} loading={isSaving}>
          Save Option
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
const RoomOptionsManager = ({ data, isLoading }) => {
  const options = data?.roomOptions || [];
  const cabinetTypes = data?.cabinetTypes || [];

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<RoomOption | null>(null);
  const { toast } = useToast();
  const [isSavingActive, setIsSavingActive] = useState<{ [key: string]: boolean }>({});
  const { mutateAsync: updateRoomOption, isPending } = useAdminUpdateSettings();
  const { mutateAsync: deleteRoomOption, isPending: isDeleting } = useAdminDeleteSettings();

  // --- API Call Placeholders ---
  const handleCreate = async (data: Omit<RoomOption, 'id'>) => {
    console.log('API CALL: Create Room Option', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId = Math.random(); // Generate dummy ID
    const newOption = { ...data, id: newId };
    // throw new Error("Simulated create error"); // Uncomment to test error
  };

  const handleDelete = async (id: string | number) => {
    const updateData = {
      updateType: 'RoomOptions',
      updateData: { id: id },
    };
    await deleteRoomOption(updateData);
  };

  const handleToggleActive = async (option: RoomOption, newActiveState: boolean) => {
    setIsSavingActive((prev) => ({ ...prev, [option.id]: true }));
    const updateData = {
      updateType: 'RoomOptions',
      updateData: { ...option, active: newActiveState },
    };
    await updateRoomOption(updateData);
    setIsSavingActive((prev) => ({ ...prev, [option.id]: false }));
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
          <RoomOptionForm cabinetTypes={cabinetTypes} onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog (State controlled separately) */}
      <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Room Option</DialogTitle>
            <DialogDescription>Update the details for this room option.</DialogDescription>
          </DialogHeader>
          <RoomOptionForm initialData={editingOption} cabinetTypes={cabinetTypes} onClose={() => setEditingOption(null)} />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="">Cabinet Types</TableHead>
              <TableHead className="">Active</TableHead>
              <TableHead className=" text-right">Actions</TableHead>
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
              options
                ?.sort((a, b) => a.id - b.id)
                .map((option) => (
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
                    <TableCell className="font-medium">
                      {option?.cabinet_types?.map((optType) => cabinetTypes.find((type) => type.id == optType)?.name).join(', ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {isSavingActive[option.id] ? (
                          <SawLoader className="h-4 w-4 mx-auto" />
                        ) : (
                          <Switch
                            id={`active-${option.id}`}
                            checked={option.active}
                            onCheckedChange={(checked) => handleToggleActive(option, checked)}
                            disabled={isSavingActive[option.id]} // Disable while saving this specific switch
                          />
                        )}
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
