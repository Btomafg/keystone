'use client';
// app/admin/projects/[projectId]/page.tsx (Example Path)
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast'; // Or your hook path

import { AdminCustomerInfoCard } from '@/components/app/admin/projects/AdminCustomerInfoCard';
import { AdminProjectHeader } from '@/components/app/admin/projects/AdminProjectHeader';
import { AdminProjectInfoCard } from '@/components/app/admin/projects/AdminProjectInfoCard';
import { Button } from '@/components/ui/button';
//import { useAdminGetProjectById, useAdminUpdateProjectStatus } from '@/hooks/api/admin/admin.projects.queries';
import { AdminProjectAppointmentsTab } from '@/components/app/admin/projects/AdminProjectAppointmentsTab';
import { AdminProjectFilesTab } from '@/components/app/admin/projects/AdminProjectFilesTab';
import { AdminProjectRoomsTab } from '@/components/app/admin/projects/AdminProjectRoomsTab';
import { AdminQuickNoteCard } from '@/components/app/admin/projects/AdminQuickNoteCard';
import { useAdminGetProjectById, useAdminUpdateProject } from '@/hooks/api/admin/admin.projects.queries';
import { ArrowLeft, CalendarClock, File, ListChecks, Receipt } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Use useParams for App Router

// Potentially add more tabs like Finance, Feedback etc.

// Mapping from your status numbers to names/indices for the stepper
// !!! UPDATE status IDs (0, 1, 2...) to match YOUR backend values !!!
export const PROJECT_STATUS_MAP: { [key: number]: { name: string; stepIndex: number } } = {
  0: { name: 'New', stepIndex: 0 }, // Assuming 0 is New/Review based on image starting at Review
  1: { name: 'Review', stepIndex: 0 }, // Example: Status 1 maps to step 0 ('Review')
  2: { name: 'Consultation', stepIndex: 1 },
  3: { name: 'Design', stepIndex: 2 },
  4: { name: 'Drawing Review', stepIndex: 3 },
  5: { name: 'Sign Agreement', stepIndex: 4 },
  6: { name: 'Down Payment', stepIndex: 5 },
  7: { name: 'Manufacturing', stepIndex: 6 },
  8: { name: 'Shipped', stepIndex: 7 }, // Image stops here, add Painting/Assembly if needed
  // Add Painting, Assembly, Completed statuses here...
  // 9: { name: 'Painting', stepIndex: 8},
  // 10: { name: 'Assembly', stepIndex: 9},
  // 11: { name: 'Completed', stepIndex: 10} // Example
};
export const PROJECT_STEPS = [
  // Must match the order implied by stepIndex above
  'Review',
  'Consultation',
  'Design',
  'Drawing Review',
  'Sign Agreement',
  'Down Payment',
  'Manufacturing',
  'Shipped',
  // 'Painting', 'Assembly', 'Completed' // Add further steps
];

