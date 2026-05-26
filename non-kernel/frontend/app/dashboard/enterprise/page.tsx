"use client";
import { DashboardShell, StatusChip, TrendRow } from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";
import { SemanticIcon } from "../../components/SemanticIcons";
import { ConstitutionalPanel } from "../../../components/constitutional/ConstitutionalPanel";
import { TelemetryField } from "../../../components/constitutional/TelemetryField";
import { TopologySurface } from "../../../components/constitutional/TopologySurface";
export default function EnterpriseDashboardPage() {
  const { blueprint, loading } = useBlueprint();
  if (loading) return <p>Loading Enterprise Dashboard...</p>;
  if (!blueprint) return <p>Error loading enterprise metrics.</p>;
  const enterpriseDashboards = blueprint.platform.dashboards.filter((dashboard) => dashboard.type === "enterprise");
  return (<DashboardShell><h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon name="enterprise" size="heading" decorative />Enterprise Dashboard</h1><p>Enterprise governance telemetry using the shared card and status system.</p>
    <TopologySurface>
      <ConstitutionalPanel priority="high" state="stable"><TelemetryField label="Isolation Mode" value={blueprint.enterprise.workspaceModel.isolation} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="high" state={blueprint.enterprise.workspaces ? "stable" : "degraded"}><TelemetryField label="Workspace Feature" value={blueprint.enterprise.workspaces ? "Enabled" : "Disabled"} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="standard" state="stable"><TelemetryField label="Role Count" value={String(blueprint.enterprise.workspaceModel.roleMatrix.length)} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="critical" state="stable"><h2>Workspace Isolation & Permissions</h2><div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}><StatusChip label="Workspaces" status={blueprint.enterprise.workspaces ? "ok" : "error"} /><StatusChip label="Subscription Gated" status={blueprint.enterprise.subscriptionGated ? "ok" : "warn"} /></div>{blueprint.enterprise.workspaceModel.roleMatrix.map((role) => <TrendRow key={role} label="Role" value={role} direction="neutral" />)}</ConstitutionalPanel>
      <ConstitutionalPanel priority="high" state="stable"><h2>Seat Allocation by Tier</h2>{blueprint.enterprise.workspaceModel.seatAllocation.map((seatTier) => <TrendRow key={seatTier.tier} label={seatTier.tier} value={`${seatTier.includedSeats} seats · £${seatTier.extraSeatPrice} extra`} direction="neutral" />)}</ConstitutionalPanel>
      <ConstitutionalPanel priority="high" state="stable"><h2>Enterprise Dashboards + Consulting Visibility</h2>{enterpriseDashboards.length > 0 ? enterpriseDashboards.map((dashboard) => <TrendRow key={dashboard.name} label={dashboard.name} value={dashboard.path} direction="neutral" />) : <p>No enterprise dashboards configured.</p>}<TrendRow label="Consulting cadence" value={blueprint.telemetry.consultingVisibility.reportCadence} direction="neutral" /></ConstitutionalPanel>
    </TopologySurface></DashboardShell>);
}
