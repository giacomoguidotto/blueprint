"use server";

import { Effect } from "effect";
import { reportError } from "@/lib/telemetry/helpers";

const MAX_MESSAGE_LENGTH = 1024;

export async function reportClientError(
  message: string,
  digest?: string
): Promise<void> {
  const truncatedMessage = message.slice(0, MAX_MESSAGE_LENGTH);
  const truncatedDigest = digest?.slice(0, 64);
  const error = new Error(truncatedMessage);

  await Effect.runPromise(
    reportError(error, {
      "error.source": "client",
      ...(truncatedDigest ? { "error.digest": truncatedDigest } : {}),
    })
  );
}
