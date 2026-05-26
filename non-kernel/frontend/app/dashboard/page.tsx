"use client";

import { useMemo } from "react";

import { AlertWidget } from "../components/AlertWidget";
import { SemanticIcon } from "../components/SemanticIcons";
import { CodexCompliance } from "../components/CodexCompliance";
import {
  CardGrid,
  DashboardShell,
  LineChart,
  PanelCard,
  StatCard,
  StatusChip,
  Timeline,
  TrendRow,
} from "../components/DashboardLayout";
import { useBlueprint } from "../../hooks/useBlueprint";
import { useRealtimeMetrics } from "../../hooks/useRealtimeMetrics";
import { mapCoherenceTrend, mapLayerCoherenceSeries, mapMutationTimeline, mapSeverity } from "./viewModels";

const DASHBOARD_LAYER_COUNT = 9;
const LAYER_JITTER_PATTERN = [-0.3, 0.3] as const;

type CoverageNode = {
  layer: string;
  coverage: number;
};

function buildCoverageFromRealtime(coherence: number): CoverageNode[] {
  const boundedCoherence = Math.min(100, Math.max(0, coherence));

  return Array.from({ length: DASHBOARD_LAYER_COUNT }, (_, index) => {
    const layer = index + 1;
    const jitter = LAYER_JITTER_PATTERN[layer % 2];

    return {
      layer: `L${layer}`,
      coverage: Number(Math.min(100, Math.max(0, boundedCoherence + jitter)).toFixed(2)),
    };
  });
}

export default function Dashboard() {
  const { blueprint, loading } = useBlueprint();
  const realtime = useRealtimeMetrics();
  const alerts = realtime.alerts ?? [];
  const alertSummary = alerts.length ? alerts.join(", ") : "No active deviations";
  const coverage = useMemo(() => buildCoverageFromRealtime(realtime.coherence), [realtime.coherence]);

  if (loading) return <p>Loading Dashboard...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  const coherenceTrend = mapCoherenceTrend(realtime);
  const coherenceBars = mapLayerCoherenceSeries(blueprint);
  const mutationTimeline = mapMutationTimeline(blueprint);

  return (
    <DashboardShell>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon name="dashboard" size="heading" decorative />SoulEcho Dashboard</h1>
      <p>Modern governance command center with cards, trend rows, and chart-driven insights.</p>

      <CardGrid>
        <StatCard label="Active Users" value={String(realtime.activeUsers)} detail={`Updated ${new Date(realtime.updatedAt).toLocaleTimeString()}`} />
        <StatCard label="WebSocket Latency" value={`${realtime.websocketLatencyMs}ms`} detail={`Transport: ${blueprint.platform.realtimeMetrics.transport}`} />
        <StatCard label="Global Coherence" value={`${realtime.coherence}%`} detail={alertSummary} />
        <StatCard
          label="Demo Access"
          value={blueprint.platform.realtimeMetrics.publicDemoAccess ? "Enabled" : "Disabled"}
          detail="Public demonstration endpoint"
        />
      </CardGrid>

      <CardGrid>
        <PanelCard title="Realtime Trends" subtitle="Rolling coherence trend and operating health.">
          <LineChart data={coherenceTrend} />
          <TrendRow label="Alert stream" value={alerts.length ? `${alerts.length} events` : "clear"} direction={alerts.length ? "down" : "up"} />
          <TrendRow label="Feed freshness" value={new Date(realtime.updatedAt).toLocaleTimeString()} direction="neutral" />
        </PanelCard>

        <div>
          <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <StatusChip label="Stable" status="ok" />
            <StatusChip label="Watch" status="warn" />
          </div>
          <CodexCompliance coverage={coverage} compact />
        </div>
      </CardGrid>

      <CardGrid>
        <PanelCard title="Layer Coherence Distribution" subtitle="Blueprint-defined per-layer scores.">
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {coherenceBars.map((layer) => (
              <TrendRow key={layer.label} label={layer.label} value={`${layer.value}%`} direction={layer.value >= 95 ? "up" : "down"} />
            ))}
          </div>
        </PanelCard>

        <PanelCard title="Mutation Log Timeline" subtitle="EVO-V events displayed chronologically.">
          <Timeline entries={mutationTimeline} />
        </PanelCard>
      </CardGrid>

      <CardGrid>
        <PanelCard title="Data & Governance" subtitle="Articles II-V implementation status.">
          <div style={{ display: "grid", gap: "0.45rem" }}>
            <TrendRow label="Article II Trace Coverage" value={`${blueprint.telemetry.governance.articleIITraceCoverage}%`} direction="up" />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Article IV SHA256 Trail</span>
              <StatusChip label={blueprint.telemetry.governance.articleIVSha256Verification ? "Verified" : "Missing"} status={blueprint.telemetry.governance.articleIVSha256Verification ? "ok" : "error"} />
            </div>
            <TrendRow label="Article III Drills" value={blueprint.telemetry.governance.articleIIIDrills} direction="neutral" />
            <TrendRow label="Article V Interruptibility" value={blueprint.telemetry.governance.articleVInterruptibility} direction="neutral" />
          </div>
        </PanelCard>

        <PanelCard title="Subscription & Billing" subtitle="Plan catalog and production readiness flags.">
          <div style={{ display: "grid", gap: "0.4rem" }}>
            {blueprint.stripe.subscriptionPlans.map((plan) => (
              <TrendRow key={plan.name} label={plan.name} value={`£${plan.price}/${plan.recurring}`} direction="neutral" />
            ))}
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              <StatusChip label="Dashboard Widgets" status={blueprint.stripe.featureAccess.dashboardWidgets ? "ok" : "error"} />
              <StatusChip label="Codex Templates" status={blueprint.stripe.featureAccess.codexTemplates ? "ok" : "error"} />
            </div>
          </div>
        </PanelCard>
      </CardGrid>

      <CardGrid>
        <AlertWidget alerts={alerts} compact />
        <PanelCard title="Mutation Status Summary" subtitle="Current mutation states from system log.">
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {blueprint.platform.mutationLog.map((event) => (
              <StatusChip key={event.id} label={`${event.event}`} status={mapSeverity(event.status)} />
            ))}
          </div>
        </PanelCard>
      </CardGrid>
    </DashboardShell>
  );
}
