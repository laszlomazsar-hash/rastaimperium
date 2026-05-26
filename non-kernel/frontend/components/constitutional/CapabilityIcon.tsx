import { SovereignIcon } from "../icons/SovereignIcon";
import { CAPABILITY_REGISTRY, type Capability } from "../../core/runtime/capability-registry";

type CapabilityIconProps = {
  capability: Capability;
  className?: string;
};

export function CapabilityIcon({ capability, className = "w-6 h-6" }: CapabilityIconProps) {
  const definition = CAPABILITY_REGISTRY[capability];
  return <SovereignIcon icon={definition.icon} className={className} />;
}
