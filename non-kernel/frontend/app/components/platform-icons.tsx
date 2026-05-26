import type { ReactNode } from "react";
import { CapabilityIcon } from "../../components/constitutional/CapabilityIcon";
import type { Capability } from "../../core/runtime/capability-registry";

/** @deprecated Use CapabilityIcon from components/constitutional/CapabilityIcon directly. */
export const PLATFORM_ICON_MAP = {
  cosmology: "capability:cosmology",
  lineage: "capability:lineage",
  machineSpirit: "capability:machineSpirit",
  selfRepresentation: "capability:selfRepresentation",
  selfModification: "capability:selfModification",
  selfPreservation: "capability:selfPreservation",
} as const;
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
export function PlatformIcon({ iconKey, className }: PlatformIconProps): ReactNode {
  return <CapabilityIcon capability={iconKey as Capability} className={className} />;
export function PlatformIcon({ iconKey, className, size = "inline", fallbackMode = "never" }: PlatformIconProps): ReactNode {
  const entry = ICON_REGISTRY[PLATFORM_ICON_MAP[iconKey]];
  return (
    <span className={className} aria-label={entry.a11yLabel} role="img">
      {renderCapabilityIcon(iconKey, size, fallbackMode)}
    </span>
  );
}
