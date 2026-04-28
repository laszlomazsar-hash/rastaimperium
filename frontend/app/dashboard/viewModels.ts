import { Blueprint } from "../../hooks/useBlueprint";
import { RealtimeMetricsSnapshot } from "../../hooks/useRealtimeMetrics";

export type ChartPoint = { label: string; value: number };

export function mapLayerCoherenceSeries(blueprint: Blueprint): ChartPoint[] {
  return blueprint.platform.layerCoherenceScores.map((layer) => ({
    label: `L${layer.layer}`,
    value: layer.score,
  }));
}

export function mapMutationTimeline(blueprint: Blueprint) {
  return blueprint.platform.mutationLog.map((event) => ({
    id: event.id,
    title: `${event.event} (${event.actor})`,
    subtitle: `${event.timestamp} · ${event.status}`,
    status: mapSeverity(event.status),
  }));
}

export function mapCoherenceTrend(metrics: RealtimeMetricsSnapshot): ChartPoint[] {
  return metrics.coherenceHistory.map((value, index) => ({ label: `T${index + 1}`, value }));
}

export function mapSeverity(value: string): "ok" | "warn" | "error" {
  const status = value.toLowerCase();
  if (status.includes("fail") || status.includes("critical") || status.includes("blocked")) return "error";
  if (status.includes("warn") || status.includes("deviation") || status.includes("pending")) return "warn";
  return "ok";
}
