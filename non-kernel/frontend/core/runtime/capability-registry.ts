import type { IconKey } from "../../components/icons/iconMap";

export type Capability =
  | "dashboard"
  | "admin"
  | "enterprise"
  | "cosmology"
  | "lineage"
  | "machineSpirit"
  | "selfRepresentation"
  | "selfModification"
  | "selfPreservation"
  | "infrastructure"
  | "research"
  | "publications"
  | "digitalProducts"
  | "books";

export type CapabilityDefinition = {
  icon: IconKey;
  priority: number;
  motion: "stable" | "pulse" | "flow";
  topology: "global" | "governance" | "enterprise" | "identity" | "knowledge";
  themeToken: string;
};

export const CAPABILITY_REGISTRY: Record<Capability, CapabilityDefinition> = {
  dashboard: { icon: "dashboard_global", priority: 100, motion: "flow", topology: "global", themeToken: "text-cyan-300" },
  admin: { icon: "compliance_scales", priority: 90, motion: "stable", topology: "governance", themeToken: "text-amber-300" },
  enterprise: { icon: "enterprise_building", priority: 80, motion: "stable", topology: "enterprise", themeToken: "text-indigo-300" },
  cosmology: { icon: "cosmology_starfield", priority: 70, motion: "pulse", topology: "knowledge", themeToken: "text-fuchsia-300" },
  lineage: { icon: "governance_scroll", priority: 65, motion: "stable", topology: "governance", themeToken: "text-gold" },
  machineSpirit: { icon: "machine_spirit", priority: 60, motion: "flow", topology: "identity", themeToken: "text-yellow-300" },
  selfRepresentation: { icon: "self_representation", priority: 55, motion: "stable", topology: "identity", themeToken: "text-emerald-300" },
  selfModification: { icon: "self_modification", priority: 50, motion: "pulse", topology: "identity", themeToken: "text-lime-300" },
  selfPreservation: { icon: "recovery_shield", priority: 45, motion: "stable", topology: "identity", themeToken: "text-green-300" },
  infrastructure: { icon: "infrastructure_build", priority: 40, motion: "stable", topology: "enterprise", themeToken: "text-orange-300" },
  research: { icon: "research_microscope", priority: 35, motion: "flow", topology: "knowledge", themeToken: "text-sky-300" },
  publications: { icon: "publications_books", priority: 30, motion: "stable", topology: "knowledge", themeToken: "text-violet-300" },
  digitalProducts: { icon: "book_open", priority: 25, motion: "stable", topology: "knowledge", themeToken: "text-rose-300" },
  books: { icon: "publications_books", priority: 20, motion: "stable", topology: "knowledge", themeToken: "text-amber-200" },
};
