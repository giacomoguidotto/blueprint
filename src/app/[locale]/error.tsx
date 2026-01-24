"use client";

import { ErrorDisplay } from "@/components/error-display";

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return <ErrorDisplay error={error} logPrefix="Route error" reset={reset} />;
}
