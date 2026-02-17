"use server";

import { reportError } from "@/lib/telemetry/helpers";
import { telemetryRuntime } from "@/lib/telemetry/runtime";

const MAX_MESSAGE_LENGTH = 1024;

export async function reportClientError(
  message: string,
  digest?: string
): Promise<void> {
  const truncatedMessage = message.slice(0, MAX_MESSAGE_LENGTH);
  const truncatedDigest = digest?.slice(0, 64);
  const error = new Error(truncatedMessage);

  await telemetryRuntime.runPromise(
    reportError(error, {
      "error.source": "client",
      ...(truncatedDigest ? { "error.digest": truncatedDigest } : {}),
    })
  );
}
