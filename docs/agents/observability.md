
# Observability

## Stack

- **Effect** — functional runtime for structured error handling and tracing
- **OpenTelemetry** — traces, metrics, and logs export
- **Axiom** — log collection (optional, configured via env vars)

## Architecture

```
src/lib/telemetry/
├── config.ts      # Axiom config from env vars (Effect Context/Layer)
├── runtime.ts     # Long-lived ManagedRuntime with OTel layer
├── exporters.ts   # OTLP exporters setup
└── layer.ts       # Composed TelemetryLive layer
```

## Usage

Run Effect programs through the telemetry runtime instead of `Effect.runPromise`:

```ts
import { telemetryRuntime } from "@/lib/telemetry/runtime";

await telemetryRuntime.runPromise(program);
```

Add spans with `Effect.withSpan`:

```ts
Effect.withSpan("operation.name", {
  attributes: { "key": "value" },
})
```

## Server actions

- `src/app/actions/report-error` — client error reporting
- `src/app/actions/report-span` — client span reporting

## Instrumentation

OpenTelemetry SDK initialized in `src/instrumentation.ts` (Next.js instrumentation hook).

## Env vars

- `AXIOM_API_TOKEN` — Axiom API token
- `AXIOM_DOMAIN` — Axiom domain
- `AXIOM_DATASET` — dataset name (default: `blueprint`)
- `AXIOM_METRICS_DATASET` — metrics dataset (default: `blueprint-metrics`)

All optional — telemetry degrades gracefully without them.
