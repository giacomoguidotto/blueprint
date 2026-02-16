import { Context, Effect, Layer } from "effect";

export interface AxiomConfig {
  readonly apiToken: string;
  readonly dataset: string;
  readonly metricsDataset: string;
}

export class AxiomConfigTag extends Context.Tag("AxiomConfig")<
  AxiomConfigTag,
  AxiomConfig
>() {}

export const AxiomConfigLive = Layer.effect(
  AxiomConfigTag,
  Effect.sync(() => {
    const apiToken = process.env.AXIOM_API_TOKEN ?? "";
    const dataset = process.env.AXIOM_DATASET ?? "blueprint";
    const metricsDataset =
      process.env.AXIOM_METRICS_DATASET ?? "blueprint-metrics";

    return {
      apiToken,
      dataset,
      metricsDataset,
    };
  })
);
