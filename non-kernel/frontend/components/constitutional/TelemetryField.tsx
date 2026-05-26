import { ReactNode } from "react";
import { resolveStateTheme, SystemState } from "../../core/runtime/state-theme-resolver";

interface TelemetryFieldProps {
  state: SystemState;
  label: string;
  value: ReactNode;
}

export function TelemetryField({ state, label, value }: TelemetryFieldProps) {
  const tokens = resolveStateTheme(state);

  return (
    <div className="flex items-center justify-between border-b py-2" style={{ borderColor: tokens.stroke }}>
      <span className="text-xs uppercase tracking-wide" style={{ color: tokens.color }}>
        {label}
      </span>
      <span data-motion-intensity={tokens.motionIntensity}>{value}</span>
    </div>
  );
}
