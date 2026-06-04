"use client";

import { useMemo } from "react";

import { AlertWidget } from "../components/AlertWidget";
import { CodexCompliance } from "../components/CodexCompliance";
import { DashboardShell, LineChart, StatusChip, Timeline, TrendRow } from "../components/DashboardLayout";
import { useBlueprint } from "../../hooks/useBlueprint";
import { useRealtimeMetrics } from "../../hooks/useRealtimeMetrics";
import { SovereignIcon } from "../../components/icons/SovereignIcon";
import { mapCoherenceTrend, mapLayerCoherenceSeries, mapMutationTimeline, mapSeverity } from "./viewModels";
import { ConstitutionalPanel } from "../../components/constitutional/ConstitutionalPanel";
import { SystemBadge } from "../../components/constitutional/SystemBadge";
import { TelemetryField } from "../../components/constitutional/TelemetryField";
import { TopologySurface } from "../../components/constitutional/TopologySurface";

const DASHBOARD_LAYER_COUNT = 9;
const LAYER_JITTER_PATTERN = [-0.3, 0.3] as const;

type CoverageNode = { layer: string; coverage: number };

function buildCoverageFromRealtime(coherence: number): CoverageNode[] {
  const boundedCoherence = Math.min(100, Math.max(0, coherence));
  return Array.from({ length: DASHBOARD_LAYER_COUNT }, (_, index) => {
    const layer = index + 1;
    const jitter = LAYER_JITTER_PATTERN[layer % 2];
    return { layer: `L${layer}`, coverage: Number(Math.min(100, Math.max(0, boundedCoherence + jitter)).toFixed(2)) };
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
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SovereignIcon icon="dashboard_global" className="w-8 h-8" />
        <span>SoulEcho Dashboard</span>
      </h1>
      <p>Modern governance command center with cards, trend rows, and chart-driven insights.</p>
      <TopologySurface>
        <ConstitutionalPanel priority="high" state="stable" capability="activeUsers">
          <TelemetryField label="Active Users" value={String(realtime.activeUsers)} />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="standard" state="stable" capability="websocket">
          <TelemetryField label="WebSocket Latency" value={`${realtime.websocketLatencyMs}ms`} />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="critical" state={alerts.length ? "watch" : "stable"} capability="coherence">
          <TelemetryField label="Global Coherence" value={`${realtime.coherence}%`} />
          <SystemBadge state={alerts.length ? "watch" : "stable"} label={alertSummary} />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="standard" state="stable" capability="publicDemo">
          <TelemetryField label="Demo Access" value={blueprint.platform.realtimeMetrics.publicDemoAccess ? "Enabled" : "Disabled"} />
        </ConstitutionalPanel>
      </TopologySurface>
      <TopologySurface>
        <ConstitutionalPanel priority="high" state={alerts.length ? "watch" : "stable"} capability="realtimeTrends">
          <h2>Realtime Trends</h2>
          <LineChart data={coherenceTrend} />
          <TrendRow label="Alert stream" value={alerts.length ? `${alerts.length} events` : "clear"} direction={alerts.length ? "down" : "up"} />
          <TrendRow label="Feed freshness" value={new Date(realtime.updatedAt).toLocaleTimeString()} direction="neutral" />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="standard" state="stable" capability="complianceCoverage">
          <div style={{ marginBottom: "0.75rem", display: "flex", gap: "0.4rem" }}>
            <StatusChip label="Stable" status="ok" />
            <StatusChip label="Watch" status="warn" />
          </div>
          <CodexCompliance coverage={coverage} compact />
        </ConstitutionalPanel>
      </TopologySurface>
      <TopologySurface>
        <ConstitutionalPanel priority="high" state="stable" capability="layerCoherence">
          <h2>Layer Coherence Distribution</h2>
          {coherenceBars.map((layer) => <TrendRow key={layer.label} label={layer.label} value={`${layer.value}%`} direction={layer.value >= 95 ? "up" : "down"} />)}
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="high" state="stable" capability="mutationTimeline">
          <h2>Mutation Log Timeline</h2>
          <Timeline entries={mutationTimeline} />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="critical" state="stable" capability="governance">
          <h2>Data & Governance</h2>
          <TrendRow label="Article II Trace Coverage" value={`${blueprint.telemetry.governance.articleIITraceCoverage}%`} direction="up" />
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="standard" state="stable" capability="billing">
          <h2>Subscription & Billing</h2>
          {blueprint.stripe.subscriptionPlans.map((plan) => <TrendRow key={plan.name} label={plan.name} value={`£${plan.price}/${plan.recurring}`} direction="neutral" />)}
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="high" state={alerts.length ? "watch" : "stable"} capability="mutationSummary">
          <h2>Mutation Status Summary</h2>
          {blueprint.platform.mutationLog.map((event) => <StatusChip key={event.id} label={`${event.event}`} status={mapSeverity(event.status)} />)}
        </ConstitutionalPanel>
        <ConstitutionalPanel priority="standard" state={alerts.length ? "watch" : "stable"} capability="alertFeed">
          <AlertWidget alerts={alerts} compact />
        </ConstitutionalPanel>
      </TopologySurface>
    </DashboardShell>
  );
}
