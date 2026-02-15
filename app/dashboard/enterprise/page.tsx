"use client";

import { useBlueprint } from "../../../hooks/useBlueprint";

export default function EnterpriseDashboardPage() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Enterprise Dashboard...</p>;
  if (!blueprint) return <p>Error loading enterprise metrics.</p>;

  const enterpriseDashboards = blueprint.platform.dashboards.filter(
    (dashboard) => dashboard.type === "enterprise",
  );

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🏢 Enterprise Dashboard</h1>
      <p>Enterprise-specific governance and workspace telemetry.</p>

      <section>
        <h2>Workspace Isolation & Permissions</h2>
        <ul>
          <li>Workspaces: {blueprint.enterprise.workspaces ? "✅" : "❌"}</li>
          <li>Isolation mode: {blueprint.enterprise.workspaceModel?.isolation}</li>
          <li>Role matrix: {blueprint.enterprise.workspaceModel?.roleMatrix.join(", ")}</li>
        </ul>
      </section>

      <section>
        <h2>Seat Allocation by Subscription Tier</h2>
        <ul>
          {blueprint.enterprise.workspaceModel?.seatAllocation.map((seatTier) => (
            <li key={seatTier.tier}>
              {seatTier.tier}: {seatTier.includedSeats} included seats, £{seatTier.extraSeatPrice} per extra seat
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Enterprise Dashboards + Consulting Visibility</h2>
        {enterpriseDashboards.length > 0 ? (
          <ul>
            {enterpriseDashboards.map((dashboard) => (
              <li key={dashboard.name}>
                {dashboard.name} — Path: {dashboard.path}
              </li>
            ))}
          </ul>
        ) : (
          <p>No enterprise dashboards configured.</p>
        )}
        <p>
          Consulting report cadence: {blueprint.telemetry?.consultingVisibility.reportCadence} | Linked dashboards:{" "}
          {blueprint.telemetry?.consultingVisibility.linkedDashboards.join(", ")}
        </p>
      </section>
    </main>
  );
}
