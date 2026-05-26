import { ReactNode } from "react";

import { dashboardTokens, panelPriorityStyleMap, type PanelPriority } from "../design/tokens";

export type { PanelPriority } from "../design/tokens";

type TrendDirection = "up" | "down" | "neutral";

type DataPoint = {
  label: string;
  value: number;
};

type TimelineEntry = {
  id: string;
  title: string;
  subtitle: string;
  status?: "ok" | "warn" | "error";
};

const shellStyles = {
  page: { padding: dashboardTokens.spacing.pagePadding, display: "grid", gap: dashboardTokens.spacing.sectionGap },
  grid: { display: "grid", gap: dashboardTokens.spacing.gridGap, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  chip: {
    fontSize: "0.75rem",
    borderRadius: dashboardTokens.radius.pill,
    padding: "0.2rem 0.6rem",
    border: "1px solid",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
  },
} as const;

function panelStyle(priority: PanelPriority) {
  const priorityStyle = panelPriorityStyleMap[priority];
  return {
    border: dashboardTokens.border[priorityStyle.border],
    borderRadius: dashboardTokens.radius.panel,
    padding: dashboardTokens.spacing.panelPadding,
    background: dashboardTokens.color[priorityStyle.background],
    boxShadow: dashboardTokens.shadow[priorityStyle.elevation],
  } as const;
}

function panelTitleStyle(priority: PanelPriority) {
  const priorityStyle = panelPriorityStyleMap[priority];
  return { margin: 0, color: dashboardTokens.color.textStrong, fontWeight: dashboardTokens.typography[priorityStyle.titleWeight] } as const;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return <main style={shellStyles.page}>{children}</main>;
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <section style={shellStyles.grid}>{children}</section>;
}

export function PanelCard({ title, subtitle, children, priority = "secondary" }: { title: string; subtitle?: string; children: ReactNode; priority?: PanelPriority }) {
  return (
    <section style={panelStyle(priority)}>
      <h2 style={panelTitleStyle(priority)}>{title}</h2>
      {subtitle ? <p style={{ marginTop: dashboardTokens.spacing.subtitleMarginTop, color: dashboardTokens.color.textMuted }}>{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, detail, priority = "secondary" }: { label: string; value: string; detail?: string; priority?: PanelPriority }) {
  return (
    <article style={panelStyle(priority)}>
      <p style={{ margin: 0, fontSize: "0.85rem", color: dashboardTokens.color.textMuted }}>{label}</p>
      <p style={{ margin: "0.5rem 0", fontSize: "1.55rem", fontWeight: dashboardTokens.typography.bold }}>{value}</p>
      {detail ? <p style={{ margin: 0, color: dashboardTokens.color.textSubtle, fontSize: "0.8rem" }}>{detail}</p> : null}
    </article>
  );
}

export function TrendRow({ label, value, direction }: { label: string; value: string; direction: TrendDirection }) {
  const icon = direction === "up" ? "↗" : direction === "down" ? "↘" : "→";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0" }}>
      <span>{label}</span>
      <strong>
        {icon} {value}
      </strong>
    </div>
  );
}

export function StatusChip({ label, status }: { label: string; status: "ok" | "warn" | "error" | "neutral" }) {
  const tone =
    status === "ok"
      ? { color: "#166534", borderColor: "#86efac", background: "#f0fdf4" }
      : status === "warn"
        ? { color: "#92400e", borderColor: "#fcd34d", background: "#fffbeb" }
        : status === "error"
          ? { color: "#991b1b", borderColor: "#fca5a5", background: "#fef2f2" }
          : { color: "#1e293b", borderColor: "#cbd5e1", background: dashboardTokens.color.surfaceMuted };

  return <span style={{ ...shellStyles.chip, ...tone }}>{label}</span>;
}

export function LineChart({ data }: { data: DataPoint[] }) {
  const width = 420;
  const height = 120;
  if (!data.length) return <p>No trend data.</p>;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const norm = (value: number) => (max === min ? height / 2 : height - ((value - min) / (max - min)) * (height - 20) - 10);
  const points = data
    .map((point, index) => `${(index / Math.max(1, data.length - 1)) * width},${norm(point.value)}`)
    .join(" ");

  return <svg width="100%" viewBox={`0 0 ${width} ${height}`}><polyline fill="none" stroke="#2563eb" strokeWidth="3" points={points} /></svg>;
}

export function BarChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p>No bar data.</p>;
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      {data.map((item) => (
        <div key={item.label} style={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", gap: "0.5rem" }}>
          <span>{item.label}</span>
          <div style={{ height: "0.7rem", borderRadius: "99px", background: "#e2e8f0", overflow: "hidden" }}>
            <div style={{ width: `${(item.value / max) * 100}%`, height: "100%", background: "#0ea5e9" }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.65rem" }}>
      {entries.map((entry) => (
        <li key={entry.id} style={{ display: "grid", gridTemplateColumns: "12px 1fr", gap: "0.65rem" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", marginTop: "0.3rem", background: entry.status === "error" ? "#ef4444" : entry.status === "warn" ? "#f59e0b" : "#22c55e" }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{entry.title}</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>{entry.subtitle}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
