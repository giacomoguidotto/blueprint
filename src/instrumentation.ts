export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { telemetryRuntime } = await import("@/lib/telemetry/runtime");

    await telemetryRuntime.runtime();
  }
}
