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
import SawLoader from '@/components/ui/loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CabinetOptionType } from '@/constants/enums/project.enums';
import { useAdminCreateSettings, useAdminDeleteSettings, useAdminUpdateSettings } from '@/hooks/api/admin/admin.settings.queries';
import { useToast } from '@/hooks/use-toast';

import { List, Loader2, Pencil, PlusCircle, Shapes, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

// --- Placeholder Types & Data ---
interface CustomOption {
  id: string | number;
  name: string;
  type: number;
  value: number | string | null; // Price or configuration value? Assuming number for now.
  image_url: string | null;
  active: boolean;
  room_option_id?: string | number | null; // Optional link
  // Include related room option name if fetched/joined
  // roomOptionName?: string | null;
}

// Assume RoomOptions are fetched for linking (needed for the form's Select)
interface SimpleRoomOption {
  id: string | number;
  name: string;
}

// --- Reusable Form Component ---
interface CustomOptionFormProps {
  initialData?: CustomOption | null;
  roomOptionsList?: SimpleRoomOption[]; // Pass fetched room options for linking

  onClose: () => void;
}

function CustomOptionForm({ initialData, roomOptionsList = [], onClose }: CustomOptionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type); // Consider predefined types
  const [value, setValue] = useState<string>(String(initialData?.value ?? '')); // Keep as string for input, convert on save
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [linkedRoomOptionId, setLinkedRoomOptionId] = useState<string>(String(initialData?.room_option_id ?? ''));
  const { toast } = useToast();
  const { mutateAsync: updateCustomOption, isPending: isSaving } = useAdminUpdateSettings();
  const { mutateAsync: createCustomOption, isPending: isCreating } = useAdminCreateSettings();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericValue = parseFloat(value); // Convert value to number
    let formData = {
      name,
      type,
      value: isNaN(numericValue) ? null : numericValue, // Handle potential NaN
      image_url: imageUrl || null,
      active,
    };
    initialData?.id && formData.id == initialData.id;
    const updateData = {
      updateType: 'CustomOptions',
      updateData: { ...formData },
    };

    if (formData?.id) {
      await updateCustomOption(updateData);
    } else {
      await createCustomOption(updateData);
    }
  };
  console.log(type); // Placeholder - implement actual image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* ... */
  };

  const customOptionTypes = [
    { key: CabinetOptionType.Ceiling, title: 'Ceiling Options', description: 'Options for ceiling styles', icon: <Shapes /> },
    { key: CabinetOptionType.DoorMaterial, title: 'Door Material', description: 'Material options for doors', icon: <Shapes /> },
    { key: CabinetOptionType.SubMaterial, title: 'Sub Material', description: 'Material options for subcomponents', icon: <Shapes /> },
    { key: CabinetOptionType.ConstructionMethod, title: 'Construction Method', description: 'Methods of construction', icon: <Shapes /> },
    { key: CabinetOptionType.ToeStyle, title: 'Toe Style', description: 'Styles for toe kicks', icon: <Shapes /> },
    { key: CabinetOptionType.Crown, title: 'Crown Molding', description: 'Options for crown molding', icon: <Shapes /> },
    { key: CabinetOptionType.LightRail, title: 'Light Rail', description: 'Options for light rail installation', icon: <Shapes /> },
  ];
  console.log(linkedRoomOptionId);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="co-name">Name</Label>
        <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
      </div>
      <div className="grid gap-2">
        <Select id="co-type" value={type} onValueChange={(value) => setType(value)} disabled={isSaving}>
          <SelectTrigger className="w-full h-18">
            <SelectValue
              placeholder={
                <div>
                  <div className="flex flex-row items-center gap-2">
                    <List />
                    <span>Select Custom Option Type</span>
                  </div>
                  <div className="text-sm">Choose from a list of option types</div>
                </div>
              }
            />
          </SelectTrigger>
          <SelectContent className="cursor-pointer max-w-[85vw] z-[9999]">
            {customOptionTypes?.map((type) => (
              <SelectItem key={type.key} value={type.key.toString()}>
                <div className="flex flex-wrap items-center gap-2">
                  {type.icon}
                  <p className="flex-wrap">{type.title}</p>
                </div>
                <div className="text-sm">{type.description}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
const CustomOptionsManager = ({ data, isLoading }) => {
  const options = data?.customOptions;
  // Replace DUMMY DATA/LISTS with state fetched from your API

  const [isSavingActive, setIsSavingActive] = useState<Record<string | number, boolean>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<CustomOption | null>(null);
  const { toast } = useToast();
  const { mutateAsync: updateCustomOption, isPending: isSaving } = useAdminUpdateSettings();
  const { mutateAsync: deleteCustomOption, isPending: isDeleting } = useAdminDeleteSettings();

  const handleDelete = async (id: string | number) => {
    const updateData = {
      updateType: 'CustomOptions',
      updateData: { id: id },
    };
    await deleteCustomOption(updateData);
  };
  const handleToggleActive = async (option: CustomOption, newActiveState: boolean) => {
    setIsSavingActive((prev) => ({ ...prev, [option.id]: true }));
    const updateData = {
      updateType: 'CustomOptions',
      updateData: { ...option, active: newActiveState },
    };
    await updateCustomOption(updateData);
    setIsSavingActive((prev) => ({ ...prev, [option.id]: false }));
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
          <CustomOptionForm onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingOption} onOpenChange={(open) => !open && setEditingOption(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Custom Option</DialogTitle>
            <DialogDescription> Update the details for this custom option. </DialogDescription>
          </DialogHeader>
          <CustomOptionForm initialData={editingOption} onClose={() => setEditingOption(null)} />
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
              options
                ?.sort((a, b) => a.type - b.type)
                .map((option) => (
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
                    <TableCell>{CabinetOptionType[option.type]}</TableCell>
                    <TableCell>{typeof option.value === 'number' ? `$${option.value.toFixed(2)}` : option.value || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {isSavingActive[option.id] ? (
                          <SawLoader className="h-4 w-4 mx-auto" />
                        ) : (
                          <Switch
                            id={`active-${option.id}`}
                            checked={option.active}
                            onCheckedChange={(checked) => handleToggleActive(option, checked)}
                            disabled={isSavingActive[option.id]}
                          />
                        )}
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
