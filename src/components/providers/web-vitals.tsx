"use client";

import { useReportWebVitals } from "next/web-vitals";
import { reportClientSpan } from "@/app/actions/report-span";

/**
 * Web Vitals Reporter
 *
 * Reports Core Web Vitals (LCP, FID, CLS, TTFB, INP) to the
 * existing OpenTelemetry telemetry pipeline via reportClientSpan.
 *
 * Render this component once in the root layout.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    reportClientSpan(
      `web-vital.${metric.name}`,
      {
        "web_vital.id": metric.id,
        "web_vital.name": metric.name,
        "web_vital.rating": metric.rating,
        "web_vital.value": String(Math.round(metric.value)),
        "web_vital.navigation_type": metric.navigationType,
      },
      metric.value
    ).catch(() => {
      // fire-and-forget: telemetry failure is non-critical
    });
  });

  return null;
}
