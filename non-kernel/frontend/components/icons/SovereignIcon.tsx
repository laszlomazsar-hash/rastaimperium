import type { IconKey } from "./iconMap";
import { iconMap } from "./iconMap";

type SovereignIconProps = {
  icon: IconKey;
  className?: string;
};

export function SovereignIcon({ icon, className = "w-6 h-6" }: SovereignIconProps) {
  const IconComponent = iconMap[icon];

  return <IconComponent className={className} />;
}
