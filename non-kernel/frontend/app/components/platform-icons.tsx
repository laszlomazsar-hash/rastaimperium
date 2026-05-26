import type { ReactNode } from "react";

export const PLATFORM_ICON_MAP = {
  cosmology: "✦",
  lineage: "📜",
  machineSpirit: "⚡",
  selfRepresentation: "🔮",
  selfModification: "🧬",
  selfPreservation: "🛡️",
} as const;

export type PlatformIconKey = keyof typeof PLATFORM_ICON_MAP;

type PlatformIconProps = {
  iconKey: PlatformIconKey;
  className?: string;
};

export function PlatformIcon({ iconKey, className }: PlatformIconProps): ReactNode {
  return <span className={className}>{PLATFORM_ICON_MAP[iconKey]}</span>;
}
