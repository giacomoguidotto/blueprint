"use client";

import { ErrorDisplay } from "@/components/error-display";

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TasksError({ error, reset }: ErrorComponentProps) {
  return (
    <ErrorDisplay
      description="Something went wrong while loading your tasks. Please try again."
      error={error}
      reset={reset}
      title="Failed to load tasks"
    />
  );
}
