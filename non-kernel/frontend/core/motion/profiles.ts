export type SystemState = "INGESTED" | "NORMALIZED" | "VERIFIED" | "CORRELATED" | "ARCHIVED" | "CONTESTED";
export type CapabilityMetadata = { id: string; phase: "stability" | "drift" | "recovery" | "audit" };
export type MotionProfile = {
  name: "stableConsensusMotion" | "driftOscillationMotion" | "recoveryPropagationMotion" | "auditSweepMotion";
  coherenceBase: number;
  coherenceAmplitude: number;
  driftBase: number;
  driftAmplitude: number;
  agentWave: number;
};
export const stableConsensusMotion: MotionProfile = { name: "stableConsensusMotion", coherenceBase: 0.962, coherenceAmplitude: 0.006, driftBase: 0.0011, driftAmplitude: 0.0003, agentWave: 4 };
export const driftOscillationMotion: MotionProfile = { name: "driftOscillationMotion", coherenceBase: 0.941, coherenceAmplitude: 0.011, driftBase: 0.0024, driftAmplitude: 0.0008, agentWave: 11 };
export const recoveryPropagationMotion: MotionProfile = { name: "recoveryPropagationMotion", coherenceBase: 0.953, coherenceAmplitude: 0.009, driftBase: 0.0016, driftAmplitude: 0.0005, agentWave: 7 };
export const auditSweepMotion: MotionProfile = { name: "auditSweepMotion", coherenceBase: 0.958, coherenceAmplitude: 0.004, driftBase: 0.0012, driftAmplitude: 0.0002, agentWave: 5 };
export function selectMotionProfile(systemState: SystemState, capability: CapabilityMetadata): MotionProfile {
  if (systemState === "CONTESTED" || capability.phase === "drift") return driftOscillationMotion;
  if (capability.phase === "recovery") return recoveryPropagationMotion;
  if (capability.phase === "audit" || systemState === "ARCHIVED") return auditSweepMotion;
  return stableConsensusMotion;
}
