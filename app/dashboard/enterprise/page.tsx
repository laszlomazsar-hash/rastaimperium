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
      <p>Workspace-isolated governance metrics with seat allocation and subscription tier policy.</p>

      <section>
        <h2>Enterprise Capabilities</h2>
        <ul>
          <li>Workspaces: {blueprint.enterprise.workspaces ? "✅" : "❌"}</li>
          <li>
            Subscription-Gated Access: {blueprint.enterprise.subscriptionGated ? "✅" : "❌"}
          </li>
          <li>
            Usage Billing: Tokens {blueprint.enterprise.usageBilling.tokens ? "✅" : "❌"}, API
            Calls {blueprint.enterprise.usageBilling.apiCalls ? "✅" : "❌"}, Seats{" "}
            {blueprint.enterprise.usageBilling.seats ? "✅" : "❌"}
          </li>
          <li>Multi-seat allocation: ✅</li>
        </ul>
      </section>

      <section>
        <h2>Enterprise Dashboards</h2>
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
      </section>
    </main>
  );
}
