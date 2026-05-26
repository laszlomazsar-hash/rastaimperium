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

export type PlatformIconKey = keyof typeof PLATFORM_ICON_MAP;

type PlatformIconProps = {
  iconKey: PlatformIconKey;
  className?: string;
};

/** @deprecated Use CapabilityIcon from components/constitutional/CapabilityIcon directly. */
export function PlatformIcon({ iconKey, className }: PlatformIconProps): ReactNode {
  return <CapabilityIcon capability={iconKey as Capability} className={className} />;
}
