import { ManagedRuntime } from "effect";
import { TelemetryLive } from "./layer";

/**
 * Long-lived Effect runtime with the OTel SDK layer.
 *
 * Unlike `Effect.runPromise`, running effects through this runtime:
 * 1. Keeps the OTel SDK alive for the process lifetime
 * 2. Bridges `Effect.withSpan` to the OTel TracerProvider (exports to Axiom)
 *
 * Use `telemetryRuntime.runPromise(program)` instead of `Effect.runPromise(program)`.
 */
export const telemetryRuntime = ManagedRuntime.make(TelemetryLive);
