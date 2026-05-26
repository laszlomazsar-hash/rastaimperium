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
    </section>
  );
}
