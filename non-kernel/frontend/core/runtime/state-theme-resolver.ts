export const SYSTEM_STATES = ["NORMAL", "DRIFT", "COMPROMISE", "RECOVERY", "LOCKDOWN"] as const;

export type SystemState = (typeof SYSTEM_STATES)[number];

export type MotionIntensity = "steady" | "elevated" | "urgent" | "stabilizing" | "halted";

export interface StateThemeTokens {
  color: string;
  glow: string;
  stroke: string;
  motionIntensity: MotionIntensity;
}

const STATE_THEME_MAP: Record<SystemState, StateThemeTokens> = {
  NORMAL: {
    color: "var(--state-normal-color, #22c55e)",
    glow: "0 0 18px rgba(34, 197, 94, 0.35)",
    stroke: "var(--state-normal-stroke, #16a34a)",
    motionIntensity: "steady",
  },
  DRIFT: {
    color: "var(--state-drift-color, #f59e0b)",
    glow: "0 0 20px rgba(245, 158, 11, 0.4)",
    stroke: "var(--state-drift-stroke, #d97706)",
    motionIntensity: "elevated",
  },
  COMPROMISE: {
    color: "var(--state-compromise-color, #f97316)",
    glow: "0 0 24px rgba(249, 115, 22, 0.45)",
    stroke: "var(--state-compromise-stroke, #ea580c)",
    motionIntensity: "urgent",
  },
  RECOVERY: {
    color: "var(--state-recovery-color, #38bdf8)",
    glow: "0 0 20px rgba(56, 189, 248, 0.4)",
    stroke: "var(--state-recovery-stroke, #0284c7)",
    motionIntensity: "stabilizing",
  },
  LOCKDOWN: {
    color: "var(--state-lockdown-color, #ef4444)",
    glow: "0 0 28px rgba(239, 68, 68, 0.5)",
    stroke: "var(--state-lockdown-stroke, #b91c1c)",
    motionIntensity: "halted",
  },
};

export const resolveStateTheme = (state: SystemState): StateThemeTokens => STATE_THEME_MAP[state];
