"use server";

import { reportSpan } from "@/lib/telemetry/helpers";
import { telemetryRuntime } from "@/lib/telemetry/runtime";

const MAX_NAME_LENGTH = 128;
const MAX_ATTRIBUTE_LENGTH = 256;
const MAX_ATTRIBUTES = 16;

export async function reportClientSpan(
  name: string,
  attributes: Record<string, string>,
  durationMs: number,
  error?: string
): Promise<void> {
  const safeDuration =
    Number.isFinite(durationMs) && durationMs >= 0 ? durationMs : 0;
  const truncatedName = name.slice(0, MAX_NAME_LENGTH);
  const truncatedError = error?.slice(0, MAX_ATTRIBUTE_LENGTH);

  const safeAttributes: Record<string, string> = {};
  let count = 0;
  for (const [key, value] of Object.entries(attributes)) {
    if (count >= MAX_ATTRIBUTES) {
      break;
    }
    safeAttributes[key.slice(0, MAX_ATTRIBUTE_LENGTH)] = String(value).slice(
      0,
      MAX_ATTRIBUTE_LENGTH
    );
    count++;
  }

  await telemetryRuntime.runPromise(
    reportSpan(truncatedName, safeAttributes, safeDuration, truncatedError)
  );
}
