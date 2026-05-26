import type { CSSProperties, ReactElement, SVGProps } from "react";

export type IconSizeToken = "heading" | "card" | "inline";
export type CapabilityIconKey =
  | "dashboard"
  | "admin"
  | "enterprise"
  | "cosmology"
  | "lineage"
  | "machineSpirit"
  | "selfRepresentation"
  | "selfModification"
  | "selfPreservation";

export type IconToneToken = "governance" | "intelligence" | "operations";

type RegistryEntry = {
  tone: IconToneToken;
  a11yLabel: string;
  svg: (props: { size: IconSizeToken }) => ReactElement;
  fallbackEmoji?: string;
};

export const ICON_SIZE_MAP: Record<IconSizeToken, string> = {
  heading: "1.5rem",
  card: "1.125rem",
  inline: "0.875rem",
};

function baseSvgProps(size: IconSizeToken): SVGProps<SVGSVGElement> {
  return {
    width: ICON_SIZE_MAP[size],
    height: ICON_SIZE_MAP[size],
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

const DashboardGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></svg>
);
const AdminGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M12 3L4 7v5c0 5 3.3 8.3 8 9 4.7-.7 8-4 8-9V7l-8-4z" /><path d="M9.5 12.5l1.5 1.5 3.5-3.5" /></svg>
);
const EnterpriseGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><rect x="4" y="10" width="16" height="10" rx="1" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><path d="M12 14v2" /></svg>
);
const CosmologyGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" /></svg>
);
const LineageGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M6 4h9l3 3v13H6z" /><path d="M15 4v3h3" /><path d="M9 12h6M9 16h6" /></svg>
);
const MachineSpiritGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M13 2L5 14h6l-1 8 8-12h-6z" /></svg>
);
const SelfRepresentationGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M12 5c-5 0-8 7-8 7s3 7 8 7 8-7 8-7-3-7-8-7z" /><circle cx="12" cy="12" r="2.5" /></svg>
);
const SelfModificationGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M8 4v16M16 4v16" /><path d="M8 7c2 0 2 2 4 2s2-2 4-2M8 17c2 0 2-2 4-2s2 2 4 2" /></svg>
);
const SelfPreservationGlyph = ({ size }: { size: IconSizeToken }) => (
  <svg {...baseSvgProps(size)}><path d="M12 3L4 7v5c0 5 3.3 8.3 8 9 4.7-.7 8-4 8-9V7l-8-4z" /><path d="M12 10v5" /></svg>
);

export const ICON_REGISTRY: Record<CapabilityIconKey, RegistryEntry> = {
  dashboard: { tone: "operations", a11yLabel: "Dashboard", svg: DashboardGlyph },
  admin: { tone: "governance", a11yLabel: "Admin", svg: AdminGlyph },
  enterprise: { tone: "operations", a11yLabel: "Enterprise", svg: EnterpriseGlyph },
  cosmology: { tone: "intelligence", a11yLabel: "Cosmology", svg: CosmologyGlyph, fallbackEmoji: "✦" },
  lineage: { tone: "governance", a11yLabel: "Lineage", svg: LineageGlyph, fallbackEmoji: "📜" },
  machineSpirit: { tone: "intelligence", a11yLabel: "Machine spirit", svg: MachineSpiritGlyph, fallbackEmoji: "⚡" },
  selfRepresentation: { tone: "intelligence", a11yLabel: "Self representation", svg: SelfRepresentationGlyph, fallbackEmoji: "🔮" },
  selfModification: { tone: "operations", a11yLabel: "Self modification", svg: SelfModificationGlyph, fallbackEmoji: "🧬" },
  selfPreservation: { tone: "governance", a11yLabel: "Self preservation", svg: SelfPreservationGlyph, fallbackEmoji: "🛡️" },
};

export type EmojiFallbackMode = "never" | "explicit";

export function renderCapabilityIcon(
  iconKey: CapabilityIconKey,
  size: IconSizeToken,
  fallbackMode: EmojiFallbackMode = "never",
): ReactElement {
  const entry = ICON_REGISTRY[iconKey];
  if (fallbackMode === "explicit" && entry.fallbackEmoji) {
    return <span aria-hidden="true" style={{ fontSize: ICON_SIZE_MAP[size] }}>{entry.fallbackEmoji}</span>;
  }
  const Glyph = entry.svg;
  return <Glyph size={size} />;
}

export function iconWrapperStyle(style?: CSSProperties): CSSProperties {
  return { display: "inline-flex", alignItems: "center", color: "inherit", lineHeight: 0, ...style };
}
