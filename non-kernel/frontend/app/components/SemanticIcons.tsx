import { CapabilityIcon } from "../../components/constitutional/CapabilityIcon";

/** @deprecated Use CapabilityIcon and capability-registry metadata directly. */
export const ICON_SIZE_MAP = {
  heading: "w-8 h-8",
  card: "w-6 h-6",
  inline: "w-4 h-4",
} as const;

type IconSizeToken = keyof typeof ICON_SIZE_MAP;
type SemanticIconName = "dashboard" | "admin" | "enterprise";

type SemanticIconProps = {
  name: SemanticIconName;
  size?: IconSizeToken;
};

/** @deprecated Use CapabilityIcon from components/constitutional/CapabilityIcon directly. */
export function SemanticIcon({ name, size = "inline" }: SemanticIconProps) {
  return <CapabilityIcon capability={name} className={ICON_SIZE_MAP[size]} />;
}
