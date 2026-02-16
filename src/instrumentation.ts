import { Effect } from "effect";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { TelemetryLive } = await import("@/lib/telemetry/layer");
    await Effect.runPromise(Effect.provide(Effect.void, TelemetryLive));
  }
}
