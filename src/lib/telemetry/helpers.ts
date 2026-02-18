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

/**
 * Report a completed client-side span to the telemetry system.
 * Used to trace user actions (e.g. mutations) that originate in the browser.
 */
export function reportSpan(
  name: string,
  attributes: Record<string, string>,
  durationMs: number,
  error?: string
): Effect.Effect<void> {
  const program = error
    ? Effect.logError("User action failed", new Error(error))
    : Effect.logInfo("User action completed");

  return Effect.withSpan(program, name, {
    attributes: {
      ...attributes,
      "span.duration_ms": String(durationMs),
      ...(error ? { "error.message": error } : {}),
    },
  });
}
