"use client";

import { useBlueprint } from "../../../hooks/useBlueprint";

export default function AdminGovernanceControlPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Admin Governance Controls...</p>;
  if (!blueprint?.admin) return <p>Error loading admin controls.</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🛡️ Admin Governance Control</h1>
      <ul>
        <li>Dashboard control: {blueprint.admin.controls.dashboards ? "✅" : "❌"}</li>
        <li>Subscription tier control: {blueprint.admin.controls.subscriptionTiers ? "✅" : "❌"}</li>
        <li>Codex update control: {blueprint.admin.controls.codexUpdates ? "✅" : "❌"}</li>
        <li>Audit logs enabled (Article IV): {blueprint.admin.auditLogs ? "✅" : "❌"}</li>
        <li>v3.5 deployment trigger: {blueprint.admin.deploymentControls.v35Triggers ? "✅" : "❌"}</li>
        <li>Rollback controls: {blueprint.admin.deploymentControls.rollback ? "✅" : "❌"}</li>
      </ul>
    </main>
  );
}
