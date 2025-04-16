// components/ProjectDesignInProgress.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Info, MessageCircleQuestion, Palette } from 'lucide-react'; // Added design icons
import React from 'react';

// --- Prop Types (Defined Above) ---
interface ProjectDesignInProgressProps {
  projectId: number | string;
  customerName: string;
  estimatedDesignCompletionDate?: Date | string | null;
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
export const ProjectDesignInProgress: React.FC<ProjectDesignInProgressProps> = ({
  projectId,
  customerName,
  estimatedDesignCompletionDate,
  onContactUs = () => console.log('Contact Us clicked for project:', projectId), // Default handler
}) => {
  return (
    <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
          {/* Choose an icon that best represents design */}
          <Palette className="h-5 w-5 text-blue-600" />
          {/* <DraftingCompass className="h-5 w-5 text-blue-600" /> */}
          {/* <SquarePen className="h-5 w-5 text-blue-600" /> */}
          Design Phase In Progress
        </CardTitle>
        <CardDescription className="text-blue-700 dark:text-blue-300">
          Our team is currently working hard designing your project and creating detailed drawings and renderings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start gap-3 bg-background/40 p-3 rounded-md border border-blue-100 dark:border-blue-900">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-1">What Happens Next?</p>
            <p className="text-muted-foreground">
              Once the initial designs are complete, we will upload them for your review. You'll typically receive a notification when they
              are ready.
            </p>
          </div>
        </div>

        {estimatedDesignCompletionDate && (
          <div className="pt-2">
            <p className="font-medium text-muted-foreground">Estimated Design Completion:</p>
            <p className="font-semibold text-blue-700 dark:text-blue-300">{formatDate(estimatedDesignCompletionDate)}</p>
            <p className="text-xs text-muted-foreground italic">(This is an estimate and may be subject to change.)</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">Have questions during this stage?</p>
          <Button variant="outline" size="sm" onClick={onContactUs}>
            <MessageCircleQuestion className="mr-2 h-4 w-4" /> Contact Us
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Default export might be needed depending on file structure
export default ProjectDesignInProgress;
