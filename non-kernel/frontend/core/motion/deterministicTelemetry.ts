import { CapabilityMetadata, selectMotionProfile, SystemState } from "./profiles";

export type TelemetrySample = {
  coherence: string;
  drift: string;
  agents: number;
  hash: string;
};

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function seeded01(seed: number, tick: number, salt: string): number {
  const mixed = fnv1a32(`${seed}:${tick}:${salt}`);
  return mixed / 0xffffffff;
}

export function getTelemetrySample(seed: string, tick: number, systemState: SystemState, capability: CapabilityMetadata): TelemetrySample {
  const profile = selectMotionProfile(systemState, capability);
  const seedInt = fnv1a32(seed);
  const phase = tick / 5;
  const wave = Math.sin(phase);
  const jitterA = seeded01(seedInt, tick, "coherence") - 0.5;
  const jitterB = seeded01(seedInt, tick, "drift") - 0.5;
  const coherence = (profile.coherenceBase + profile.coherenceAmplitude * wave + jitterA * 0.002).toFixed(3);
  const drift = (profile.driftBase + profile.driftAmplitude * Math.cos(phase) + jitterB * 0.0002).toFixed(4);
  const agents = 2048 + Math.floor(profile.agentWave * Math.sin(phase / 2) + seeded01(seedInt, tick, "agents") * 3);
  const left = fnv1a32(`${seed}:left:${tick}`).toString(16).padStart(8, "0").slice(0, 4);
  const right = fnv1a32(`${seed}:right:${tick}`).toString(16).padStart(8, "0").slice(0, 4);
  return { coherence, drift, agents, hash: `${left}...${right}` };
}
