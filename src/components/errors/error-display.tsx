"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { reportClientError } from "@/app/actions/report-error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  /** Additional CSS classes for the container */
  className?: string;
  /** Description to display. Defaults to a generic error message */
  description?: string;
  error: Error & { digest?: string };
  /** Minimum height for the error container. Defaults to "400px" for regular errors */
  minHeight?: string;
  reset: () => void;
  /** Button text. Defaults to "Try again" */
  resetLabel?: string;
  /** Whether to show the error digest/ID */
  showDigest?: boolean;
  /** Title to display. Defaults to "Something went wrong" */
  title?: string;
}

/**
 * Reusable error display component for error boundaries.
 *
 * Design rationale:
 * - Leverages shadcn/ui Alert component for consistent error presentation
 * - Flexible props allow customization for different error boundary contexts
 * - Automatic error reporting to Axiom via server action
 * - Accessible with proper ARIA roles and semantic structure
 * - Displays error digest when available for debugging/support
 *
 * @example
 * // Basic usage in route error boundary
 * <ErrorDisplay error={error} reset={reset} />
 *
 * @example
 * // Customized for global error boundary
 * <ErrorDisplay
 *   error={error}
 *   reset={reset}
 *   title="Application Error"
 *   description="A critical error occurred..."
 *   minHeight="100vh"
 * />
 */
export function ErrorDisplay({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this page. Please try again.",
  resetLabel = "Try again",
  className,
  minHeight = "400px",
  showDigest = true,
}: ErrorDisplayProps) {
  useEffect(() => {
    reportClientError(error.message, error.digest).catch(() => {
      // Silently ignore reporting failures to avoid cascading errors
    });
  }, [error.message, error.digest]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 p-8",
        className
      )}
      style={{ minHeight }}
    >
      <Alert className="max-w-2xl" variant="destructive">
        <AlertTriangle />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{description}</p>
          {showDigest && error.digest && (
            <p className="mt-2 font-mono text-xs opacity-70">
              Error ID: {error.digest}
            </p>
          )}
        </AlertDescription>
      </Alert>

      <Button onClick={reset} size="lg" variant="default">
        <RefreshCcw />
        {resetLabel}
      </Button>
    </div>
  );
}
