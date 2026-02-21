"use client";

import { useMutation } from "convex/react";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";
import { useCallback } from "react";
import { reportClientSpan } from "@/app/actions/report-span";

/**
 * A wrapper around Convex's `useMutation` that reports client-side spans
 * to the telemetry system. Measures wall-clock round-trip duration and
 * reports success/failure via a fire-and-forget server action.
 *
 * @param mutation - Convex mutation function reference
 * @param spanName - OTel span name (e.g. "user.action.createTask")
 * @param spanAttributes - Static attributes to attach to every span
 */
export function useTracedMutation<
  Mutation extends FunctionReference<"mutation">,
>(
  mutation: Mutation,
  spanName: string,
  spanAttributes?: Record<string, string>
) {
  const mutate = useMutation(mutation);

  const tracedMutate = useCallback(
    async (
      args: FunctionArgs<Mutation>
    ): Promise<FunctionReturnType<Mutation>> => {
      const attributes = spanAttributes ?? {};
      const start = performance.now();
      try {
        const result = await mutate(args);
        const durationMs = performance.now() - start;
        reportClientSpan(spanName, attributes, durationMs).catch(() => {
          // fire-and-forget: telemetry failure is non-critical
        });
        return result;
      } catch (error) {
        const durationMs = performance.now() - start;
        const message = error instanceof Error ? error.message : String(error);
        reportClientSpan(spanName, attributes, durationMs, message).catch(
          () => {
            // fire-and-forget: telemetry failure is non-critical
          }
        );
        throw error;
      }
    },
    [mutate, spanName, spanAttributes]
  );

  return tracedMutate;
}
