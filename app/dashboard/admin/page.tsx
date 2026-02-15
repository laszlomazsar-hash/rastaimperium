"use client";

import {
  CardGrid,
  DashboardShell,
  PanelCard,
  StatCard,
  StatusChip,
} from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";

export default function AdminGovernanceControlPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Admin Governance Controls...</p>;
  if (!blueprint) return <p>Error loading admin controls.</p>;

  return (
    <DashboardShell>
      <h1>🛡️ Admin Governance Control</h1>
      <p>Unified governance controls using the shared dashboard card language.</p>

      <CardGrid>
        <StatCard label="Dashboard Control" value={blueprint.admin.controls.dashboards ? "Enabled" : "Disabled"} />
        <StatCard label="Subscription Tier Control" value={blueprint.admin.controls.subscriptionTiers ? "Enabled" : "Disabled"} />
        <StatCard label="Codex Update Control" value={blueprint.admin.controls.codexUpdates ? "Enabled" : "Disabled"} />
      </CardGrid>

      <PanelCard title="Governance and Deployment Controls" subtitle="Critical admin capability toggles.">
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          <StatusChip label="Audit logs (Article IV)" status={blueprint.admin.auditLogs ? "ok" : "error"} />
          <StatusChip label="v3.5 trigger" status={blueprint.admin.deploymentControls.v35Triggers ? "ok" : "warn"} />
          <StatusChip label="Rollback" status={blueprint.admin.deploymentControls.rollback ? "ok" : "error"} />
        </div>
      </PanelCard>
    </DashboardShell>
  );
}
