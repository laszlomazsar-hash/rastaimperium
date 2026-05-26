import type { Capability } from "./capabilities";

export interface TopologyNode {
  id: string;
  label: string;
  capability: Capability;
}

export type TopologyPlane = "kernel" | "interface";
