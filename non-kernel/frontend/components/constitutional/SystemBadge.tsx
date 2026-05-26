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
