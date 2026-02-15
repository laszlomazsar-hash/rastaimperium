"use client";

import { useBlueprint } from "../../../hooks/useBlueprint";

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

  const enterpriseDashboards = blueprint.platform.dashboards.filter(
    (dashboard) => dashboard.type === "enterprise",
  );

  const totalFunnel = funnelStages[0].value;
  const toSql = Math.round((funnelStages[1].value / totalFunnel) * 100);
  const toClosed = Math.round((funnelStages[2].value / funnelStages[1].value) * 100);
  const governanceHealth = 89;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🏢 SoulEcho Enterprise Dashboard</h1>
      <p>Acquisition-to-governance performance view for enterprise programs.</p>

      <section
        style={{
          display: "grid",
          gap: "0.8rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          margin: "1.5rem 0",
        }}
      >
        <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Governance Health Meter</p>
          <h2 style={{ margin: "0.4rem 0" }}>{governanceHealth}/100</h2>
          <progress max={100} value={governanceHealth} style={{ width: "100%" }} />
        </div>
        <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Lead → SQL Conversion</p>
          <h2 style={{ margin: "0.4rem 0" }}>{toSql}%</h2>
          <p style={{ margin: 0 }}>CPL: £238</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>SQL → Closed Rate</p>
          <h2 style={{ margin: "0.4rem 0" }}>{toClosed}%</h2>
          <p style={{ margin: 0 }}>CAC: £3,980</p>
        </div>
        <div style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <p style={{ margin: 0, fontSize: "0.85rem" }}>Avg Monthly Token Usage</p>
          <h2 style={{ margin: "0.4rem 0" }}>82k</h2>
          <p style={{ margin: 0 }}>+11% QoQ</p>
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Funnel KPIs</h2>
        <ul>
          {funnelStages.map((stage) => (
            <li key={stage.label}>
              {stage.label}: {stage.value}
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Token Usage Trends</h2>
        <svg viewBox="0 0 320 120" style={{ width: "100%", maxWidth: "700px", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            points={tokenUsage
              .map((point, i) => `${i * 28 + 6},${115 - point}`)
              .join(" ")}
          />
        </svg>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Compliance Radar (Patrol Articles I–VII)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem", maxWidth: "700px" }}>
          {complianceRadar.map((item) => (
            <div key={item.article} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "0.6rem" }}>
              <strong>Article {item.article}</strong>
              <p style={{ margin: "0.2rem 0 0" }}>{item.score}/100</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Enterprise Pulse</h2>
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #d1d5db", padding: "0.5rem" }}>Workspace</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #d1d5db", padding: "0.5rem" }}>Health</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #d1d5db", padding: "0.5rem" }}>Risk</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #d1d5db", padding: "0.5rem" }}>CPL</th>
            </tr>
          </thead>
          <tbody>
            {workspacePulse.map((workspace) => (
              <tr key={workspace.workspace}>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>{workspace.workspace}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>{workspace.health}/100</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>{workspace.risk}</td>
                <td style={{ borderBottom: "1px solid #e5e7eb", padding: "0.5rem" }}>{workspace.cpl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Workspace Isolation & Permissions</h2>
        <ul>
          <li>Workspaces: {blueprint.enterprise.workspaces ? "✅" : "❌"}</li>
          <li>Isolation mode: {blueprint.enterprise.workspaceModel.isolation}</li>
          <li>Role matrix: {blueprint.enterprise.workspaceModel.roleMatrix.join(", ")}</li>
        </ul>
        <p>
          Consulting report cadence: {blueprint.telemetry.consultingVisibility.reportCadence} | Linked dashboards:{" "}
          {blueprint.telemetry.consultingVisibility.linkedDashboards.join(", ")}
        </p>
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
