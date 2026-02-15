"use client";

import { useBlueprint } from "../../hooks/useBlueprint";
import { useRealtimeMetrics } from "../../hooks/useRealtimeMetrics";

export default function Dashboard() {
  const { blueprint, loading } = useBlueprint();
  const realtime = useRealtimeMetrics();

  if (loading) return <p>Loading Dashboard...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🌐 SoulEcho Dashboard</h1>
      <p>Enterprise & subscription-based governance metrics</p>

      <section>
        <h2>Real-time Metrics</h2>
        <p>
          Transport: {blueprint.platform.realtimeMetrics?.transport ?? "WebSocket"} | Public demo access:{" "}
          {blueprint.platform.realtimeMetrics?.publicDemoAccess ? "✅" : "❌"}
        </p>
        <ul>
          <li>Active users: {realtime.activeUsers}</li>
          <li>WebSocket latency: {realtime.websocketLatencyMs}ms</li>
          <li>Global coherence: {realtime.coherence}%</li>
          <li>Alerts: {realtime.alerts.join(", ")}</li>
          <li>Updated: {new Date(realtime.updatedAt).toLocaleTimeString()}</li>
        </ul>
      </section>

      <section>
        <h2>Layer Coherence (L1-L9)</h2>
        <ul>
          {blueprint.platform.layerCoherenceScores?.map((layer) => (
            <li key={layer.layer}>
              L{layer.layer} {layer.name}: {layer.score}%
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Mutation Log / EVO-V Events</h2>
        <ul>
          {blueprint.platform.mutationLog?.map((event) => (
            <li key={event.id}>
              {event.timestamp} — {event.event} ({event.actor}) [{event.status}]
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Data & Governance (Articles II-V)</h2>
        <ul>
          <li>Trace coverage (Article II): {blueprint.telemetry?.governance.articleIITraceCoverage}%</li>
          <li>
            SHA256 verification trail (Article IV):{" "}
            {blueprint.telemetry?.governance.articleIVSha256Verification ? "✅" : "❌"}
          </li>
          <li>Interruptibility drills (Article III): {blueprint.telemetry?.governance.articleIIIDrills}</li>
          <li>Human-in-loop flow tests (Article V): {blueprint.telemetry?.governance.articleVInterruptibility}</li>
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
          Feature gating: dashboard widgets {blueprint.stripe.featureAccess?.dashboardWidgets ? "✅" : "❌"} |
          Codex templates {blueprint.stripe.featureAccess?.codexTemplates ? "✅" : "❌"}
        </p>
        <p>Usage billing meters: {blueprint.stripe.usageBillingMeters?.join(", ")}</p>
        <p>
          Webhook chain verified: {blueprint.stripe.productionReadiness?.webhookToDbSync ? "✅" : "❌"} |
          Email receipts: {blueprint.stripe.productionReadiness?.emailReceiptChain ? "✅" : "❌"} |
          Customer portal live: {blueprint.stripe.productionReadiness?.customerPortalLive ? "✅" : "❌"}
        </p>
      </section>
    </main>
  );
}
