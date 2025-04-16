// Example File Path: components/CustomerProjectDetails.tsx
// OR app/projects/[projectId]/page.tsx (adjust imports/exports as needed)

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGetUser } from '@/hooks/api/users.queries';
import { cn } from '@/lib/utils';
import { toUSD } from '@/utils/common';
import {
  Check,
  CircleDollarSign,
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Info,
  ListChecks,
  MessageCircleQuestion,
} from 'lucide-react'; // Added Clock, FileIcon, Download
import React from 'react';
import { ProjectAgreementSignature } from './ProjectAgreementSignature';
import ProjectDesignInProgress from './ProjectDesignInProgress';
import { ProjectDownPayment } from './ProjectDownPayment';
import ProjectDrawingReview from './ProjectDrawingReview';
import ProjectManufacturing from './ProjectManufacturing';
import ProjectScheduleConsultation from './ProjectScheduleConsultation';
import { ProjectShipped } from './ProjectShipped';

// --- Updated Data Types (Matching API + Files) ---

interface ApiCabinet {
  /* ... as before ... */
}
interface ApiWall {
  /* ... as before ... */
}
interface ApiRoom {
  /* ... as before ... */
}

// ADDED: Placeholder for File Data
interface ApiFile {
  id: string | number;
  name: string;
  url: string; // URL to view/download the file
  uploadedAt?: string | null; // ISO date string
  type?: 'drawing' | 'image' | 'document' | 'other'; // Optional type hint for icons
}

interface ApiProject {
  id: number;
  name: string; // Customer Name in example
  description: string | null;
  status: number; // Needs mapping to the NEW steps
  type: number;
  estimate: number | null;
  rooms: ApiRoom[];
  // Assume files might come with the project or via a separate fetch
  files?: ApiFile[]; // ADDED: Array of files associated with the project

  // --- ADD other fields if available ---
  // street?: string | null;
  // city?: string | null;
  // state?: string | null;
  // zip?: string | null;
  // due_date?: string | null;
  // created_at?: string | null;
}

// --- Helper Functions ---

const formatCurrency = (amount: number | null | undefined): string => {
  /* ... as before ... */
};
const formatDate = (dateString: string | null | undefined, dateFormat: string = 'PPP'): string => {
  /* ... as before ... */
};

// --- UPDATED MAPPINGS (!!! IMPORTANT: UPDATE THESE WITH YOUR ACTUAL STATUS IDs !!!) ---
const projectSteps = [
  // NEW Steps
  'new',
  'Review',
  'Consultation',
  'Design',
  'Drawing Review',
  'Sign Agreement',
  'Down Payment',
  'Manufacturing',
  'Shipped',
];

// !!! THIS IS A PLACEHOLDER MAPPING - UPDATE 'statusId' KEYS to match your API !!!
const projectStatusMapping: { [key: number]: { name: string; stepIndex: number } } = {
  1: { name: 'Review', stepIndex: 1 },
  2: { name: 'Consultation', stepIndex: 2 },
  3: { name: 'Design', stepIndex: 3 },
  4: { name: 'Drawing Review', stepIndex: 4 },
  5: { name: 'Sign Agreement', stepIndex: 5 },
  6: { name: 'Down Payment', stepIndex: 6 },
  7: { name: 'Manufacturing', stepIndex: 7 },
  8: { name: 'Shipped', stepIndex: 8 },
};

const getStatusInfo = (
  statusId: number,
): { name: string; stepIndex: number; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' } => {
  const info = projectStatusMapping[statusId] || { name: `Status ${statusId}`, stepIndex: -1 };
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' = 'default';
  const finalStepIndex = projectSteps.length - 1;

  // Assign variant based on name or step index (customize colors)
  if (info.stepIndex === finalStepIndex) variant = 'success'; // Last step is success
  else if (info.stepIndex === 0) variant = 'info'; // First step
  else if (info.stepIndex > 0 && info.stepIndex < finalStepIndex) variant = 'warning'; // Intermediate steps are warning/in-progress
  // Add specific overrides if needed e.g., else if (info.name === 'On Hold') variant = 'secondary';

  return { ...info, variant };
};

const mapRoomType = (typeId: number): string => {
  /* ... as before ... */
};

// Helper to get file icon
const getFileIcon = (fileType?: ApiFile['type']): React.ReactNode => {
  switch (fileType) {
    case 'drawing':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'image':
      return <ImageIcon className="h-5 w-5 text-purple-500" />;
    case 'document':
      return <FileText className="h-5 w-5 text-green-500" />;
    default:
      return <FileIcon className="h-5 w-5 text-gray-500" />;
  }
};

