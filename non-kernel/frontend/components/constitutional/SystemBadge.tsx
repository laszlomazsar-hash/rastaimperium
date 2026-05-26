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
    </span>
  );
}
