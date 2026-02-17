import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import type { AxiomConfig } from "./config";

export function createTraceExporter(config: AxiomConfig): OTLPTraceExporter {
  return new OTLPTraceExporter({
    url: `https://${config.domain}/v1/traces`,
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "X-Axiom-Dataset": config.dataset,
    },
  });
}

export function createMetricReader(
  config: AxiomConfig
): PeriodicExportingMetricReader {
  return new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `https://${config.domain}/v1/metrics`,
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
        "X-Axiom-Dataset": config.metricsDataset,
      },
    }),
    exportIntervalMillis: 60_000,
  });
}
