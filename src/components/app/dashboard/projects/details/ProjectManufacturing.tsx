// components/ProjectManufacturing.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarClock, MessageCircleQuestion, Timer, Wrench } from 'lucide-react'; // Added Timer
import React from 'react';

// --- Prop Types (Defined Above) ---
interface ProjectManufacturingProps {
  projectId: number | string;
  customerName: string;
  estimatedManufacturingCompletionDate?: Date | string | null;
  nextStep?: string | null;
  onContactUs?: () => void;
}

// --- Helper Function ---
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPP');
  } catch (error) {
    // e.g., Oct 27, 2023
    return 'Invalid Date';
  }
};

// --- The Component ---
export const ProjectManufacturing: React.FC<ProjectManufacturingProps> = ({
  projectId,
  customerName,
  estimatedManufacturingCompletionDate,
  nextStep = 'the next phase', // Default next step text
  onContactUs = () => console.log('Contact Us clicked during manufacturing for project:', projectId), // Default handler
}) => {
  return (
    <Card className="border-sky-300 bg-sky-50 dark:bg-sky-950 dark:border-sky-800 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-sky-800 dark:text-sky-200 flex items-center gap-2">
          {/* Choose an icon representing manufacturing */}
          <Wrench className="h-5 w-5 text-sky-600" />
          {/* <Factory className="h-5 w-5 text-sky-600" /> */}
          {/* <HardHat className="h-5 w-5 text-sky-600" /> */}
          Manufacturing In Progress
        </CardTitle>
        <CardDescription className="text-sky-700 dark:text-sky-300">
          Your custom project components are currently being built by our skilled team based on the approved designs.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-3 bg-background/40 p-3 rounded-md border border-sky-100 dark:border-sky-900">
          <Timer className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-1">What to Expect</p>
            <p className="text-muted-foreground">
              This phase involves precision crafting of your materials. We'll notify you once manufacturing is complete and your project
              moves to {nextStep}.
            </p>
          </div>
        </div>

        {estimatedManufacturingCompletionDate && (
          <div className="pt-1">
            <p className="font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4" /> Estimated Manufacturing Completion:
            </p>
            <p className="font-semibold text-sky-700 dark:text-sky-300">{formatDate(estimatedManufacturingCompletionDate)}</p>
            <p className="text-xs text-muted-foreground italic">(Estimate subject to change based on production timelines.)</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-sky-200 dark:border-sky-800">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">Questions about production?</p>
          <Button variant="outline" size="sm" onClick={onContactUs}>
            <MessageCircleQuestion className="mr-2 h-4 w-4" /> Contact Us
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Default export might be needed depending on file structure
export default ProjectManufacturing;
