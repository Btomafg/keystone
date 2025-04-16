// components/ProjectAgreementSignature.tsx

'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, Eye, FileSignature, FileText, Loader2, XCircle } from 'lucide-react'; // Added icons
import React, { useState } from 'react';

type AgreementStatus = 'pending_signature' | 'signed' | 'declined' | 'error' | 'processing';

interface AgreementFile {
  name: string;
  url: string; // URL to view/download the agreement PDF
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

// --- Helper ---
const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPP p');
  } catch (error) {
    // e.g., Oct 27, 2023, 4:00 PM
    return 'Invalid Date';
  }
};

// --- The Component ---
export const ProjectAgreementSignature: React.FC<ProjectAgreementSignatureProps> = ({
  projectId,
  customerName,
  agreementStatus,
  agreementDocument = null,
  onStartSigning,
  signedDate = null,
  statusReason = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onStartSigning();
      // If onStartSigning redirects, this component might unmount
      // If it generates a URL and stays mounted, you might handle that differently
    } catch (err) {
      console.error('Failed to start signing process:', err);
      setError('Could not start the signing process. Please try again or contact support.');
      setIsLoading(false); // Only set loading false if redirect didn't happen
    }
    // setIsLoading(false); // Might not be reached if redirecting
  };

  // --- Render based on agreementStatus ---

  // STATE 1: Pending Signature
  if (agreementStatus === 'pending_signature') {
    return (
      <Card className="border-yellow-400 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 transition-all duration-300 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-yellow-700 dark:text-yellow-300" /> Action Required: Sign Your Agreement
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            Please review and sign the project agreement to proceed to the next stage.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="text-xs">
              {error}
            </Alert>
          )}

          {agreementDocument?.url && (
            <div className="flex items-center justify-between p-3 border rounded-md bg-background">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{agreementDocument.name || 'Project Agreement'}</span>
              </div>
              <a href={agreementDocument.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
              </a>
            </div>
          )}
          <p className="text-xs text-muted-foreground italic text-center">
            You will be redirected to our secure e-signature partner to complete the signing process.
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t border-yellow-300 dark:border-yellow-800">
          <Button
            size="lg"
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-yellow-foreground"
            onClick={handleSignClick}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Review & Sign Agreement
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // STATE 2: Processing (Optional intermediate state)
  if (agreementStatus === 'processing') {
    return (
      <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[150px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Processing Signature...</p>
          <p className="text-xs text-muted-foreground">Please wait a moment while we confirm your signature.</p>
        </CardContent>
      </Card>
    );
  }

  // STATE 3: Signed Confirmation
  if (agreementStatus === 'signed') {
    return (
      <Card className="border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" /> Agreement Signed!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Thank you! We have received your signed agreement. Your project will now proceed.
          </CardDescription>
        </CardHeader>
        {signedDate && (
          <CardContent className="pt-4 border-t border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-muted-foreground">Signed On:</p>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">{formatDate(signedDate)}</p>
          </CardContent>
        )}
        {agreementDocument?.url && (
          <CardFooter className="pt-4 border-t border-green-200 dark:border-green-800">
            <a href={agreementDocument.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" /> View Signed Agreement
              </Button>
            </a>
          </CardFooter>
        )}
      </Card>
    );
  }

  // STATE 4: Declined or Error
  if (agreementStatus === 'declined' || agreementStatus === 'error') {
    const isError = agreementStatus === 'error';
    return (
      <Card
        className={cn(
          'border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800',
          isError ? '' : 'border-orange-300 bg-orange-50 dark:bg-orange-950 dark:border-orange-800', // Different style for declined?
        )}
      >
        <CardHeader>
          <CardTitle
            className={cn(
              'text-lg flex items-center gap-2',
              isError ? 'text-red-800 dark:text-red-200' : 'text-orange-800 dark:text-orange-200',
            )}
          >
            {isError ? <XCircle className="h-5 w-5 text-red-600" /> : <AlertCircle className="h-5 w-5 text-orange-600" />}
            {isError ? 'Signing Error' : 'Agreement Declined'}
          </CardTitle>
          <CardDescription className={cn(isError ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300')}>
            {statusReason ||
              (isError ? 'An error occurred during the signing process.' : 'The agreement signing process was declined or cancelled.')}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-4 border-t border-red-200 dark:border-red-800">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            {' '}
            {/* Simple refresh or contact */}
            {isError ? 'Try Again' : 'Contact Support'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Fallback if status is unknown
  return null;
};

// Default export might be needed depending on file structure
// export default ProjectAgreementSignature;
