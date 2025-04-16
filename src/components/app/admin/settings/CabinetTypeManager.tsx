// app/admin/settings/_components/cabinet-types-manager.tsx (Example Path)
'use client';

import React, { useState } from 'react';
// ... (Import necessary components: Table, Dialog, AlertDialog, Button, Input, Label, Switch, Avatar, icons etc.) ...
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
import { Loader2, Pencil, PlusCircle, SquareStack, Trash2 } from 'lucide-react';

// --- Placeholder Types & Data ---
interface CabinetType {
  id: string | number;
  name: string;
  min_height: number | null;
  max_height: number | null;
  min_width: number | null;
  max_width: number | null;
  base_y_lock: number | null; // Assuming feet
  color: string | null; // e.g., 'blue', '#FF0000'
  img_url: string | null;
  active: boolean;
}

// DUMMY DATA - Replace with API call
const DUMMY_CABINET_TYPES: CabinetType[] = [
  {
    id: 1,
    name: 'Base Cabinet 24"',
    min_width: 2,
    max_width: 2,
    min_height: 3,
    max_height: 3,
    base_y_lock: 0,
    color: 'blue',
    img_url: 'https://via.placeholder.com/40/AAAAFF/FFFFFF?text=BC',
    active: true,
  },
  {
    id: 2,
    name: 'Wall Cabinet 30" H',
    min_width: 1,
    max_width: 4,
    min_height: 2.5,
    max_height: 2.5,
    base_y_lock: 4.5,
    color: 'purple',
    img_url: 'https://via.placeholder.com/40/AA44FF/FFFFFF?text=WC',
    active: true,
  },
  {
    id: 3,
    name: 'Tall Pantry 18" W',
    min_width: 1.5,
    max_width: 1.5,
    min_height: 7,
    max_height: 8,
    base_y_lock: 0,
    color: 'indigo',
    img_url: null,
    active: false,
  },
];

// --- Reusable Form Component ---
interface CabinetTypeFormProps {
  initialData?: CabinetType | null;
  onSave: (data: Omit<CabinetType, 'id'> | CabinetType) => Promise<void>;
  onClose: () => void;
}

