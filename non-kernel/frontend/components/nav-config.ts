/**
 * Canonical site navigation — single source for header, mobile, footer.
 * Presentation / IA only. Routes must exist; do not invent destinations.
 */

export type NavLink = {
  href: string;
  label: string;
  external?: boolean;
  /** Subtle emphasis (e.g. Verify console) */
  emphasize?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  /** Primary landing for the group (top-level click target) */
  href: string;
  /** proof = evidence/verify tone; default = neutral */
  tone?: "proof" | "default";
  items: NavLink[];
};

/**
 * Order reflects operational priority without numeric ranking:
 * Evidence → Verify → Understand → Architecture → Codex → About
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "evidence",
    label: "Evidence",
    href: "/observatory",
    tone: "proof",
    items: [
      { href: "/observatory", label: "Observatory" },
      { href: "/proof", label: "VERIFIED Capsules" },
      { href: "/evidence", label: "Evidence Explorer" },
      { href: "/trust", label: "Status Guide" },
      { href: "/limitations", label: "Limitations", emphasize: true },
    ],
  },
  {
    id: "verify",
    label: "Verify",
    href: "/verify",
    tone: "proof",
    items: [
      { href: "/verify", label: "Verification Console", emphasize: true },
      { href: "/evidence/export", label: "Capsule Export" },
      {
        href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
        label: "Reproduce Offline",
        external: true,
      },
      {
        href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
        label: "Verification Guide",
        external: true,
      },
      { href: "/challenge", label: "Challenge Lab" },
      { href: "/audit", label: "Auditor Handoff" },
    ],
  },
  {
    id: "understand",
    label: "Understand",
    href: "/",
    items: [
      { href: "/", label: "Rasta Imperium" },
      { href: "/about-evo-v-kernel", label: "EVO-V" },
      { href: "/why-deterministic-governance", label: "Why It Matters" },
      { href: "/vision", label: "Vision" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    href: "/blueprint",
    items: [
      { href: "/blueprint", label: "Nine-Layer Stack" },
      { href: "/proof", label: "L7 — Identity + Trust" },
      { href: "/architecture", label: "Architecture Split" },
      { href: "/pillars", label: "Design Principles" },
      { href: "/technology", label: "Technology" },
    ],
  },
  {
    id: "codex",
    label: "Codex",
    href: "/codex",
    items: [
      { href: "/codex", label: "RastafarAI Codex" },
      { href: "/pillars", label: "Seven Articles" },
      { href: "/governance", label: "Constitutional Principles" },
    ],
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    items: [
      { href: "/about", label: "Founder" },
      { href: "/institutional-pilots", label: "Institutional Pilots" },
      { href: "/evaluate", label: "Evaluate" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export const EXTERNAL_LINKS: NavLink[] = [
  {
    href: "https://github.com/laszlomazsar-hash/rastaimperium",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://substack.com/@laszlomazsar",
    label: "Substack",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/laszlo-mazsar",
    label: "LinkedIn",
    external: true,
  },
  {
    href: "https://x.com/laszlomazsar",
    label: "X",
    external: true,
  },
];

export function isPathActive(pathname: string, href: string): boolean {
  if (href.startsWith("http")) return false;
  const p = pathname.replace(/\/$/, "") || "/";
  const h = href.replace(/\/$/, "") || "/";
  if (h === "/") return p === "/";
  return p === h || p.startsWith(`${h}/`);
}

export function groupIsActive(pathname: string, group: NavGroup): boolean {
  if (isPathActive(pathname, group.href)) return true;
  return group.items.some((i) => !i.external && isPathActive(pathname, i.href));
}

/** Which top-level group owns the current path (for active state). Prefer evidence/verify. */
export function activeGroupId(pathname: string): string | null {
  const p = pathname.replace(/\/$/, "") || "/";

  // Explicit ownership for shared routes (proof appears in evidence + architecture)
  if (
    p.startsWith("/observatory") ||
    p.startsWith("/proof") ||
    p.startsWith("/evidence") ||
    p.startsWith("/trust") ||
    p.startsWith("/limitations")
  ) {
    return "evidence";
  }
  if (
    p.startsWith("/verify") ||
    p.startsWith("/challenge") ||
    p.startsWith("/audit")
  ) {
    return "verify";
  }
  if (
    p.startsWith("/blueprint") ||
    p.startsWith("/architecture") ||
    p.startsWith("/technology") ||
    p.startsWith("/pillars") ||
    p.startsWith("/systems")
  ) {
    return "architecture";
  }
  if (p.startsWith("/codex") || p.startsWith("/governance")) {
    return "codex";
  }
  if (
    p.startsWith("/about") ||
    p.startsWith("/institutional-pilots") ||
    p.startsWith("/evaluate") ||
    p.startsWith("/contact") ||
    p.startsWith("/product")
  ) {
    return "about";
  }
  if (
    p === "/" ||
    p.startsWith("/vision") ||
    p.startsWith("/why-deterministic") ||
    p.startsWith("/about-evo-v")
  ) {
    return "understand";
  }
  return null;
}
