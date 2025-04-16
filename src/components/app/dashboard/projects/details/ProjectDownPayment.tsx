// components/ProjectDownPayment.tsx

'use client';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { toUSD } from '@/utils/common';
import { AlertCircle, BadgeCheck, CreditCard, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

// Define possible payment statuses
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

// --- The Component ---
export const ProjectDownPayment: React.FC<ProjectDownPaymentProps> = ({
  projectId,
  customerName,
  totalEstimate,
  downPaymentPercentage,
  paymentStatus,
  paymentDate = null,
  paymentError = null,
  onCreateCheckoutSession,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downPaymentAmount = (totalEstimate * downPaymentPercentage) / 100;

  const handlePayClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call backend to create Checkout Session
      const checkoutResult = await onCreateCheckoutSession();

      if (checkoutResult?.error || !checkoutResult?.sessionId) {
        throw new Error(checkoutResult?.error || 'Failed to create payment session.');
      }

      const sessionId = checkoutResult.sessionId;

      // 2. Get Stripe instance
      const stripe = '';
      if (!stripe) {
        throw new Error('Stripe.js failed to load.');
      }

      // 3. Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        // This error is typically only shown if there's an issue reaching Stripe (rare)
        console.error('Stripe redirect error:', stripeError);
        throw new Error(stripeError.message || 'Failed to redirect to payment page.');
      }
      // If redirection succeeds, the user leaves this page.
      // If they cancel, they return, but we might not need specific handling here
      // as the status prop should reflect the latest from the backend/webhook.
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false); // Stop loading only if redirect didn't happen
    }
    // setIsLoading(false); // Usually not reached if redirect is successful
  };

  // --- Render based on paymentStatus ---

  // STATE 1: Payment Required
  if (paymentStatus === 'required') {
    return (
      <Card className="border-orange-400 bg-orange-50 dark:bg-orange-950 dark:border-orange-800 transition-all duration-300 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-orange-800 dark:text-orange-200 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-orange-700 dark:text-orange-300" /> Action Required: Initial Payment
          </CardTitle>
          <CardDescription className="text-orange-700 dark:text-orange-300">
            Please submit the initial down payment to proceed with your project.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="text-xs">
              {error}
            </Alert>
          )}
          <div className="p-4 border bg-background rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Project Estimate:</span>
              <span className="font-medium">{toUSD(totalEstimate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Down Payment ({downPaymentPercentage}%):</span>
              <span className="font-semibold text-lg text-foreground">{toUSD(downPaymentAmount)}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic text-center">
            You will be securely redirected to Stripe to complete your payment.
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t border-orange-300 dark:border-orange-800">
          <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white" onClick={handlePayClick} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // STATE 2: Processing (Optional state while waiting for webhook confirmation)
  if (paymentStatus === 'processing') {
    return (
      <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[150px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Processing Payment...</p>
          <p className="text-xs text-muted-foreground">
            Waiting for payment confirmation. This page will update automatically, or you can refresh shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  // STATE 3: Payment Complete
  if (paymentStatus === 'paid') {
    return (
      <Card className="border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
            <BadgeCheck className="h-6 w-6 text-green-600" /> Down Payment Received!
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            Thank you! Your down payment has been successfully processed. Your project will proceed to the next stage.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 border-t border-green-200 dark:border-green-800 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="font-semibold">{toUSD(downPaymentAmount)}</span>
          </div>
          {paymentDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Date:</span>
              <span className="font-medium">{formatDate(paymentDate)}</span>
            </div>
          )}
          {/* Optionally link to invoice/receipt */}
        </CardContent>
      </Card>
    );
  }

  // STATE 4: Payment Error
  if (paymentStatus === 'error') {
    return (
      <Card className="border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-lg text-red-800 dark:text-red-200 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" /> Payment Issue
          </CardTitle>
          <CardDescription className="text-red-700 dark:text-red-300">
            {paymentError || 'There was an issue processing your payment.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="pt-4 border-t border-red-200 dark:border-red-800">
          {/* Provide relevant actions like retry or contact */}
          <Button variant="outline" size="sm" onClick={handlePayClick} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Try Again
          </Button>
          {/* <Button variant="link" size="sm">Contact Support</Button> */}
        </CardFooter>
      </Card>
    );
  }

  // Fallback if status is unknown
  return null;
};

// Default export might be needed depending on file structure
// export default ProjectDownPayment;
