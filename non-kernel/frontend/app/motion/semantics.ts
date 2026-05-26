export type MotionSemantic =
  | "stable_consensus"
  | "propagation"
  | "audit_pass"
  | "invariant_breach"
  | "recovery";

export type SystemState = "NORMAL" | "DRIFT" | "COMPROMISE" | "RECOVERY";

export type MotionProfile = {
  container: string;
  accent: string;
  badge: string;
};

export const MOTION_PROFILE_MAP: Record<MotionSemantic, MotionProfile> = {
  stable_consensus: {
    container: "transition-all duration-500 ease-linear",
    accent: "animate-none",
    badge: "bg-emerald-400",
  },
  propagation: {
    container: "transition-all duration-700 ease-out",
    accent: "animate-pulse",
    badge: "bg-amber-400",
  },
  audit_pass: {
    container: "transition-all duration-300 ease-in",
    accent: "animate-pulse",
    badge: "bg-sky-400",
  },
  invariant_breach: {
    container: "transition-all duration-200 ease-in",
    accent: "animate-bounce",
    badge: "bg-red-500",
  },
  recovery: {
    container: "transition-all duration-600 ease-in-out",
    accent: "animate-pulse",
    badge: "bg-violet-400",
  },
};

export const SYSTEM_STATE_VISUAL_MAP: Record<
  SystemState,
  { motion: MotionSemantic; color: string; invariantsLabel: string }
> = {
  NORMAL: { motion: "stable_consensus", color: "text-emerald-400", invariantsLabel: "HOLDING" },
  DRIFT: { motion: "propagation", color: "text-amber-300", invariantsLabel: "MONITORING" },
  COMPROMISE: { motion: "invariant_breach", color: "text-red-400", invariantsLabel: "BREACH" },
  RECOVERY: { motion: "recovery", color: "text-violet-300", invariantsLabel: "RECOVERING" },
};

export function semanticClass(semantic: MotionSemantic, slot: keyof MotionProfile): string {
  return MOTION_PROFILE_MAP[semantic][slot];
}
