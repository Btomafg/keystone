// components/ProjectShipped.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Calendar, ExternalLink, Info, MessageCircleQuestion, Truck } from 'lucide-react'; // Added ExternalLink, Info
import React from 'react';

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

// --- The Component ---
export const ProjectShipped: React.FC<ProjectShippedProps> = ({
  projectId,
  customerName,
  shippedDate,
  shippingCarrier,
  trackingNumber,
  trackingUrl,
  estimatedDeliveryDate,
  nextStepInstructions = 'Please contact us upon delivery to coordinate the next steps, such as installation.', // Default instructions
  onContactUs = () => console.log('Contact Us clicked during shipped stage for project:', projectId), // Default handler
}) => {
  const canTrack = trackingNumber && trackingUrl;

  return (
    <Card className="border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800 transition-all duration-300 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
          {/* Choose an icon representing shipping */}
          <Truck className="h-6 w-6 text-green-600" />
          {/* <PackageCheck className="h-6 w-6 text-green-600" /> */}
          Your Project Has Shipped!
        </CardTitle>
        <CardDescription className="text-green-700 dark:text-green-300">Your custom components are on their way.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Shipping Details Section */}
        <div className="p-4 border bg-background rounded-md space-y-3">
          <h4 className="font-semibold mb-2 text-base">Shipment Details</h4>
          {shippedDate && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Shipped On:
              </span>
              <span className="font-medium">{formatDate(shippedDate)}</span>
            </div>
          )}
          {shippingCarrier && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Carrier:
              </span>
              <span className="font-medium">{shippingCarrier}</span>
            </div>
          )}
          {trackingNumber && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-muted-foreground flex items-center gap-1.5 mb-1 sm:mb-0">Tracking #:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium break-all">{trackingNumber}</span>
                {canTrack && (
                  <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="xs" className="h-6 px-2 py-1 text-xs">
                      Track <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
          {estimatedDeliveryDate && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Estimated Delivery:
              </span>
              <span className="font-medium">{formatDate(estimatedDeliveryDate)}</span>
            </div>
          )}
          {!trackingNumber && !estimatedDeliveryDate && (
            <p className="text-xs text-muted-foreground italic text-center py-2">Tracking details will be updated soon if available.</p>
          )}
        </div>

        {/* Next Steps Section */}
        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-md border border-blue-100 dark:border-blue-900">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Next Steps</p>
            <p className="text-muted-foreground text-xs leading-relaxed">{nextStepInstructions}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">Questions about delivery or installation?</p>
          <Button variant="outline" size="sm" onClick={onContactUs}>
            <MessageCircleQuestion className="mr-2 h-4 w-4" /> Contact Us
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Default export might be needed depending on file structure
// export default ProjectShipped;
