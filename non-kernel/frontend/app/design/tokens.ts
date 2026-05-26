export const dashboardTokens = {
  spacing: {
    pagePadding: "2rem",
    sectionGap: "1rem",
    gridGap: "0.75rem",
    panelPadding: "1rem",
    subtitleMarginTop: "0.35rem",
  },
  radius: {
    panel: "0.75rem",
    pill: "999px",
  },
  shadow: {
    low: "0 1px 3px rgba(15,23,42,0.04)",
    medium: "0 2px 8px rgba(15,23,42,0.06)",
    high: "0 8px 24px rgba(15,23,42,0.1)",
  },
  border: {
    soft: "1px solid #e2e8f0",
    default: "1px solid #e5e7eb",
    strong: "1px solid #cbd5e1",
    critical: "1px solid #fca5a5",
  },
  color: {
    surface: "#ffffff",
    surfaceMuted: "#f8fafc",
    surfaceTelemetry: "#f0f9ff",
    surfaceCritical: "#fef2f2",
    textStrong: "#0f172a",
    textMuted: "#475569",
    textSubtle: "#64748b",
  },
  typography: {
    regular: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export type PanelPriority = "primary" | "secondary" | "telemetry" | "critical";

type PriorityStyle = {
  elevation: keyof typeof dashboardTokens.shadow;
  border: keyof typeof dashboardTokens.border;
  titleWeight: keyof typeof dashboardTokens.typography;
  background: keyof typeof dashboardTokens.color;
};

export const panelPriorityStyleMap: Record<PanelPriority, PriorityStyle> = {
  primary: { elevation: "high", border: "strong", titleWeight: "bold", background: "surface" },
  secondary: { elevation: "medium", border: "default", titleWeight: "semibold", background: "surface" },
  telemetry: { elevation: "low", border: "soft", titleWeight: "semibold", background: "surfaceTelemetry" },
  critical: { elevation: "high", border: "critical", titleWeight: "bold", background: "surfaceCritical" },
};
