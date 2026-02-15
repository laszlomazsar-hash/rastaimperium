"use client";

import { useMemo } from "react";

import { AlertWidget } from "../components/AlertWidget";
import { CodexCompliance } from "../components/CodexCompliance";
import { useBlueprint } from "../../hooks/useBlueprint";
import { useRealtimeMetrics } from "../../hooks/useRealtimeMetrics";

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

  return (
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>🌐 SoulEcho Dashboard</h1>
      <p>Real-time governance metrics with subscription-gated and enterprise widgets.</p>

      <section>
        <h2>Real-time Metrics</h2>
        <p>
          Transport: {blueprint.platform.realtimeMetrics.transport} | Public demo access: {blueprint.platform.realtimeMetrics.publicDemoAccess ? "✅" : "❌"}
        </p>
        <ul>
          <li>Active users: {realtime.activeUsers}</li>
          <li>WebSocket latency: {realtime.websocketLatencyMs}ms</li>
          <li>Global coherence: {realtime.coherence}%</li>
          <li>Alerts: {alertSummary}</li>
          <li>Updated: {new Date(realtime.updatedAt).toLocaleTimeString()}</li>
        </ul>
      </section>

      <section>
        <h2>Layer Coherence (L1-L9)</h2>
        <ul>
          {blueprint.platform.layerCoherenceScores.map((layer) => (
            <li key={layer.layer}>
              L{layer.layer} {layer.name}: {layer.score}%
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mutation Log / EVO-V Events</h2>
        <ul>
          {blueprint.platform.mutationLog.map((event) => (
            <li key={event.id}>
              {event.timestamp} — {event.event} ({event.actor}) [{event.status}]
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Data & Governance (Articles II-V)</h2>
        <ul>
          <li>Trace coverage (Article II): {blueprint.telemetry.governance.articleIITraceCoverage}%</li>
          <li>
            SHA256 verification trail (Article IV):{" "}
            {blueprint.telemetry.governance.articleIVSha256Verification ? "✅" : "❌"}
          </li>
          <li>Interruptibility drills (Article III): {blueprint.telemetry.governance.articleIIIDrills}</li>
          <li>Human-in-loop flow tests (Article V): {blueprint.telemetry.governance.articleVInterruptibility}</li>
        </ul>
      </section>

      <section>
        <h2>Subscription Plans</h2>
        <ul>
          {blueprint.stripe.subscriptionPlans.map((plan) => (
            <li key={plan.name}>
              {plan.name} — £{plan.price} / {plan.recurring}
            </li>
          ))}
        </ul>
        <p>
          Feature gating: dashboard widgets {blueprint.stripe.featureAccess.dashboardWidgets ? "✅" : "❌"} |
          Codex templates {blueprint.stripe.featureAccess.codexTemplates ? "✅" : "❌"}
        </p>
        <p>Usage billing meters: {blueprint.stripe.usageBillingMeters.join(", ")}</p>
        <p>
          Webhook chain verified: {blueprint.stripe.productionReadiness.webhookToDbSync ? "✅" : "❌"} |
          Email receipts: {blueprint.stripe.productionReadiness.emailReceiptChain ? "✅" : "❌"} |
          Customer portal live: {blueprint.stripe.productionReadiness.customerPortalLive ? "✅" : "❌"}
        </p>
      </section>

      <CodexCompliance coverage={coverage} />
      <AlertWidget alerts={alerts} />
    </main>
  );
}
