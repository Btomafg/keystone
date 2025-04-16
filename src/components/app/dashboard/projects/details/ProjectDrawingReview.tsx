// components/ProjectDrawingReview.tsx
'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Check, Edit, FileCheck, FileCheck2, Loader2, MessageSquareWarning } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

type DrawingReviewStatus = 'pending' | 'revisions_requested' | 'approved';

interface DrawingFile {
  id: string | number;
  name: string;
  url: string;
  uploadedAt?: string | null;
}

interface ProjectDrawingReviewProps {
  projectId: number | string;
  /** Current status of the drawing review */
  reviewStatus: DrawingReviewStatus;
  /** Array of drawing files to be reviewed (only needed for 'pending' status) */
  drawings?: DrawingFile[];
  /** Callback when drawings are approved (only needed for 'pending' status) */
  onApprove?: () => Promise<void> | void;
  /** Callback when revisions are requested (only needed for 'pending' status) */
  onRequestRevisions?: (comments: string) => Promise<void> | void;
  /** Optional: Previously submitted revision comments (to display in 'revisions_requested' state) */
  revisionCommentsSubmitted?: string | null;
  /** Optional: Date when the drawings were approved */
  approvalDate?: Date | string | null;
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
export const ProjectDrawingReview: React.FC<ProjectDrawingReviewProps> = ({
  projectId,
  reviewStatus,
  drawings = [], // Default to empty array if not provided
  onApprove = async () => {
    console.warn('onApprove not provided');
  }, // Default no-op handlers
  onRequestRevisions = async () => {
    console.warn('onRequestRevisions not provided');
  },
  revisionCommentsSubmitted = null,
  approvalDate = null,
}) => {
  const [revisionComments, setRevisionComments] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryDrawing = drawings.length > 0 ? drawings[0] : null;
  const otherDrawings = drawings.slice(1);

  // --- Action Handlers (only relevant for 'pending' state) ---
  const handleApproveClick = async () => {
    // Guard against calling if not in pending state (though parent shouldn't render it then)
    if (reviewStatus !== 'pending') return;
    setIsSubmittingApproval(true);
    setError(null);
    try {
      await onApprove();
      // Parent component's re-render with new reviewStatus will change the UI
    } catch (err) {
      console.error('Approval failed:', err);
      setError('Failed to submit approval. Please try again.');
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  const handleRequestRevisionClick = async () => {
    if (reviewStatus !== 'pending') return;
    if (!revisionComments.trim()) {
      setError('Please provide comments for the requested revisions.');
      return;
    }
    setIsSubmittingRevision(true);
    setError(null);
    try {
      await onRequestRevisions(revisionComments);
      // Parent component's re-render with new reviewStatus will change the UI
      // Optionally clear local state anyway
      setRevisionComments('');
      setShowRevisionInput(false);
    } catch (err) {
      console.error('Revision request failed:', err);
      setError('Failed to submit revision request. Please try again.');
    } finally {
      setIsSubmittingRevision(false);
    }
  };
  if (reviewStatus === 'pending') {
    return (
      <Card className="border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> Drawings Ready for Review
          </CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-300">
            Please review the project drawings below. You can approve them or request revisions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {primaryDrawing ? (
            <div>
              <p className="text-sm font-medium mb-2">{primaryDrawing.name}</p>
              <div className="border rounded-md overflow-hidden aspect-video bg-muted max-h-[60vh]">
                <iframe src={primaryDrawing.url} width="100%" height="100%" title={`Drawing: ${primaryDrawing.name}`} className="border-0">
                  <Link href={primaryDrawing.url} target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </Link>
                </iframe>
              </div>
              {/*               {otherDrawings.length > 0 && 'ss'}
               */}{' '}
            </div>
          ) : (
            <Alert variant="destructive">{/* ... No Drawing Available message ... */}</Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4 pt-4 border-t border-amber-300 dark:border-amber-800">
          {error && (
            <Alert variant="destructive" className="text-xs">
              {error}
            </Alert>
          )}
          {showRevisionInput && (
            <div className="space-y-2">
              <Textarea /* ... revision input ... */
                placeholder="Please describe the required revisions..."
                value={revisionComments}
                onChange={(e) => setRevisionComments(e.target.value)}
                rows={3}
                disabled={isSubmittingRevision}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowRevisionInput(false)} disabled={isSubmittingRevision}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleRequestRevisionClick} disabled={isSubmittingRevision || !revisionComments.trim()}>
                  {isSubmittingRevision && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Submit Revisions
                </Button>
              </div>
            </div>
          )}
          {!showRevisionInput && (
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRevisionInput(true)} disabled={isSubmittingApproval || isSubmittingRevision}>
                <Edit className="mr-2 h-4 w-4" /> Request Revisions
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleApproveClick}
                disabled={isSubmittingApproval || isSubmittingRevision}
              >
                {isSubmittingApproval && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} <Check className="mr-2 h-4 w-4" /> Approve
                Drawings
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  }

  // STATE 2: Revisions Requested
  if (reviewStatus === 'revisions_requested') {
    return (
      <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5 text-blue-600" /> Revisions Requested
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            We have received your revision request. Our team will review your comments and provide updated drawings soon.
          </CardDescription>
        </CardHeader>
        {revisionCommentsSubmitted && (
          <CardContent className="pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-muted-foreground mb-1">Your Comments:</p>
            <p className="text-sm whitespace-pre-wrap bg-background/50 p-3 rounded-md border">{revisionCommentsSubmitted}</p>
          </CardContent>
        )}
        {/* Optionally add contact button if needed */}
        {/* <CardFooter className="pt-4 border-t"> <Button variant="outline" size="sm">Contact Support</Button> </CardFooter> */}
      </Card>
    );
  }

  // STATE 3: Approved
  if (reviewStatus === 'approved') {
    return (
      <Card className="border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-green-600" /> Drawings Approved!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Thank you for approving the drawings. Your project will now proceed to the next stage.
          </CardDescription>
        </CardHeader>
        {approvalDate && (
          <CardContent className="pt-4 border-t border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-muted-foreground">Approved On:</p>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">{formatDate(approvalDate)}</p>
          </CardContent>
        )}
        {/* No further actions typically needed here */}
      </Card>
    );
  }

  // Fallback if status is unknown (shouldn't happen ideally)
  return null;
};

// Default export might be needed depending on file structure
export default ProjectDrawingReview;
