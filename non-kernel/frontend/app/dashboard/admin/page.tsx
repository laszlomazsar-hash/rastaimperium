"use client";

import { useEffect, useState } from "react";
import {
  CardGrid,
  DashboardShell,
  PanelCard,
  StatCard,
  StatusChip,
} from "../../components/DashboardLayout";
import { useBlueprint } from "../../../hooks/useBlueprint";
import { SemanticIcon } from "../../components/SemanticIcons";
import { apiUrl } from "../../utils/api";
import { SovereignIcon } from "../../../components/icons/SovereignIcon";

type PipelineStatus = {
  status: "new" | "qualified" | "discovery_booked" | "proposal_sent" | "won" | "lost";
  count: number;
};

export default function AdminGovernanceControlPage() {
  const { blueprint, loading } = useBlueprint();
  const [pipeline, setPipeline] = useState<PipelineStatus[]>([]);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadPipeline = async () => {
      try {
        const response = await fetch(apiUrl("/api/v1/admin/leads/pipeline"));
        const data = (await response.json()) as PipelineStatus[] | { detail?: string };

        if (!response.ok) {
          if (active) {
            setPipelineError((data as { detail?: string }).detail || "Failed to load lead pipeline.");
          }
          return;
        }

        if (active) {
          setPipeline(data as PipelineStatus[]);
          setPipelineError(null);
        }
      } catch (error) {
        if (active) {
          setPipelineError("Could not connect to lead pipeline API.");
        }
      }
    };

    loadPipeline();
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p>Loading Admin Governance Controls...</p>;
  if (!blueprint) return <p>Error loading admin controls.</p>;

  return (
    <DashboardShell>
      <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><SemanticIcon name="admin" size="heading" decorative />Admin Governance Control</h1>
      <h1>️ Admin Governance Control</h1>
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
