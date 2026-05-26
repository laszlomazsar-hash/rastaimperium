import { resolveStateTheme, SystemState } from "../../core/runtime/state-theme-resolver";

interface SystemBadgeProps {
  state: SystemState;
}

export function SystemBadge({ state }: SystemBadgeProps) {
  const tokens = resolveStateTheme(state);

  return (
    <span
      data-system-state={state}
      data-motion-intensity={tokens.motionIntensity}
      className="inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium"
      style={{
        color: tokens.color,
        borderColor: tokens.stroke,
        boxShadow: tokens.glow,
      }}
    >
      {state}
import { SystemState } from "./ConstitutionalPanel";

export function SystemBadge({ state, label }: { state: SystemState; label?: string }) {
  const tone =
    state === "stable"
      ? { color: "#166534", borderColor: "#86efac", background: "#f0fdf4" }
      : state === "watch"
        ? { color: "#92400e", borderColor: "#fcd34d", background: "#fffbeb" }
        : { color: "#991b1b", borderColor: "#fca5a5", background: "#fef2f2" };

  return (
    <span style={{ ...tone, border: "1px solid", borderRadius: "999px", fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>
      {label ?? state}
    </span>
  );
}
