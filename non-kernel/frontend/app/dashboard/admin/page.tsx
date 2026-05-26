"use client";
import { useEffect, useState } from "react";
import { DashboardShell, StatusChip } from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";
import { CapabilityIcon } from "../../../components/constitutional/CapabilityIcon";
import { apiUrl } from "../../utils/api";
import { ConstitutionalPanel } from "../../../components/constitutional/ConstitutionalPanel";
import { TelemetryField } from "../../../components/constitutional/TelemetryField";
import { TopologySurface } from "../../../components/constitutional/TopologySurface";
type PipelineStatus = { status: "new" | "qualified" | "discovery_booked" | "proposal_sent" | "won" | "lost"; count: number };
export default function AdminGovernanceControlPage() {
  const { blueprint, loading } = useBlueprint();
  const [pipeline, setPipeline] = useState<PipelineStatus[]>([]);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  useEffect(() => { let active = true; const loadPipeline = async () => { try { const response = await fetch(apiUrl("/api/v1/admin/leads/pipeline")); const data = (await response.json()) as PipelineStatus[] | { detail?: string }; if (!response.ok) { if (active) setPipelineError((data as { detail?: string }).detail || "Failed to load lead pipeline."); return; } if (active) { setPipeline(data as PipelineStatus[]); setPipelineError(null);} } catch { if (active) setPipelineError("Could not connect to lead pipeline API."); } }; loadPipeline(); return () => { active = false; }; }, []);
  if (loading) return <p>Loading Admin Governance Controls...</p>;
  if (!blueprint) return <p>Error loading admin controls.</p>;
  return (<DashboardShell><h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon name="admin" size="heading" decorative />Admin Governance Control</h1><p>Unified governance controls using the shared dashboard card language.</p>
    <TopologySurface>
      <ConstitutionalPanel priority="critical" state={blueprint.admin.controls.dashboards ? "stable" : "degraded"}><TelemetryField label="Dashboard Control" value={blueprint.admin.controls.dashboards ? "Enabled" : "Disabled"} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="high" state={blueprint.admin.controls.subscriptionTiers ? "stable" : "watch"}><TelemetryField label="Subscription Tier Control" value={blueprint.admin.controls.subscriptionTiers ? "Enabled" : "Disabled"} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="high" state={blueprint.admin.controls.codexUpdates ? "stable" : "watch"}><TelemetryField label="Codex Update Control" value={blueprint.admin.controls.codexUpdates ? "Enabled" : "Disabled"} /></ConstitutionalPanel>
      <ConstitutionalPanel priority="critical" state={pipelineError ? "degraded" : "stable"} capability="governanceControls"><h2>Governance and Deployment Controls</h2><div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}><StatusChip label="Audit logs (Article IV)" status={blueprint.admin.auditLogs ? "ok" : "error"} /><StatusChip label="v3.5 trigger" status={blueprint.admin.deploymentControls.v35Triggers ? "ok" : "warn"} /><StatusChip label="Rollback" status={blueprint.admin.deploymentControls.rollback ? "ok" : "error"} /></div>{pipelineError ? <p>{pipelineError}</p> : <p>Pipeline stages: {pipeline.length}</p>}</ConstitutionalPanel>
    </TopologySurface></DashboardShell>);

  return (
    <DashboardShell>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><CapabilityIcon capability="admin" className="w-8 h-8" />Admin Governance Control</h1>
      
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon capabilityKey="admin" size="heading" decorative />Admin Governance Control</h1>
      <h1>️ Admin Governance Control</h1>
      <p>Unified governance controls using the shared dashboard card language.</p>

      <CardGrid>
        <StatCard priority="critical" label="Dashboard Control" value={blueprint.admin.controls.dashboards ? "Enabled" : "Disabled"} />
        <StatCard priority="secondary" label="Subscription Tier Control" value={blueprint.admin.controls.subscriptionTiers ? "Enabled" : "Disabled"} />
        <StatCard priority="critical" label="Codex Update Control" value={blueprint.admin.controls.codexUpdates ? "Enabled" : "Disabled"} />
      </CardGrid>

      <PanelCard priority="critical" title="Governance and Deployment Controls" subtitle="Critical admin capability toggles.">
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          <StatusChip label="Audit logs (Article IV)" status={blueprint.admin.auditLogs ? "ok" : "error"} />
          <StatusChip label="v3.5 trigger" status={blueprint.admin.deploymentControls.v35Triggers ? "ok" : "warn"} />
          <StatusChip label="Rollback" status={blueprint.admin.deploymentControls.rollback ? "ok" : "error"} />
        </div>
      </PanelCard>
    </DashboardShell>
  );
}
