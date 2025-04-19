// app/admin/projects/[projectId]/_components/AdminProjectHeader.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Using Card for structure
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Project } from '@/constants/models/object.types';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import React from 'react';

// --- Component Props ---
interface AdminProjectHeaderProps {
  /** The project data object */
  project: Pick<Project, 'id' | 'name'>; // Only need id and name here
  /** Array of step name strings in order */
  steps: string[];
  /** Zero-based index of the current active step */
  currentStepIndex: number;
  /** Loading state for status updates */
  isUpdatingStatus: boolean;
  /** Callback when Step Back/Next is clicked */
  onStepChange: (direction: 'next' | 'back') => void;
  /** Whether the Step Back action is allowed */
  canStepBack: boolean;
  /** Whether the Step Next action is allowed */
  canStepNext: boolean;
}

export function AdminProjectHeader({
  project,
  steps = [], // Default to empty array
  currentStepIndex = -1, // Default to -1 if no status found
  isUpdatingStatus = false,
  onStepChange,
  canStepBack = false,
  canStepNext = false,
}: AdminProjectHeaderProps) {
  const handleNext = () => onStepChange('next');
  const handleBack = () => onStepChange('back');

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-tight">{project?.name}</h1>
            <p className="text-xs text-muted-foreground">Project ID: {project?.id}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handleBack} disabled={!canStepBack || isUpdatingStatus || currentStepIndex === 0}>
              {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Step Back</span>
            </Button>
            <Button
              variant="default" // Or outline
              size="sm"
              onClick={handleNext}
              disabled={!canStepNext || isUpdatingStatus || currentStepIndex >= steps.length - 1}
            >
              <span className="mr-2 hidden sm:inline">Step Next</span>
              {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium mb-3">Project Progress</p>
        <TooltipProvider delayDuration={100}>
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 -mx-2 px-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <React.Fragment key={step}>
                  {/* Step Indicator */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center text-center flex-shrink-0 w-[65px] sm:w-auto sm:flex-1 px-1 cursor-default">
                        <div
                          className={cn(
                            'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 mb-1.5 transition-all duration-300',
                            isCompleted ? 'bg-green-600 border-green-600 text-white' : '',
                            isActive ? 'bg-primary border-primary text-white scale-110 ring-4 ring-primary/20' : '',
                            isUpcoming ? 'bg-card border-border text-muted-foreground' : '',
                          )}
                        >
                          {isCompleted ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : index + 1}
                        </div>
                        <p
                          className={cn(
                            'text-[10px] sm:text-xs leading-tight',
                            isActive ? 'font-semibold text-primary' : 'text-muted-foreground',
                          )}
                        >
                          {step}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{isCompleted ? 'Completed' : isActive ? 'Current Step' : 'Upcoming'}</TooltipContent>
                  </Tooltip>

                  {/* Line Separator */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-grow h-0.5 mt-[-18px] sm:mt-[-20px]', // Adjust vertical position based on circle size
                        isCompleted || isActive ? 'bg-primary' : 'bg-border',
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
