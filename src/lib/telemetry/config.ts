import { Context, Effect, Layer } from "effect";
import { env } from "@/lib/env";

export interface AxiomConfig {
  readonly apiToken: string;
  readonly dataset: string;
  readonly domain: string;
  readonly metricsDataset: string;
}

export class AxiomConfigTag extends Context.Tag("AxiomConfig")<
  AxiomConfigTag,
  AxiomConfig
>() {}

export const AxiomConfigLive = Layer.effect(
  AxiomConfigTag,
  Effect.sync(() => ({
    apiToken: env.server.AXIOM_API_TOKEN,
    domain: env.server.AXIOM_DOMAIN,
    dataset: env.server.AXIOM_DATASET,
    metricsDataset: env.server.AXIOM_METRICS_DATASET,
  }))
);
