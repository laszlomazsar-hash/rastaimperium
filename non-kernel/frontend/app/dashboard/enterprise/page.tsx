"use client";
import { DashboardShell, StatusChip, TrendRow } from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";
import { SemanticIcon } from "../../components/SemanticIcons";
import { ConstitutionalPanel } from "../../../components/constitutional/ConstitutionalPanel";
import { TelemetryField } from "../../../components/constitutional/TelemetryField";
import { TopologySurface } from "../../../components/constitutional/TopologySurface";
import { CapabilityIcon } from "../../../components/constitutional/CapabilityIcon";
import { SovereignIcon } from "../../../components/icons/SovereignIcon";

const funnelStages = [
  { label: "New Leads", value: 1240 },
  { label: "SQL", value: 320 },
  { label: "Closed Consulting", value: 68 },
];

const tokenUsage = [40, 56, 62, 58, 77, 84, 73, 88, 91, 95, 92, 108];

const complianceRadar = [
  { article: "I", score: 92 },
  { article: "II", score: 84 },
  { article: "III", score: 88 },
  { article: "IV", score: 74 },
  { article: "V", score: 79 },
  { article: "VI", score: 86 },
  { article: "VII", score: 90 },
];

const workspacePulse = [
  { workspace: "Global Governance", health: 93, risk: "Low", cpl: "£214" },
  { workspace: "Financial Services", health: 87, risk: "Medium", cpl: "£251" },
  { workspace: "Public Sector", health: 90, risk: "Low", cpl: "£226" },
];

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

  const enterpriseDashboards = blueprint.platform.dashboards.filter(
    (dashboard) => dashboard.type === "enterprise",
  );

  const totalFunnel = funnelStages[0].value;
  const toSql = Math.round((funnelStages[1].value / totalFunnel) * 100);
  const toClosed = Math.round((funnelStages[2].value / funnelStages[1].value) * 100);
  const governanceHealth = 89;

  return (
    <DashboardShell>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CapabilityIcon capability="enterprise" className="w-8 h-8" />Enterprise Dashboard</h1>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon capabilityKey="enterprise" size="heading" decorative />Enterprise Dashboard</h1>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <SovereignIcon icon="enterprise_building" className="w-8 h-8" />
        <span>Enterprise Dashboard</span>
      </h1>
      
      <p>Enterprise governance telemetry using the shared card and status system.</p>

      <CardGrid>
        <StatCard priority="primary" label="Isolation Mode" value={blueprint.enterprise.workspaceModel.isolation} />
        <StatCard priority="secondary" label="Workspace Feature" value={blueprint.enterprise.workspaces ? "Enabled" : "Disabled"} />
        <StatCard priority="telemetry" label="Role Count" value={String(blueprint.enterprise.workspaceModel.roleMatrix.length)} detail="Role matrix entries" />
      </CardGrid>

      <CardGrid>
        <PanelCard priority="primary" title="Workspace Isolation & Permissions" subtitle="Role matrix and workspace controls.">
          <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <StatusChip label="Workspaces" status={blueprint.enterprise.workspaces ? "ok" : "error"} />
            <StatusChip label="Subscription Gated" status={blueprint.enterprise.subscriptionGated ? "ok" : "warn"} />
          </div>
          {blueprint.enterprise.workspaceModel.roleMatrix.map((role) => (
            <TrendRow key={role} label="Role" value={role} direction="neutral" />
          ))}
        </PanelCard>

        <PanelCard priority="secondary" title="Seat Allocation by Tier" subtitle="Included seats and extra seat pricing.">
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

      <PanelCard priority="telemetry" title="Enterprise Dashboards + Consulting Visibility" subtitle="Configured dashboards and advisory cadence.">
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
