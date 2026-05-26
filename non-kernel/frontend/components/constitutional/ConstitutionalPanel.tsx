import { ReactNode } from "react";
import { resolveStateTheme, SystemState } from "../../core/runtime/state-theme-resolver";

interface ConstitutionalPanelProps {
  state: SystemState;
  title: string;
  children: ReactNode;
}

export function ConstitutionalPanel({ state, title, children }: ConstitutionalPanelProps) {
  const tokens = resolveStateTheme(state);
  return (
    <section
      data-system-state={state}
      style={{
        borderColor: tokens.stroke,
        boxShadow: tokens.glow,
      }}
      className="rounded-xl border bg-black/20 p-4"
    >
      <header className="mb-3" style={{ color: tokens.color }}>
        <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      </header>
      <div data-motion-intensity={tokens.motionIntensity}>{children}</div>

export type PanelPriority = "critical" | "high" | "standard";
export type SystemState = "stable" | "watch" | "degraded";

const PRIORITY_STYLES: Record<PanelPriority, { borderWidth: string; boxShadow: string }> = {
  critical: { borderWidth: "2px", boxShadow: "0 8px 24px rgba(127, 29, 29, 0.18)" },
  high: { borderWidth: "2px", boxShadow: "0 6px 18px rgba(30, 64, 175, 0.15)" },
  standard: { borderWidth: "1px", boxShadow: "0 2px 8px rgba(15,23,42,0.08)" },
};

const STATE_STYLES: Record<SystemState, { borderColor: string; background: string }> = {
  stable: { borderColor: "#86efac", background: "#f8fffb" },
  watch: { borderColor: "#fcd34d", background: "#fffbeb" },
  degraded: { borderColor: "#fca5a5", background: "#fef2f2" },
};

export function ConstitutionalPanel({
  priority,
  state,
  capability,
  children,
}: {
  priority: PanelPriority;
  state: SystemState;
  capability?: string;
  children: ReactNode;
}) {
  return (
    <section
      data-panel-priority={priority}
      data-system-state={state}
      data-capability={capability}
      style={{
        borderStyle: "solid",
        borderRadius: "0.75rem",
        padding: "1rem",
        ...PRIORITY_STYLES[priority],
        ...STATE_STYLES[state],
      }}
    >
      {children}
    </section>
  );
}
