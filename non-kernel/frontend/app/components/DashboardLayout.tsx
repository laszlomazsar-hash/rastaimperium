import { ReactNode } from "react";
import { color, elevation, radius, spacing, stroke, typography } from "@/theme/tokens";

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
  page: { padding: spacing[13], display: "grid", gap: spacing[12] },
  grid: { display: "grid", gap: spacing[9], gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" },
  card: {
    border: `${stroke.thin} solid ${color.border.default}`,
    borderRadius: radius.sm,
    padding: spacing[12],
    background: color.surface.base,
    boxShadow: elevation.card,
  },
  chip: {
    fontSize: typography.size.xs,
    borderRadius: radius.full,
    padding: `${spacing[1]} ${spacing[6]}`,
    border: `${stroke.thin} solid`,
    display: "inline-flex",
    alignItems: "center",
    gap: spacing[3],
  },
} as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  return <main style={shellStyles.page}>{children}</main>;
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <section style={shellStyles.grid}>{children}</section>;
}

export function PanelCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section style={shellStyles.card}>
      <h2 style={{ margin: spacing[0] }}>{title}</h2>
      {subtitle ? <p style={{ marginTop: spacing[3], color: color.text.muted }}>{subtitle}</p> : null}
      <div>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article style={shellStyles.card}>
      <p style={{ margin: spacing[0], fontSize: typography.size.md, color: color.text.muted }}>{label}</p>
      <p style={{ margin: `${spacing[5]} ${spacing[0]}`, fontSize: typography.size.xl, fontWeight: typography.weight.bold }}>{value}</p>
      {detail ? <p style={{ margin: spacing[0], color: color.text.subtle, fontSize: typography.size.sm }}>{detail}</p> : null}
    </article>
  );
}

export function TrendRow({ label, value, direction }: { label: string; value: string; direction: TrendDirection }) {
  const icon = direction === "up" ? "↗" : direction === "down" ? "↘" : "→";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${spacing[4]} ${spacing[0]}` }}>
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
