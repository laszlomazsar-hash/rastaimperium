/**
 * Structural discovery metadata for secondary navigation / atlas.
 * Existing page routes remain the source of truth for content.
 * Do not duplicate substantive copy here.
 */

export type DiscoveryLevel = "primary" | "secondary" | "archive";

export type DiscoveryEntry = {
  href: string;
  title: string;
  description: string;
  level: DiscoveryLevel;
};

export type DiscoveryGroup = {
  id: string;
  label: string;
  summary: string;
  entries: DiscoveryEntry[];
};

/** Public atlas groups — only existing routes. */
export const DISCOVERY_GROUPS: DiscoveryGroup[] = [
  {
    id: "civilization",
    label: "Civilization",
    summary: "Identity, narrative, and acknowledgement of the work.",
    entries: [
      {
        href: "/about/",
        title: "About",
        description: "What Rasta Imperium is and is not.",
        level: "secondary",
      },
      {
        href: "/empire/",
        title: "Empire",
        description: "Civilization framing and sovereign posture.",
        level: "archive",
      },
      {
        href: "/vision/",
        title: "Vision",
        description: "Long-form direction of the project.",
        level: "archive",
      },
      {
        href: "/pillars/",
        title: "Pillars",
        description: "Structural pillars of the stack and doctrine.",
        level: "archive",
      },
      {
        href: "/thanks-and-praise/",
        title: "Thanks & Praise",
        description: "Dedication and acknowledgement field.",
        level: "secondary",
      },
    ],
  },
  {
    id: "system",
    label: "System",
    summary: "Architecture, layers, and governance model.",
    entries: [
      {
        href: "/blueprint/",
        title: "Blueprint",
        description: "Primary system map (EVO-V stack).",
        level: "primary",
      },
      {
        href: "/architecture/",
        title: "Architecture",
        description: "Structural documentation of the stack.",
        level: "secondary",
      },
      {
        href: "/systems/",
        title: "Systems",
        description: "System surfaces and related modules.",
        level: "archive",
      },
      {
        href: "/systems/evo-g/",
        title: "EVO-G",
        description: "Operational assurance framing.",
        level: "archive",
      },
      {
        href: "/technology/",
        title: "Technology",
        description: "Technology overview and related paths.",
        level: "archive",
      },
      {
        href: "/technology/evo-v/",
        title: "Technology · EVO-V",
        description: "EVO-V technology surface.",
        level: "archive",
      },
      {
        href: "/technology/verification/",
        title: "Technology · Verification",
        description: "Verification technology notes.",
        level: "archive",
      },
      {
        href: "/governance/",
        title: "Governance",
        description: "Governance surfaces and doctrine links.",
        level: "secondary",
      },
      {
        href: "/governance-model/",
        title: "Governance model",
        description: "Model description for institutional readers.",
        level: "archive",
      },
      {
        href: "/why-deterministic-governance/",
        title: "Why deterministic governance",
        description: "Rationale for deterministic controls.",
        level: "secondary",
      },
      {
        href: "/about-evo-v-kernel/",
        title: "About EVO-V kernel",
        description: "Kernel orientation (presentation layer).",
        level: "archive",
      },
    ],
  },
  {
    id: "applications",
    label: "Applications",
    summary: "What the stack is intended to enable in the field.",
    entries: [
      {
        href: "/applications/",
        title: "Applications",
        description: "Genesis artifacts, demos, and product surfaces.",
        level: "secondary",
      },
      {
        href: "/case-studies/",
        title: "Case studies",
        description: "Evidence-oriented case material.",
        level: "secondary",
      },
      {
        href: "/product/",
        title: "Product",
        description: "Capabilities and commercial pathway.",
        level: "archive",
      },
      {
        href: "/enterprise/",
        title: "Enterprise",
        description: "Enterprise-oriented entry points.",
        level: "archive",
      },
      {
        href: "/lab/",
        title: "Lab",
        description: "Experimental and lab surfaces.",
        level: "archive",
      },
      {
        href: "/intelligence/",
        title: "Intelligence",
        description: "Intelligence-related public material.",
        level: "archive",
      },
      {
        href: "/observatory/",
        title: "Observatory",
        description: "Demonstration observatory surface.",
        level: "archive",
      },
    ],
  },
  {
    id: "knowledge",
    label: "Knowledge",
    summary: "Library, research, and adjacent public records.",
    entries: [
      {
        href: "/library/",
        title: "Library",
        description: "Publications and digital artifacts.",
        level: "secondary",
      },
      {
        href: "/research/",
        title: "Research",
        description: "Publications and proof entry points.",
        level: "secondary",
      },
      {
        href: "/challenge/",
        title: "Challenge",
        description: "Challenge lab and related exercises.",
        level: "archive",
      },
      {
        href: "/witness/",
        title: "Witness",
        description: "Witness surface.",
        level: "archive",
      },
      {
        href: "/trust/",
        title: "Trust",
        description: "Trust-oriented public material.",
        level: "archive",
      },
      {
        href: "/evidence/",
        title: "Evidence (legacy path)",
        description: "Legacy evidence path — prefer Proof Registry.",
        level: "archive",
      },
    ],
  },
  {
    id: "evidence",
    label: "Evidence & verification",
    summary: "What can be inspected and reproduced today.",
    entries: [
      {
        href: "/proof/",
        title: "Proof Registry",
        description: "Public Evidence Observatory.",
        level: "primary",
      },
      {
        href: "/verify/",
        title: "Verify",
        description: "Run verification against sealed artifacts.",
        level: "primary",
      },
      {
        href: "/audit/",
        title: "Audit",
        description: "Independent reproduction path.",
        level: "primary",
      },
      {
        href: "/limitations/",
        title: "Limitations",
        description: "What is not claimed or not yet evidenced.",
        level: "primary",
      },
      {
        href: "/codex/",
        title: "Codex",
        description: "Constitutional articles.",
        level: "primary",
      },
    ],
  },
  {
    id: "institutional",
    label: "Institutional",
    summary: "Engagement paths for institutions and partners.",
    entries: [
      {
        href: "/institutional-pilots/",
        title: "Institutional pilots",
        description: "Design partner and pilot path.",
        level: "primary",
      },
      {
        href: "/consulting/",
        title: "Consulting",
        description: "Consulting surface.",
        level: "secondary",
      },
      {
        href: "/pricing/",
        title: "Pricing",
        description: "Pricing posture.",
        level: "archive",
      },
      {
        href: "/invest/",
        title: "Invest",
        description: "Investment-oriented material.",
        level: "archive",
      },
      {
        href: "/contact/",
        title: "Contact",
        description: "Contact channel.",
        level: "secondary",
      },
    ],
  },
];
