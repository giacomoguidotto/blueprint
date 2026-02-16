import { Effect } from "effect";
import type { TelemetryLive } from "./layer";

/**
 * Run an Effect program with the full telemetry layer.
 * Useful for one-off scripts or the instrumentation hook.
 */
export function runWithTelemetry(
  program: Effect.Effect<void, never, never>,
  layer: typeof TelemetryLive
): Promise<void> {
  return Effect.runPromise(Effect.provide(program, layer));
}

/**
 * Wrap an Effect with a named span for tracing.
 */
export function traced<A, E, R>(
  name: string,
  effect: Effect.Effect<A, E, R>,
  attributes?: Record<string, string>
): Effect.Effect<A, E, R> {
  return Effect.withSpan(effect, name, { attributes });
}

/**
 * Report an error to the telemetry system.
 * Creates a span with error status for visibility in Axiom.
 */
export function reportError(
  error: unknown,
  context?: Record<string, string>
): Effect.Effect<void> {
  return Effect.withSpan(
    Effect.logError("Client error reported", error as Error),
    "error.report",
    {
      attributes: {
        "error.type": error instanceof Error ? error.name : "UnknownError",
        "error.message": error instanceof Error ? error.message : String(error),
        ...context,
      },
    }
  );
}
