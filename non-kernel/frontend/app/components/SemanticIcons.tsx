import type { CSSProperties, ReactElement, SVGProps } from "react";

type IconSizeToken = "heading" | "card" | "inline";
type SemanticIconName = "dashboard" | "admin" | "enterprise";

type SemanticIconProps = {
  name: SemanticIconName;
  size?: IconSizeToken;
  decorative?: boolean;
  label?: string;
  style?: CSSProperties;
};

const ICON_SIZE_MAP: Record<IconSizeToken, string> = {
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

function DashboardIcon({ size }: { size: IconSizeToken }) {
  return (
    <svg {...baseSvgProps(size)}>
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="5" rx="1" />
      <rect x="13" y="10" width="8" height="11" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
    </svg>
  );
}

function AdminIcon({ size }: { size: IconSizeToken }) {
  return (
    <svg {...baseSvgProps(size)}>
      <path d="M12 3L4 7v5c0 5 3.3 8.3 8 9 4.7-.7 8-4 8-9V7l-8-4z" />
      <path d="M9.5 12.5l1.5 1.5 3.5-3.5" />
    </svg>
  );
}

function EnterpriseIcon({ size }: { size: IconSizeToken }) {
  return (
    <svg {...baseSvgProps(size)}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </svg>
  );
}

const ICON_BY_NAME: Record<SemanticIconName, (props: { size: IconSizeToken }) => ReactElement> = {
  dashboard: DashboardIcon,
  admin: AdminIcon,
  enterprise: EnterpriseIcon,
};

export function SemanticIcon({ name, size = "inline", decorative = true, label, style }: SemanticIconProps) {
  const Icon = ICON_BY_NAME[name];
  const ariaLabel = decorative ? undefined : label;

  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", color: "inherit", lineHeight: 0, ...style }}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={ariaLabel}
    >
      <Icon size={size} />
    </span>
  );
}

export { ICON_SIZE_MAP };
