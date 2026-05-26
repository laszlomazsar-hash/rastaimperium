import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Cpu,
  Database,
  Globe,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const ICON_MAP = {
  governance: Scale,
  archive: Archive,
  compute: Cpu,
  network: Network,
  constitutional: Landmark,
  infrastructure: Globe,
  storage: Database,
  prediction: ShieldCheck,
} satisfies Record<string, LucideIcon>;

export type IconType = keyof typeof ICON_MAP;

export const ICON_STYLES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
} as const;
