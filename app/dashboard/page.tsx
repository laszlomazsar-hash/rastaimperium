"use client";

import { useBlueprint } from "../../hooks/useBlueprint";

export default function Dashboard() {
  const { blueprint, loading } = useBlueprint();

  if (loading) return <p>Loading Dashboard...</p>;
  if (!blueprint) return <p>Error loading blueprint.</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>🌐 SoulEcho Dashboard</h1>
      <p>Enterprise & subscription-based governance metrics</p>

      <section>
        <h2>Subscription Plans</h2>
        <ul>
          {blueprint.stripe.subscriptionPlans.map((plan) => (
            <li key={plan.name}>
              {plan.name} — £{plan.price} / {plan.recurring}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Dashboards</h2>
        <ul>
          {blueprint.platform.dashboards.map((dash) => (
            <li key={dash.name}>
              {dash.name} ({dash.type}) — Path: {dash.path}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Enterprise Features</h2>
        <ul>
          <li>Workspaces: {blueprint.enterprise.workspaces ? "✅" : "❌"}</li>
          <li>
            Subscription-Gated: {blueprint.enterprise.subscriptionGated ? "✅" : "❌"}
          </li>
          <li>
            Usage Billing: Tokens {blueprint.enterprise.usageBilling.tokens ? "✅" : "❌"}, API
            Calls {blueprint.enterprise.usageBilling.apiCalls ? "✅" : "❌"}, Seats{" "}
            {blueprint.enterprise.usageBilling.seats ? "✅" : "❌"}
          </li>
        </ul>
      </section>
    </main>
  );
}