// --- Component Props ---

interface CustomerProjectDetailsProps {
  project: ApiProject;
  // Files might be included in project or passed separately
  // files?: ApiFile[];
}
type AgreementStatus = 'pending_signature' | 'signed' | 'declined' | 'error' | 'processing';

interface AgreementFile {
  name: string;
  url: string; // URL to view/download the agreement PDF
}
interface DrawingFile {
  id: string | number;
  name: string;
  url: string;
  uploadedAt?: string | null;
}
interface ProjectAgreementSignatureProps {
  projectId: number | string;
  customerName: string; // For context
  /** Current status of the agreement signing process */
  agreementStatus: AgreementStatus;
  /** The agreement document details (optional, for preview) */
  agreementDocument?: AgreementFile | null;
  /** Callback function to initiate the signing process (e.g., redirects to e-sign provider) */
  onStartSigning: () => Promise<void> | void; // Make async if needed
  /** Optional: Date when the agreement was signed */
  signedDate?: Date | string | null;
  /** Optional: Reason if declined or error message */
  statusReason?: string | null;
}

type PaymentStatus = 'required' | 'processing' | 'paid' | 'error';

interface ProjectDownPaymentProps {
  projectId: number | string;
  customerName: string; // For context
  /** The total estimate amount for the project */
  totalEstimate: number;
  /** The required down payment percentage (e.g., 50 for 50%) */
  downPaymentPercentage: number;
  /** Current payment status of the down payment */
  paymentStatus: PaymentStatus;
  /** Optional: Date when the payment was successfully made */
  paymentDate?: Date | string | null;
  /** Optional: Error message if status is 'error' */
  paymentError?: string | null;
  /**
   * Async function to call your backend API.
   * Should create a Stripe Checkout session for the down payment
   * and return the session ID or an error message.
   * Example return: Promise<{ sessionId?: string; error?: string }>
   */
  onCreateCheckoutSession: () => Promise<{ sessionId?: string; error?: string }>;
}

interface ProjectManufacturingProps {
  projectId: number | string;
  customerName: string; // For context
  /** Optional: Estimated date for manufacturing completion */
  estimatedManufacturingCompletionDate?: Date | string | null;
  /** Optional: Description of the next step after manufacturing */
  nextStep?: string | null; // e.g., "Painting", "Assembly", "Installation Scheduling"
  /** Optional: Handler for a contact button */
  onContactUs?: () => void;
}

