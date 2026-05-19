import { BarChart, PanelCard, StatusChip, TrendRow } from "./DashboardLayout";

type CoverageNode = { layer: string; coverage: number };

function getCoverageStatus(coverage: number): "ok" | "warn" | "error" {
  if (coverage >= 96) return "ok";
  if (coverage >= 92) return "warn";
  return "error";
}

export function CodexCompliance({ coverage, compact = false }: { coverage: CoverageNode[]; compact?: boolean }) {
  const avgCoverage = coverage.length
    ? Number((coverage.reduce((acc, node) => acc + node.coverage, 0) / coverage.length).toFixed(2))
    : 0;

  return (
    <PanelCard title="Article II Trace Coverage" subtitle="Layer-by-layer codex compliance with severity badges.">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <strong>{avgCoverage}% avg coverage</strong>
        <StatusChip label={avgCoverage >= 96 ? "Compliant" : "Needs Review"} status={getCoverageStatus(avgCoverage)} />
      </div>
      {compact ? (
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {coverage.slice(0, 4).map((node) => (
            <TrendRow key={node.layer} label={node.layer} value={`${node.coverage}%`} direction={node.coverage >= avgCoverage ? "up" : "down"} />
          ))}
        </div>
      ) : (
        <BarChart data={coverage.map((node) => ({ label: node.layer, value: node.coverage }))} />
      )}
    </PanelCard>
  );
}
