"use client";

import {
  CardGrid,
  DashboardShell,
  PanelCard,
  StatCard,
  StatusChip,
  TrendRow,
} from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";

export default function EnterpriseDashboardPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Enterprise Dashboard...</p>;
  if (!blueprint) return <p>Error loading enterprise metrics.</p>;

  const enterpriseDashboards = blueprint.platform.dashboards.filter(
    (dashboard) => dashboard.type === "enterprise",
  );

  return (
    <DashboardShell>
      <h1>🏢 Enterprise Dashboard</h1>
      <p>Enterprise governance telemetry using the shared card and status system.</p>

      <CardGrid>
        <StatCard label="Isolation Mode" value={blueprint.enterprise.workspaceModel.isolation} />
        <StatCard label="Workspace Feature" value={blueprint.enterprise.workspaces ? "Enabled" : "Disabled"} />
        <StatCard label="Role Count" value={String(blueprint.enterprise.workspaceModel.roleMatrix.length)} detail="Role matrix entries" />
      </CardGrid>

      <CardGrid>
        <PanelCard title="Workspace Isolation & Permissions" subtitle="Role matrix and workspace controls.">
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <StatusChip label="Workspaces" status={blueprint.enterprise.workspaces ? "ok" : "error"} />
            <StatusChip label="Subscription Gated" status={blueprint.enterprise.subscriptionGated ? "ok" : "warn"} />
          </div>
          {blueprint.enterprise.workspaceModel.roleMatrix.map((role) => (
            <TrendRow key={role} label="Role" value={role} direction="neutral" />
          ))}
        </PanelCard>

        <PanelCard title="Seat Allocation by Tier" subtitle="Included seats and extra seat pricing.">
          {blueprint.enterprise.workspaceModel.seatAllocation.map((seatTier) => (
            <TrendRow
              key={seatTier.tier}
              label={seatTier.tier}
              value={`${seatTier.includedSeats} seats · £${seatTier.extraSeatPrice} extra`}
              direction="neutral"
            />
          ))}
        </PanelCard>
      </CardGrid>

      <PanelCard title="Enterprise Dashboards + Consulting Visibility" subtitle="Configured dashboards and advisory cadence.">
        {enterpriseDashboards.length > 0 ? (
          enterpriseDashboards.map((dashboard) => (
            <TrendRow key={dashboard.name} label={dashboard.name} value={dashboard.path} direction="neutral" />
          ))
        ) : (
          <p>No enterprise dashboards configured.</p>
        )}
        <div style={{ marginTop: "0.65rem" }}>
          <TrendRow label="Consulting cadence" value={blueprint.telemetry.consultingVisibility.reportCadence} direction="neutral" />
          <TrendRow label="Linked dashboards" value={blueprint.telemetry.consultingVisibility.linkedDashboards.join(", ")} direction="neutral" />
        </div>
      </PanelCard>
    </DashboardShell>
  );
}
