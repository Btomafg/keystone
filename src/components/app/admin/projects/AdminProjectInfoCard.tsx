// app/admin/projects/[projectId]/_components/AdminProjectInfoCard.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProjectType } from '@/constants/enums/project.enums'; // Adjust path
import { format } from 'date-fns';
import { Building, CalendarDays, ClipboardList, DollarSign, Edit, House, Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';

// --- Define Project Type (Align with actual Project data structure) ---
interface Project {
  id: string | number;
  name: string;
  description: string | null;
  status: number; // Or string, depending on source
  type: number; // Assuming 0=Residential, 1=Commercial from enum
  estimate: number | null;
  target_install_date: Date | string | null; // Expecting Date object or ISO string
  created_at: Date | string; // Expecting Date object or ISO string
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  // Add other relevant fields
}

// --- Helper Functions ---
const formatCurrency = (amount: number | null | undefined): string => {
  if (amount == null || isNaN(amount)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};
const formatDate = (date: Date | string | null | undefined, fmt: string = 'PPP'): string => {
  if (!date) return 'Not Set';
  try {
    return format(new Date(date), fmt);
  } catch (error) {
    // Use new Date() for flexibility
    return 'Invalid Date';
  }
};

// --- Component Props ---
interface AdminProjectInfoCardProps {
  /** The full project data object, or null/undefined if loading/not found */
  project: Project | null | undefined;
  /** Loading state controlled by the parent */
  isLoading?: boolean;
}

// --- Dummy Data Example ---
export const DUMMY_PROJECT: Project = {
  id: 'PROJ-777',
  name: 'Downtown Cafe Renovation',
  description: 'Complete overhaul of the main seating area and service counter. Includes custom millwork and updated lighting.',
  status: 3, // Example: Design
  type: ProjectType.Commercial, // Assuming 1 = Commercial
  estimate: 75820.5,
  target_install_date: '2025-08-15T00:00:00Z',
  created_at: '2025-04-10T10:30:00Z',
  street: '123 Commerce St',
  city: 'Businessville',
  state: 'FL',
  zip: '33333',
};
// You would pass this or real data like: <AdminProjectInfoCard project={DUMMY_PROJECT} />

export function AdminProjectInfoCard({ project, isLoading = false }: AdminProjectInfoCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Placeholder Edit handler
  const handleSaveChanges = (updatedData: any) => {
    console.log('Save changes clicked', updatedData);
    // Add API call logic here, then close dialog
    setShowEditDialog(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          {' '}
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList /> Project Info
          </CardTitle>{' '}
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardHeader>
          {' '}
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList /> Project Info
          </CardTitle>{' '}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic text-center py-4">Project data not available.</p>
        </CardContent>
      </Card>
    );
  }

  // Process data only if project exists
  const projectTypeLabel =
    project.type === ProjectType.Residential ? 'Residential' : project.type === ProjectType.Commercial ? 'Commercial' : 'N/A';
  const TypeIcon = project.type === ProjectType.Residential ? House : project.type === ProjectType.Commercial ? Building : ClipboardList;
  const fullAddress = [project.street, project.city, project.state, project.zip].filter(Boolean).join(', ');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-muted-foreground" /> Project Info
        </CardTitle>
        {project.description && <CardDescription className="text-sm pt-1">{project.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" /> Estimate:
          </span>
          <span className="font-semibold">{formatCurrency(project.estimate)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Target Install:
          </span>
          <span className="font-medium">{formatDate(project.target_install_date)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <TypeIcon className="h-4 w-4" /> Type:
          </span>
          <span className="font-medium">{projectTypeLabel}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Created:
          </span>
          <span className="font-medium">{formatDate(project.created_at)}</span>
        </div>
        {fullAddress && (
          <div className="flex items-start gap-2 pt-2">
            <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" />
            <span className="text-muted-foreground">{fullAddress}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        {/* Edit Button + Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="mr-2 h-4 w-4" /> Edit Project Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Project Details</DialogTitle>
            </DialogHeader>
            {/* Replace with your actual Edit Form component */}
            <div className="p-6 text-center text-muted-foreground">
              Edit Project Form Component Goes Here
              <p className="italic text-xs">(Pass project data to prefill)</p>
              {/* Example: <EditProjectDetailsForm projectData={project} onSave={handleSaveChanges} onCancel={() => setShowEditDialog(false)} /> */}
              <p className="mt-4">
                <Button onClick={() => setShowEditDialog(false)}>Close Placeholder</Button>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
