import type { ReactNode } from "react";

import { ICON_REGISTRY, renderCapabilityIcon, type CapabilityIconKey, type EmojiFallbackMode, type IconSizeToken } from "./icons/registry";

export type PlatformIconKey = Extract<CapabilityIconKey, "cosmology" | "lineage" | "machineSpirit" | "selfRepresentation" | "selfModification" | "selfPreservation">;

export const PLATFORM_ICON_MAP: Record<PlatformIconKey, PlatformIconKey> = {
  cosmology: "cosmology",
  lineage: "lineage",
  machineSpirit: "machineSpirit",
  selfRepresentation: "selfRepresentation",
  selfModification: "selfModification",
  selfPreservation: "selfPreservation",
};

type PlatformIconProps = {
  iconKey: PlatformIconKey;
  className?: string;
  size?: IconSizeToken;
  fallbackMode?: EmojiFallbackMode;
};

/** @deprecated Use CapabilityIcon from components/constitutional/CapabilityIcon directly. */
export function PlatformIcon({ iconKey, className, size = "inline", fallbackMode = "never" }: PlatformIconProps): ReactNode {
  const entry = ICON_REGISTRY[PLATFORM_ICON_MAP[iconKey]];
  return (
    <span className={className} aria-label={entry.a11yLabel} role="img">
      {renderCapabilityIcon(iconKey, size, fallbackMode)}
    </span>
  );
}