interface ProjectShippedProps {
  projectId: number | string;
  customerName: string; // For context
  /** Optional: Date the items were shipped */
  shippedDate?: Date | string | null;
  /** Optional: Name of the shipping carrier */
  shippingCarrier?: string | null;
  /** Optional: Tracking number */
  trackingNumber?: string | null;
  /** Optional: Direct URL to track the shipment */
  trackingUrl?: string | null;
  /** Optional: Estimated delivery date */
  estimatedDeliveryDate?: Date | string | null;
  /** Optional: Specific instructions for next steps (delivery/installation) */
  nextStepInstructions?: string | null;
  /** Optional: Handler for a contact button */
  onContactUs?: () => void;
}
export default function CustomerProjectDetails({ project }: CustomerProjectDetailsProps) {
  // Placeholder action handlers
  const handleContactSupport = () => console.log('Contact support clicked', project?.id);
  const { data: user } = useGetUser();
  const handleScheduleConsultation = () => {
    console.log('Schedule consultation clicked', project?.id);
    // Add logic here: redirect to scheduling page/app, open modal, etc.
    alert('Redirecting to schedule consultation (implement actual logic).');
  };
  const [DrawingReview, setDrawingReview] = React.useState<'pending' | 'approved' | 'revisions_requested'>('pending');
  const { name: projectStatusText, stepIndex: currentStatusIndex, variant: statusVariant } = getStatusInfo(project?.status);
  const [status, setStatus] = React.useState(currentStatusIndex);
  // --- Determine if Scheduling CTA should be shown ---
  // !!! ADJUST condition based on your actual status IDs for 'Review' or 'Consultation' !!!
  const showScheduleButton = project?.status === 1 || project?.status === 2;
  const showProjectDesignInProgress = project?.status === 3;
  const showDrawingReview = project?.status === 4 || project?.status == 5;

  const files = project?.files || [];

  const RenderStatusComponent = () => {
    switch (status) {
      case 1: // Review
        return <ProjectScheduleConsultation projectId={project?.id} />;
      case 2: // Review
        return <ProjectScheduleConsultation projectId={project?.id} />;
      case 3: // Design
        return <ProjectDesignInProgress projectId={project?.id} customerName={user?.name} />;
      case 4: // Drawing Review
        return (
          <ProjectDrawingReview
            reviewStatus={DrawingReview}
            onApprove={() => setDrawingReview('approved')}
            onRequestRevisions={() => setDrawingReview('revisions_requested')}
            projectId={project?.id}
            drawings={[
              {
                id: 'drawing1',
                name: 'Drawing 1',
                url: 'https://clubrunner.blob.core.windows.net/00000100463/en-ca/files/homepage/sample-pdf-page/SamplePDFPage.pdf',
              },
            ]} // Example drawing
          />
        );
      case 5: // Sign Agreement
        return (
          <ProjectAgreementSignature
            projectId={project?.id}
            customerName={user?.name}
            agreementStatus="signed"
            agreementDocument={{
              name: 'Project Agreement',
              url: 'https://example.com/agreement.pdf',
            }} // Example agreement document
            onStartSigning={async () => {
              // Simulate signing process
              console.log('Signing agreement for project:', project?.id);
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
              alert('Agreement signing process started (implement actual logic).');
            }}
            signedDate={null} // Example signed date
            statusReason={null} // Example reason
          />
        );
      case 6: // Down Payment
        return (
          <ProjectDownPayment
            projectId={project?.id}
            customerName={user?.name}
            totalEstimate={project?.estimate || 0}
            downPaymentPercentage={50} // Example percentage
            paymentStatus="paid"
            onCreateCheckoutSession={async () => {
              // Simulate creating a checkout session
              console.log('Creating checkout session for project:', project?.id);
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
              return { sessionId: 'example-session-id', error: null }; // Example response
            }}
            paymentDate={null} // Example payment date
            paymentError={null} // Example error
          />
        );
      case 7: // Manufacturing
        return (
          <ProjectManufacturing
            projectId={project?.id}
            customerName={user?.name}
            estimatedManufacturingCompletionDate={null} // Example date
            nextStep="Shipping" // Example next step
            onContactUs={handleContactSupport}
          />
        );
      case 8: // Shipped
        return (
          <ProjectShipped
            projectId={project?.id}
            customerName={user?.name}
            shippedDate={null} // Example shipped date
            shippingCarrier="FedEx" // Example carrier
            trackingNumber="123456789" // Example tracking number
            trackingUrl="https://www.fedex.com/fedextrack/?tracknumbers=123456789" // Example tracking URL
            estimatedDeliveryDate={null} // Example delivery date
            nextStepInstructions="Please contact us upon delivery to coordinate the next steps, such as installation."
            onContactUs={handleContactSupport}
          />
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl space-y-6">
        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-1">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Project for {project?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Current Status:{' '}
              <span
                className={cn(
                  'font-semibold',
                  statusVariant === 'success'
                    ? 'text-green-600'
                    : statusVariant === 'warning'
                    ? 'text-amber-600'
                    : statusVariant === 'info'
                    ? 'text-blue-600'
                    : 'text-foreground',
                )}
              >
                {projectStatusText}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleContactSupport}>
              <MessageCircleQuestion className="mr-2 h-4 w-4" /> Contact Us
            </Button>
          </div>
        </div>

        {/* --- Progress Stepper --- */}
        <Card className="mb-6 bg-muted/40">
          <CardHeader className="flex flex-row items-center  justify-between">
            <CardTitle className="text-base sm:text-lg">Project Progress</CardTitle>{' '}
            <div className="flex gap-3">
              <Button size="xs" onClick={() => setStatus(status - 1)}>
                Step Back
              </Button>
              <Button size="xs" onClick={() => setStatus(status + 1)}>
                Step Next
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start space-x-1 overflow-x-auto py-2">
              {projectSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center text-center flex-shrink-0 w-[65px] sm:w-auto sm:flex-1 px-1">
                        <div
                          className={cn(
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 mb-1.5 transition-all duration-300',
                            index < status ? 'bg-green-600 border-green-600 text-white' : '', // Completed
                            index === status ? 'bg-blue-600 border-blue-600 text-white scale-110 ring-4 ring-blue-200' : '', // Active
                            index > status ? 'bg-card border-border text-muted-foreground' : '', // Future
                          )}
                        >
                          {index < status ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : index + 1}
                        </div>
                        <p
                          className={cn(
                            'text-[10px] sm:text-xs leading-tight', // Smaller text for more steps
                            index === status ? 'font-semibold text-blue-700' : 'text-muted-foreground',
                          )}
                        >
                          {step}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{index < status ? 'Completed' : index === status ? 'Current Step' : 'Upcoming'}</TooltipContent>
                  </Tooltip>
                  {/* Line Separator */}
                  {index < projectSteps.length - 1 && <div className="flex-grow h-px bg-border mt-4 hidden sm:block" />}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        <RenderStatusComponent />

        {/* --- Main Content Tabs (Rooms & Files) --- */}
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            {' '}
            {/* Changed to 2 cols */}
            <TabsTrigger value="rooms">
              <ListChecks className="mr-1.5 h-4 w-4 inline" />
              Rooms ({project?.rooms?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="files">
              <FileText className="mr-1.5 h-4 w-4 inline" />
              Files ({files.length})
            </TabsTrigger>
            {/* Remove unused tabs */}
          </TabsList>

          {/* Rooms Tab Content */}
          <TabsContent value="rooms">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5" /> Project Rooms
                </CardTitle>
                <CardDescription>Overview of the rooms included in this project?. Click on a room to see included items.</CardDescription>
              </CardHeader>
              <CardContent>
                {project?.rooms && project?.rooms.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {project?.rooms.map((room) => (
                      <AccordionItem
                        key={room.id}
                        value={`room-${room.id}`}
                        className="border rounded-md bg-background hover:bg-muted/50 transition-colors"
                      >
                        <AccordionTrigger className="flex justify-between items-center py-3 px-4 text-base hover:no-underline">
                          {/* ... Room name, type, estimate ... */}
                          <div className="text-left space-y-0.5">
                            {' '}
                            <p className="font-semibold">{room.name}</p>{' '}
                            <p className="text-xs text-muted-foreground">{mapRoomType(room.type)}</p>{' '}
                          </div>{' '}
                          <div className="flex items-center ml-4">
                            {' '}
                            <span className="text-sm font-medium text-foreground mr-4">{formatCurrency(room.estimate)}</span>{' '}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-4 px-4 space-y-3 text-sm bg-muted/30">
                          {/* ... Expanded content showing walls/cabinets ... */}
                          <p className="font-medium text-muted-foreground pt-2">Included Items:</p>
                          {room.walls.map((wall) =>
                            wall.cabinets && wall.cabinets.length > 0 ? (
                              <div key={wall.id} className="pl-3 border-l-2 border-border ml-1 py-1">
                                {' '}
                                <p className="text-xs font-semibold text-foreground mb-1">{wall.name}:</p>{' '}
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  {' '}
                                  {wall.cabinets.map((cab) => (
                                    <li key={cab.id} className="flex justify-between items-center">
                                      {' '}
                                      <span>- {cab.name}</span>{' '}
                                    </li>
                                  ))}{' '}
                                </ul>{' '}
                              </div>
                            ) : null,
                          )}
                          {room.walls.every((wall) => !wall.cabinets || wall.cabinets.length === 0) && (
                            <p className="text-xs italic text-muted-foreground pl-4">No specific items listed for this room.</p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    No specific room details available for this project yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab Content */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Project Files
                </CardTitle>
                <CardDescription>View or download files related to your project, such as drawings or documents.</CardDescription>
              </CardHeader>
              <CardContent>
                {files.length > 0 ? (
                  <ul className="space-y-3">
                    {files.map((file) => (
                      <li key={file.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-accent">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.type)}
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            {file.uploadedAt && <p className="text-xs text-muted-foreground">Uploaded: {formatDate(file.uploadedAt)}</p>}
                          </div>
                        </div>
                        {/* Use Next Link for internal routes, direct anchor for external URLs */}
                        <a href={file.url} target="_blank" rel="noopener noreferrer" download={file.name}>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" /> View / Download
                          </Button>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4">No files have been uploaded for this project yet.</p>
                )}
                {/* Add Upload button for customer if needed */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* --- Project Overview Card (Moved below Tabs for potentially better flow) --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" /> Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {project?.description && (
              <div>
                <p className="font-medium text-muted-foreground mb-1">Description</p>
                <p className="whitespace-pre-wrap text-foreground/90">{project?.description}</p>
              </div>
            )}
            {/* Address/Dates (if available) */}
            {/* Example: { (project?.street || project?.city) && ( <div> ... address ... </div> )} */}
            {/* Example: { project?.due_date && ( <div> ... due date ... </div> )} */}
            <div>
              <p className="font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                <CircleDollarSign className="h-4 w-4" /> Total Estimated Cost
              </p>
              <p className="text-xl font-semibold text-foreground">{toUSD(project?.estimate)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
