"use server";

import { Effect } from "effect";
import { reportError } from "@/lib/telemetry/helpers";

export async function reportClientError(
  message: string,
  digest?: string
): Promise<void> {
  const error = new Error(message);
  await Effect.runPromise(
    reportError(error, {
      "error.source": "client",
      ...(digest ? { "error.digest": digest } : {}),
    })
  );
}
