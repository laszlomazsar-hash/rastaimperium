import { SYSTEM_STATE_VISUAL_MAP, type SystemState } from "./semantics";

export type TelemetrySnapshot = {
  coherence: string;
  drift: string;
  agents: number;
  block: number;
  hash: string;
  systemState: SystemState;
};

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextSeed(seed: number): number {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}

export function generateTelemetrySnapshot(tick: number, seedSource: string): TelemetrySnapshot {
  let seed = hashSeed(`${seedSource}:${tick}`);
  seed = nextSeed(seed);
  const coherence = (0.93 + (seed % 4000) / 100000).toFixed(3);
  seed = nextSeed(seed);
  const drift = (0.001 + (seed % 3000) / 1_000_000).toFixed(4);
  seed = nextSeed(seed);
  const agents = 2048 + (seed % 20);
  const block = 847291 + tick;
  seed = nextSeed(seed);
  const a = (seed & 0xffff).toString(16).padStart(4, "0");
  seed = nextSeed(seed);
  const b = (seed & 0xffff).toString(16).padStart(4, "0");
  const systemStates: SystemState[] = ["NORMAL", "DRIFT", "COMPROMISE", "RECOVERY"];
  const systemState = systemStates[tick % systemStates.length];

  return { coherence, drift, agents, block, hash: `${a}...${b}`, systemState };
}

export function telemetryStatusLabel(state: SystemState): string {
  return SYSTEM_STATE_VISUAL_MAP[state].invariantsLabel;
}
