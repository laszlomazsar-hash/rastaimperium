import { CapabilityIcon } from "../../components/constitutional/CapabilityIcon";

/** @deprecated Use CapabilityIcon and capability-registry metadata directly. */
export const ICON_SIZE_MAP = {
  heading: "w-8 h-8",
  card: "w-6 h-6",
  inline: "w-4 h-4",
} as const;

type IconSizeToken = keyof typeof ICON_SIZE_MAP;
type SemanticIconName = "dashboard" | "admin" | "enterprise";
import type { CSSProperties } from "react";
import { ICON_REGISTRY, iconWrapperStyle, renderCapabilityIcon, type CapabilityIconKey, type IconSizeToken } from "./icons/registry";

type SemanticIconName = Extract<CapabilityIconKey, "dashboard" | "admin" | "enterprise">;

type SemanticIconProps = {
  capabilityKey: SemanticIconName;
  size?: IconSizeToken;
};

/** @deprecated Use CapabilityIcon from components/constitutional/CapabilityIcon directly. */
export function SemanticIcon({ name, size = "inline" }: SemanticIconProps) {
  return <CapabilityIcon capability={name} className={ICON_SIZE_MAP[size]} />;
}
  decorative?: boolean;
  label?: string;
  style?: CSSProperties;
};

export function SemanticIcon({ capabilityKey, size = "inline", decorative = true, label, style }: SemanticIconProps) {
  const ariaLabel = decorative ? undefined : label ?? ICON_REGISTRY[capabilityKey].a11yLabel;

  return (
    <span
      style={iconWrapperStyle(style)}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={ariaLabel}
    >
      {renderCapabilityIcon(capabilityKey, size)}
    </span>
  );
}

export type { IconSizeToken };
