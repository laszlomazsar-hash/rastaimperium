import { ReactNode } from "react";
import { color, radius, spacing, stroke, typography } from "@/theme/tokens";

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
    gap: spacing[3],
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
  return {
    margin: 0,
    color: dashboardTokens.color.textStrong,
    fontWeight: dashboardTokens.typography[priorityStyle.titleWeight],
  } as const;
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
  const indicator = direction === "up" ? "increase" : direction === "down" ? "decrease" : "steady";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${spacing[4]} ${spacing[0]}` }}>
      <span>{label}</span>
      <strong aria-label={`${indicator}: ${value}`}>{value}</strong>
    </div>
  );
}

export function StatusChip({ label, status }: { label: string; status: "ok" | "warn" | "error" | "neutral" }) {
  const tone =
    status === "ok"
      ? { color: color.text.success, borderColor: color.border.success, background: color.surface.success }
      : status === "warn"
        ? { color: color.text.warning, borderColor: color.border.warning, background: color.surface.warning }
        : status === "error"
          ? { color: color.text.danger, borderColor: color.border.danger, background: color.surface.danger }
          : { color: color.text.primary, borderColor: color.border.neutral, background: color.surface.neutral };

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

  return <svg width="100%" viewBox={`0 0 ${width} ${height}`}><polyline fill="none" stroke={color.chart.linePrimary} strokeWidth={stroke.chart} points={points} /></svg>;
}

export function BarChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p>No bar data.</p>;
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div style={{ display: "grid", gap: spacing[4] }}>
      {data.map((item) => (
        <div key={item.label} style={{ display: "grid", gridTemplateColumns: `${spacing[16]} 1fr ${spacing[16]}`, alignItems: "center", gap: spacing[5] }}>
          <span>{item.label}</span>
          <div style={{ height: spacing[8], borderRadius: radius.pill, background: color.surface.barTrack, overflow: "hidden" }}>
            {/* Runtime geometry exception: width is data-driven at render time and intentionally remains inline. */}
            <div style={{ width: `${(item.value / max) * 100}%`, height: "100%", background: color.chart.barFill }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol style={{ listStyle: "none", padding: spacing[0], margin: spacing[0], display: "grid", gap: spacing[7] }}>
      {entries.map((entry) => (
        <li key={entry.id} style={{ display: "grid", gridTemplateColumns: `${spacing[15]} 1fr`, gap: spacing[7] }}>
          <span style={{ width: spacing[14], height: spacing[14], borderRadius: radius.round, marginTop: spacing[2], background: entry.status === "error" ? color.chart.timelineDanger : entry.status === "warn" ? color.chart.timelineWarning : color.chart.timelineSuccess }} />
          <div>
            <p style={{ margin: spacing[0], fontWeight: typography.weight.semibold }}>{entry.title}</p>
            <p style={{ margin: spacing[0], color: color.text.subtle, fontSize: typography.size.md }}>{entry.subtitle}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
