import type { CSSProperties } from "react";
import { ICON_REGISTRY, iconWrapperStyle, renderCapabilityIcon, type CapabilityIconKey, type IconSizeToken } from "./icons/registry";

type SemanticIconName = Extract<CapabilityIconKey, "dashboard" | "admin" | "enterprise">;

type SemanticIconProps = {
  capabilityKey?: SemanticIconName;
  name?: SemanticIconName;
  size?: IconSizeToken;
  decorative?: boolean;
  label?: string;
  style?: CSSProperties;
};

/** @deprecated Prefer capabilityKey; name remains for migrated callers during the static export transition. */
export function SemanticIcon({ capabilityKey, name, size = "inline", decorative = true, label, style }: SemanticIconProps) {
  const resolvedCapability = capabilityKey ?? name ?? "dashboard";
  const ariaLabel = decorative ? undefined : label ?? ICON_REGISTRY[resolvedCapability].a11yLabel;

  return (
    <span
      style={iconWrapperStyle(style)}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={ariaLabel}
    >
      {renderCapabilityIcon(resolvedCapability, size)}
    </span>
  );
}

export type { IconSizeToken };
