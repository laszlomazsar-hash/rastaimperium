import { PanelCard, StatusChip } from "./DashboardLayout";
import { mapSeverity } from "../dashboard/viewModels";

function normalizeAlert(alert: string) {
  return { label: alert, severity: mapSeverity(alert) };
}

export function AlertWidget({ alerts, compact = false }: { alerts: string[]; compact?: boolean }) {
  const normalized = alerts.map(normalizeAlert);

  if (!alerts.length) {
    return (
      <PanelCard title="Alerts" subtitle="System anomaly stream.">
        <StatusChip label="No anomalies detected" status="ok" />
      </PanelCard>
    );
  }

  return (
    <PanelCard title="Alerts" subtitle="Severity-aware event feed with badges.">
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {(compact ? normalized.slice(0, 3) : normalized).map((alert) => (
          <div key={alert.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.9rem" }}>{alert.label}</span>
            <StatusChip label={alert.severity.toUpperCase()} status={alert.severity} />
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
