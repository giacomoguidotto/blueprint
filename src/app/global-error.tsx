"use client";

import { ErrorDisplay } from "@/components/error-display";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <div className="bg-background text-foreground">
          <ErrorDisplay
            description="A critical error occurred. Please refresh the page or contact support if the problem persists."
            error={error}
            logPrefix="Global error"
            minHeight="100vh"
            reset={reset}
            title="Application Error"
          />
        </div>
      </body>
    </html>
  );
}