export default function AdminProjectDetailsPage() {
  const pathName = usePathname();
  const projectId = pathName.split('/')[3];
  const { data: project, isLoading } = useAdminGetProjectById();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useAdminUpdateProject();
  const { toast } = useToast();
  console.log(project);
  // Fetch project data - replace with your actual hook/fetching logic
  // Ensure this hook fetches related data like customer, user, rooms etc. or trigger separate fetches
  //const { data: project, isLoading, error } = useAdminGetProjectById(projectId);

  // Mutation hook for updating status
  //const { mutate: updateStatus, isPending: isUpdatingStatus } = useAdminUpdateProjectStatus();

  const handleStatusChange = (newStatusId: number) => {
    if (!project) return;
    console.log(`API CALL: Update project ${project?.id} status to ${newStatusId}`);
    /* updateStatus(
      { projectId: project.id, status: newStatusId },
      {
        onSuccess: () => {
          toast({
            title: 'Status Updated',
            description: `Project moved to ${PROJECT_STATUS_MAP[newStatusId]?.name || 'new status'}.`,
            variant: 'success',
          });
          // Data will refetch automatically if using React Query/SWR, or trigger manual refetch
        },
        onError: (err) => {
          console.error('Status update failed:', err);
          toast({ title: 'Error', description: 'Could not update project status.', variant: 'destructive' });
        },
      },
    ); 
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    // Use notFound() for App Router if appropriate for 404 cases
    // notFound();
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {' '}
        <Alert variant="destructive">
          {' '}
          <AlertTitle>Error</AlertTitle> <AlertDescription>{error?.message || 'Project not found.'}</AlertDescription>{' '}
        </Alert>{' '}
      </div>
    );*/
  };

  // Find current step index based on project status
  const currentStatusInfo = PROJECT_STATUS_MAP[project?.status] || { name: `Unknown (${project?.status})`, stepIndex: -1 };
  const currentStepIndex = currentStatusInfo.stepIndex;

  // Determine next/prev status IDs for buttons (simple sequential example)
  // !!! IMPORTANT: Replace this simple logic with your actual workflow rules !!!
  // E.g., cannot go to "Sign Agreement" unless drawings are approved, etc.
  // This might involve checking other project fields or having dedicated API endpoints per action.
  const prevStatusId = Object.keys(PROJECT_STATUS_MAP).find((key) => PROJECT_STATUS_MAP[parseInt(key)].stepIndex === currentStepIndex - 1);
  const nextStatusId = Object.keys(PROJECT_STATUS_MAP).find((key) => PROJECT_STATUS_MAP[parseInt(key)].stepIndex === currentStepIndex + 1);
  console.log(project);
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-6">
      {/* Back Link */}
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href={'/admin/projects'}>
          {' '}
          {/* Adjust link to your projects list */}
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Link>
      </Button>

      {/* Header with Title and Status Stepper/Controls */}
      <AdminProjectHeader
        project={project}
        steps={PROJECT_STEPS}
        currentStepIndex={currentStepIndex}
        isUpdatingStatus={isUpdatingStatus}
        onStepChange={(direction: 'next' | 'back') => {
          const targetStatusId = direction === 'next' ? nextStatusId : prevStatusId;
          if (targetStatusId !== undefined) {
            handleStatusChange(parseInt(targetStatusId));
          } else {
            console.warn(`Cannot move ${direction} from current status.`);
            toast({ title: 'Action Not Allowed', description: `Cannot move ${direction} from the current status.` });
          }
        }}
        // Logic to disable next/back buttons based on actual workflow rules
        canStepBack={prevStatusId !== undefined}
        canStepNext={nextStatusId !== undefined /* && checkWorkflowConditions(project) */}
      />

      <Separator />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
          <AdminCustomerInfoCard customerId={project?.user_id} />
          <AdminProjectInfoCard project={project} />
          {/* Add Quick Note Card if desired */}
        </div>

        {/* Main Area with Tabs (Left/Center Column) */}
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-4 h-auto">
              <TabsTrigger value="rooms" className="py-2 text-xs sm:text-sm">
                <ListChecks className="w-4 h-4 mr-1.5" />
                Rooms
              </TabsTrigger>
              <TabsTrigger value="files" className="py-2 text-xs sm:text-sm">
                <File className="w-4 h-4 mr-1.5" />
                Files
              </TabsTrigger>
              <TabsTrigger value="schedule" className="py-2 text-xs sm:text-sm">
                <CalendarClock className="w-4 h-4 mr-1.5" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="agreement" className="py-2 text-xs sm:text-sm">
                <Receipt className="w-4 h-4 mr-1.5" />
                Agreement
              </TabsTrigger>
              {/* Add more tabs: Finance, Feedback? */}
            </TabsList>

            <TabsContent value="rooms">
              <AdminProjectRoomsTab project={project} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="files">
              {' '}
              <AdminProjectFilesTab project={project} isLoading={isLoading} />{' '}
            </TabsContent>

            <TabsContent value="schedule">
              {' '}
              <AdminProjectAppointmentsTab project={project} isLoading={isLoading} />{' '}
            </TabsContent>
            {/*<TabsContent value="agreement"> <AdminProjectAgreementTab projectId={project.id} projectStatus={project.status} /> </TabsContent> */}
            {/* Add more TabsContent */}
          </Tabs>
        </div>
      </div>
      <AdminQuickNoteCard project={project} isLoading={isLoading} />
    </div>
  );
}
