"use client";

import { useEffect, useState } from "react";

import { useBlueprint } from "../../../hooks/useBlueprint";

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
        const response = await fetch("/api/v1/admin/leads/pipeline");
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
    <main style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <h1>🛡️ Admin Governance Control</h1>
      <ul>
        <li>Dashboard control: {blueprint.admin.controls.dashboards ? "✅" : "❌"}</li>
        <li>Subscription tier control: {blueprint.admin.controls.subscriptionTiers ? "✅" : "❌"}</li>
        <li>Codex update control: {blueprint.admin.controls.codexUpdates ? "✅" : "❌"}</li>
        <li>Audit logs enabled (Article IV): {blueprint.admin.auditLogs ? "✅" : "❌"}</li>
        <li>v3.5 deployment trigger: {blueprint.admin.deploymentControls.v35Triggers ? "✅" : "❌"}</li>
        <li>Rollback controls: {blueprint.admin.deploymentControls.rollback ? "✅" : "❌"}</li>
      </ul>

      <section>
        <h2>Lead Pipeline Visibility</h2>
        {pipelineError ? <p>{pipelineError}</p> : null}
        <ul>
          {pipeline.map((stage) => (
            <li key={stage.status}>
              {stage.status.replaceAll("_", " ")}: {stage.count}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
