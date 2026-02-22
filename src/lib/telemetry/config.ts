import { Context, Effect, Layer } from "effect";

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
  Effect.sync(() => {
    const apiToken = process.env.AXIOM_API_TOKEN ?? "";
    const domain = process.env.AXIOM_DOMAIN ?? "";
    const dataset = process.env.AXIOM_DATASET ?? "blueprint";
    const metricsDataset =
      process.env.AXIOM_METRICS_DATASET ?? "blueprint-metrics";

    return {
      apiToken,
      domain,
      dataset,
      metricsDataset,
    };
  })
);
