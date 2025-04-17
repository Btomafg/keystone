// components/ProjectDisqualificationNotice.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toUSD } from '@/utils/common';
import { Info, MessageCircleQuestion } from 'lucide-react'; // Added MessageCircleQuestion
import React from 'react';

// --- Prop Types (Defined Above) ---
interface ProjectDisqualificationNoticeProps {
  projectId: number | string;
  customerName: string;
  projectEstimate: number;
  minimumThreshold: number;
  contactInfo?: string;
  onContactUs?: () => void;
}

// --- The Component ---
export const ProjectDisqualificationNotice: React.FC<ProjectDisqualificationNoticeProps> = ({
  projectId,
  customerName,
  projectEstimate,
  minimumThreshold,
  contactInfo,
  onContactUs = () => console.log('Contact Us clicked for disqualified project:', projectId), // Default handler
}) => {
  return (
    // Using a neutral or slightly muted warning style
    <Card className="border-slate-300 bg-red-50 dark:bg-slate-900 dark:border-slate-700 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Info className="h-5 w-5 text-slate-600" />
          {/* <AlertTriangle className="h-5 w-5 text-orange-600" /> */}
          {/* <HandMetal className="h-5 w-5 text-destructive" /> */}
          Important Information Regarding Your Project Estimate
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Thank you for your interest in working with us, {customerName}.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="p-4 border bg-background rounded-md space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Your Project Estimate:</span>
            <span className="font-semibold">{toUSD(projectEstimate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Our Current Minimum:</span>
            <span className="font-medium">{toUSD(minimumThreshold)}</span>
          </div>
        </div>

        <p className="text-foreground/90">
          We carefully evaluate each potential project to ensure we can dedicate the necessary resources for the high-quality results we're
          known for.
        </p>
        <p className="text-foreground/90">
          At this time, due to current demand and our focus on larger-scale projects, we are only able to take on projects with an estimated
          value of {toUSD(minimumThreshold)} or greater. Unfortunately, your project's current estimate falls below this threshold.
        </p>
        <p className="text-muted-foreground text-xs italic">
          We appreciate you considering us and hope you'll keep us in mind for any larger projects in the future.
        </p>
        {/* Optional: Add alternative suggestions here if applicable */}
        {/*
                 <p className="text-foreground/90 pt-2">
                     For projects of this scope, you might find success with [Resource/Contractor Type Recommendation].
                 </p>
                 */}
      </CardContent>

      {(contactInfo || onContactUs) && (
        <CardFooter className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 text-xs text-muted-foreground">
            <p>
              If you have any questions about this or believe the estimate might change significantly based on further discussion, please
              don't hesitate to reach out.
              {contactInfo && <span className="block mt-1">Contact: {contactInfo}</span>}
            </p>
            {onContactUs && ( // Only show button if handler is provided
              <Button variant="outline" size="sm" onClick={onContactUs} className="w-full sm:w-auto flex-shrink-0">
                <MessageCircleQuestion className="mr-2 h-4 w-4" /> Contact Us
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

// Default export might be needed depending on file structure
export default ProjectDisqualificationNotice;
