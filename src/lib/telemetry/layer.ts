import { NodeSdk } from "@effect/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { Effect, Layer } from "effect";
import { AxiomConfigLive, AxiomConfigTag } from "./config";
import { createMetricReader, createTraceExporter } from "./exporters";

const OtelSdkLayer = Layer.unwrapEffect(
  Effect.gen(function* () {
    const config = yield* AxiomConfigTag;

    if (!config.apiToken) {
      return Layer.empty;
    }

    return NodeSdk.layer(() => ({
      resource: {
        serviceName: "blueprint",
      },
      spanProcessor: new BatchSpanProcessor(createTraceExporter(config)),
      metricReader: createMetricReader(config),
    }));
  })
);

export const TelemetryLive = OtelSdkLayer.pipe(Layer.provide(AxiomConfigLive));
