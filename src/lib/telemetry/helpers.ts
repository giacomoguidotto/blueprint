import { Effect } from "effect";

/**
 * Report an error to the telemetry system.
 * Creates a span with error status for visibility in Axiom.
 */
export function reportError(
  error: unknown,
  context?: Record<string, string>
): Effect.Effect<void> {
  const cause = error instanceof Error ? error : new Error(String(error));

  return Effect.withSpan(
    Effect.logError("Client error reported", cause),
    "error.report",
    {
      attributes: {
        "error.type": cause.name,
        "error.message": cause.message,
        ...context,
      },
    }
  );
}
