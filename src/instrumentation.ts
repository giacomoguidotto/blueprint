export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { telemetryRuntime } = await import("@/lib/telemetry/runtime");
    // Eagerly initialize the runtime so the OTel SDK starts.
    // The runtime persists for the process lifetime.
    await telemetryRuntime.runtime();
  }
}
