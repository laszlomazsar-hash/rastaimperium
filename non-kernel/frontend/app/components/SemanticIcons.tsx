import type { CSSProperties } from "react";
import { ICON_REGISTRY, iconWrapperStyle, renderCapabilityIcon, type CapabilityIconKey, type IconSizeToken } from "./icons/registry";

type SemanticIconName = Extract<CapabilityIconKey, "dashboard" | "admin" | "enterprise">;

type SemanticIconProps = {
  capabilityKey: SemanticIconName;
  size?: IconSizeToken;
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