function CabinetTypeForm({ initialData, onSave, onClose }: CabinetTypeFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [minWidth, setMinWidth] = useState(String(initialData?.min_width ?? ''));
  const [maxWidth, setMaxWidth] = useState(String(initialData?.max_width ?? ''));
  const [minHeight, setMinHeight] = useState(String(initialData?.min_height ?? ''));
  const [maxHeight, setMaxHeight] = useState(String(initialData?.max_height ?? ''));
  const [baseYLock, setBaseYLock] = useState(String(initialData?.base_y_lock ?? '0'));
  const [color, setColor] = useState(initialData?.color || 'gray'); // Default color
  const [imageUrl, setImageUrl] = useState(initialData?.img_url || '');
  const [active, setActive] = useState(initialData?.active ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Helper to parse number inputs, returning null if invalid
  const parseNullableFloat = (val: string): number | null => {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = {
      name,
      min_width: parseNullableFloat(minWidth),
      max_width: parseNullableFloat(maxWidth),
      min_height: parseNullableFloat(minHeight),
      max_height: parseNullableFloat(maxHeight),
      base_y_lock: parseNullableFloat(baseYLock),
      color: color || null,
      img_url: imageUrl || null,
      active,
    };
    // Basic validation example
    if (formData.min_width !== null && formData.max_width !== null && formData.min_width > formData.max_width) {
      toast({ title: 'Validation Error', description: 'Min width cannot be greater than max width.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }
    if (formData.min_height !== null && formData.max_height !== null && formData.min_height > formData.max_height) {
      toast({ title: 'Validation Error', description: 'Min height cannot be greater than max height.', variant: 'destructive' });
      setIsSaving(false);
      return;
    }

    try {
      if (initialData?.id) {
        await onSave({ ...formData, id: initialData.id });
        toast({ title: 'Success', description: 'Cabinet type updated.' });
      } else {
        await onSave(formData);
        toast({ title: 'Success', description: 'Cabinet type created.' });
      }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      toast({ title: 'Error', description: 'Could not save cabinet type.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Placeholder - implement actual image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* ... */
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid gap-2">
        <Label htmlFor="ct-name">Name</Label>
        <Input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
      </div>
      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="ct-min-width">Min Width (ft)</Label>
          <Input
            id="ct-min-width"
            type="number"
            step="0.1"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ct-max-width">Max Width (ft)</Label>
          <Input
            id="ct-max-width"
            type="number"
            step="0.1"
            value={maxWidth}
            onChange={(e) => setMaxWidth(e.target.value)}
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="ct-min-height">Min Height (ft)</Label>
          <Input
            id="ct-min-height"
            type="number"
            step="0.1"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ct-max-height">Max Height (ft)</Label>
          <Input
            id="ct-max-height"
            type="number"
            step="0.1"
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value)}
            disabled={isSaving}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ct-base-y">Base Placement (ft from floor)</Label>
        <Input
          id="ct-base-y"
          type="number"
          step="0.1"
          value={baseYLock}
          onChange={(e) => setBaseYLock(e.target.value)}
          disabled={isSaving}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="ct-color">Display Color</Label>
          <Input
            id="ct-color"
            placeholder="e.g., blue, #FF0000"
            value={color || ''}
            onChange={(e) => setColor(e.target.value)}
            disabled={isSaving}
          />
        </div>
        {/* Preview Color Swatch */}
        <div className="flex items-end">
          <div className="w-8 h-8 rounded border" style={{ backgroundColor: color || 'transparent' }}></div>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ct-image">Image URL / Upload</Label>
        <Input
          id="ct-image-url"
          placeholder="https://..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSaving}
        />
        {/* Add upload button if needed */}
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="ct-active" checked={active} onCheckedChange={setActive} disabled={isSaving} /> <Label htmlFor="ct-active">Active</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Type
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- Main Manager Component ---
const CabinetTypesManager = ({ data: types, isLoading }) => {
  // Replace DUMMY DATA with state fetched from your API
  const [isSavingActive, setIsSavingActive] = useState<Record<string | number, boolean>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingType, setEditingType] = useState<CabinetType | null>(null);
  const { toast } = useToast();

  // --- API Call Placeholders ---
  const handleCreate = async (data: Omit<CabinetType, 'id'>) => {
    /* ... Replace with API call ... */ console.log('API CALL: Create Cabinet Type', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newId = Math.random();
    //setTypes((prev) => [...prev, { ...data, id: newId }]);
  };
  const handleUpdate = async (data: CabinetType) => {
    /* ... Replace with API call ... */ console.log('API CALL: Update Cabinet Type', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setTypes((prev) => prev.map((opt) => (opt.id === data.id ? data : opt)));
  };
  const handleDelete = async (id: string | number) => {
    /* ... Replace with API call ... */ console.log('API CALL: Delete Cabinet Type', id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    //setTypes((prev) => prev.filter((opt) => opt.id !== id));
    toast({ title: 'Success', description: 'Cabinet type deleted.' });
  };
  const handleToggleActive = async (type: CabinetType, newActiveState: boolean) => {
    /* ... Replace with API call ... */ setIsSavingActive((prev) => ({ ...prev, [type.id]: true }));
    console.log('API CALL: Update Active Status', { id: type.id, active: newActiveState });
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      //setTypes((prev) => prev.map((opt) => (opt.id === type.id ? { ...type, active: newActiveState } : opt)));
      toast({ title: 'Status Updated', description: `${type.name} is now ${newActiveState ? 'active' : 'inactive'}.` });
    } catch (error) {
      toast({ title: 'Error', description: `Could not update status for ${type.name}.`, variant: 'destructive' });
    } finally {
      setIsSavingActive((prev) => ({ ...prev, [type.id]: false }));
    }
  };
  console.log('Cabinet Types:', types);
  // TODO: Add useEffect to fetch types on mount

  // Helper to format dimension ranges
  const formatDimRange = (min: number | null, max: number | null, unit: string): string => {
    if (min === null && max === null) return 'Any';
    if (min !== null && max !== null && min === max) return `${min}${unit}`;
    if (min !== null && max !== null) return `${min}-${max}${unit}`;
    if (min !== null) return `≥ ${min}${unit}`;
    if (max !== null) return `≤ ${max}${unit}`;
    return 'N/A';
  };

  return (
    <div className="space-y-4">
      {/* Create Button + Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Cabinet Type
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          {/* Wider dialog for more fields */}
          <DialogHeader>
            <DialogTitle>Add New Cabinet Type</DialogTitle>
            <DialogDescription> Define a base cabinet type for use in projects. </DialogDescription>
          </DialogHeader>
          <CabinetTypeForm onSave={handleCreate} onClose={() => setShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingType} onOpenChange={(open) => !open && setEditingType(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Cabinet Type</DialogTitle> <DialogDescription> Update the details for this cabinet type. </DialogDescription>
          </DialogHeader>
          <CabinetTypeForm initialData={editingType} onSave={handleUpdate} onClose={() => setEditingType(null)} />
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Dimensions (W x H)</TableHead>
              <TableHead>Base Lock (ft)</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : types?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No cabinet types found.
                </TableCell>
              </TableRow>
            ) : (
              types?.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={type.img_url || undefined} alt={type.name} />
                      <AvatarFallback>
                        <SquareStack className="w-4 h-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell className="text-xs">
                    W: {formatDimRange(type.min_width, type.max_width, 'ft')} <br />
                    H: {formatDimRange(type.min_height, type.max_height, 'ft')}
                  </TableCell>
                  <TableCell className="text-xs">{type.base_y_lock ?? 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: type.color || 'transparent' }}></div>
                      <span className="text-xs">{type.color || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${type.id}`}
                        checked={type.active}
                        onCheckedChange={(checked) => handleToggleActive(type, checked)}
                        disabled={isSavingActive[type.id]}
                      />
                      {isSavingActive[type.id] && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => setEditingType(type)}>
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
                            This action cannot be undone. This will permanently delete "{type.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(type.id)}
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

export default CabinetTypesManager;
