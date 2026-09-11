/**
 * Governance Evidence Crosswalk — Phase 22 Step 8.
 *
 * Evidence alignment ≠ compliance.
 * Every mapping carries a rationale. Gaps are first-class.
 * Compliance assessment defaults to NOT_ASSESSED.
 */

import type { EvidenceStatus } from "@/components/design-system/StatusBadge";

/** Alignment of public technical evidence to a governance concern. */
export type AlignmentStatus =
  | "ALIGNED"
  | "PARTIALLY_RELEVANT"
  | "NOT_ESTABLISHED"
  | "NOT_APPLICABLE";

/** Never COMPLIANT / CERTIFIED / CONFORMANT. */
export type ComplianceAssessment = "NOT_ASSESSED";

export interface FrameworkRef {
  id: string;
  name: string;
  version: string;
  /** Concise identifier (section / function / concept) */
  referenceId: string;
  sourceUrl: string;
  /** ISO date of last human review of this static reference */
  reviewedAt: string;
  paraphrase: string;
}

export interface GovernanceMapping {
  id: string;
  concern: string;
  frameworkId: string;
  /** Why this public evidence (or gap) relates to the concern */
  rationale: string;
  alignment: AlignmentStatus;
  /** Canonical artifact when established */
  artifactId?: string;
  invariantId?: string;
  evidenceStatus?: EvidenceStatus;
  scope: string;
  productionAuthority: false;
  complianceAssessment: ComplianceAssessment;
  whatItInforms: string;
  whatItDoesNotEstablish: string;
  receiptHref?: string;
  artifactHref?: string;
  challengeHref?: string;
  verifyHref?: string;
}

export const FRAMEWORKS: FrameworkRef[] = [
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    version: "1.0 (NIST AI 100-1)",
    referenceId: "Map / Measure functions (traceability & measurement concepts)",
    sourceUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
    reviewedAt: "2026-09-11",
    paraphrase:
      "US voluntary framework for identifying, measuring, and managing AI risks across the AI lifecycle.",
  },
  {
    id: "nist-agent-standards",
    name: "NIST AI Agent Standards Initiative",
    version: "Initiative (announced 2026)",
    referenceId: "Trusted, interoperable, secure autonomous agents (initiative scope)",
    sourceUrl: "https://www.nist.gov/",
    reviewedAt: "2026-09-11",
    paraphrase:
      "Initiative focused on standards for trusted autonomous agents; not a conformity scheme for any single product.",
  },
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    version: "2023",
    referenceId: "AI management system (organizational)",
    sourceUrl: "https://www.iso.org/standard/81230.html",
    reviewedAt: "2026-09-11",
    paraphrase:
      "International standard for organizational AI management systems — not satisfied by individual technical artifacts.",
  },
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    version: "Regulation (EU) 2024/1689",
    referenceId: "Art. 12-related concepts (logging / traceability for high-risk systems)",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    reviewedAt: "2026-09-11",
    paraphrase:
      "EU regulation for AI systems. Technical logging concepts are distinct from legal conformity assessment.",
  },
  {
    id: "owasp-agentic",
    name: "OWASP Agentic AI security guidance",
    version: "Emerging 2025–2026 guidance",
    referenceId: "Agentic security / control boundaries (conceptual)",
    sourceUrl: "https://owasp.org/",
    reviewedAt: "2026-09-11",
    paraphrase:
      "Community security guidance for agentic systems; not a certification programme.",
  },
];

/**
 * Crosswalk rows. Evidence-first: start from what exists, then gaps.
 * Do not invent artifact→framework matches without rationale.
 */
export const GOVERNANCE_MAPPINGS: GovernanceMapping[] = [
  {
    id: "map-replay-determinism",
    concern: "Reproducible decision outcomes under identical inputs",
    frameworkId: "nist-ai-rmf",
    rationale:
      "INV-001 sealed replay demonstrates that, for a fixed capsule, identical ordered inputs yield identical terminal hashes — a concrete measurement of determinism relevant to Map/Measure-style risk documentation, not a full RMF programme.",
    alignment: "PARTIALLY_RELEVANT",
    artifactId: "ART-L7-REPLAY-001",
    invariantId: "INV-001",
    evidenceStatus: "VERIFIED",
    scope: "Capsule-scoped only",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms:
      "Independent parties can reproduce sealed replay hashes offline for this public capsule.",
    whatItDoesNotEstablish:
      "Production runtime determinism, full-kernel behaviour, organizational risk management, or NIST conformity.",
    receiptHref: "/proof/#receipt-ART-L7-REPLAY-001",
    artifactHref: "/evidence/artifacts/ART-L7-REPLAY-001.json",
    verifyHref: "/verify/",
  },
  {
    id: "map-illegal-transition",
    concern: "Rejection of illegal lifecycle / authority transitions",
    frameworkId: "nist-ai-rmf",
    rationale:
      "INV-002 via ART-L7-REJECT-001 shows a specific illegal edge is rejected without state mutation and with a sealed receipt — technical evidence of a constrained transition boundary, relevant to accountability documentation, not organizational governance certification.",
    alignment: "ALIGNED",
    artifactId: "ART-L7-REJECT-001",
    invariantId: "INV-002",
    evidenceStatus: "VERIFIED",
    scope: "Capsule-scoped only",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms:
      "Adversarial rejection of one illegal lifecycle edge is independently reproducible for this capsule.",
    whatItDoesNotEstablish:
      "All possible illegal edges, production enforcement, or risk-management process maturity.",
    receiptHref: "/proof/#receipt-ART-L7-REJECT-001",
    artifactHref: "/evidence/artifacts/ART-L7-REJECT-001.json",
    challengeHref: "/challenge/",
    verifyHref: "/verify/",
  },
  {
    id: "map-parity-independent-verify",
    concern: "Independent multi-implementation verification of sealed evidence",
    frameworkId: "nist-agent-standards",
    rationale:
      "ART-L7-PARITY-001 records agreement between separate Node and Python pure verifiers on sealed capsules — relevant to inspectability and independent checking of agent-related evidence packages, not an endorsement under any NIST agent standard product.",
    alignment: "PARTIALLY_RELEVANT",
    artifactId: "ART-L7-PARITY-001",
    invariantId: "cross_implementation_parity",
    evidenceStatus: "VERIFIED",
    scope: "Public pure-verifier parity only",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms:
      "Two independent pure-verifier implementations agree on sealed public capsule hashes.",
    whatItDoesNotEstablish:
      "Full-kernel parity, production agent interoperability, or NIST agent standard conformity.",
    receiptHref: "/proof/#receipt-ART-L7-PARITY-001",
    artifactHref: "/evidence/artifacts/ART-L7-PARITY-001.json",
    verifyHref: "/verify/",
  },
  {
    id: "map-eu-logging-concept",
    concern: "Automatic event logging / traceability for constrained transitions",
    frameworkId: "eu-ai-act",
    rationale:
      "Sealed rejection and replay capsules demonstrate that specific transition outcomes can be recorded and re-verified offline. This is a narrow technical analogy to logging/traceability concepts often discussed under Art. 12 themes — not evidence of high-risk system classification or legal logging obligations being met.",
    alignment: "PARTIALLY_RELEVANT",
    artifactId: "ART-L7-REJECT-001",
    invariantId: "INV-002",
    evidenceStatus: "VERIFIED",
    scope: "Capsule-scoped sealed receipts only",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms:
      "A constrained transition outcome can be sealed and independently re-checked for this public fixture.",
    whatItDoesNotEstablish:
      "EU AI Act applicability, high-risk system duties, production logging systems, or legal conformity.",
    receiptHref: "/proof/#receipt-ART-L7-REJECT-001",
    artifactHref: "/evidence/artifacts/ART-L7-REJECT-001.json",
    challengeHref: "/challenge/",
    verifyHref: "/verify/",
  },
  {
    id: "map-owasp-boundary",
    concern: "Enforcement of explicit control boundaries under adversarial input",
    frameworkId: "owasp-agentic",
    rationale:
      "Illegal-transition rejection (CHAL-ILLEGAL-TRANSITION-001 / ART-L7-REJECT-001) is public evidence that at least one disallowed edge is deterministically refused in the sealed fixture — relevant to control-boundary discussions in agentic security guidance, not an OWASP assessment result.",
    alignment: "PARTIALLY_RELEVANT",
    artifactId: "ART-L7-REJECT-001",
    invariantId: "INV-002",
    evidenceStatus: "VERIFIED",
    scope: "Capsule-scoped adversarial fixture",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms:
      "One illegal transition is rejected as designed with reproducible sealed evidence.",
    whatItDoesNotEstablish:
      "Coverage of OWASP control catalogues, runtime agent hardening, or security certification.",
    receiptHref: "/proof/#receipt-ART-L7-REJECT-001",
    challengeHref: "/challenge/",
    verifyHref: "/verify/",
  },
  {
    id: "gap-iso-aimss",
    concern: "Organizational AI management system (policies, roles, continual improvement)",
    frameworkId: "iso-42001",
    rationale:
      "ISO/IEC 42001 addresses organizational management systems. No public sealed capsule establishes an implemented AIMS for any institution. Technical invariants are not management-system evidence.",
    alignment: "NOT_ESTABLISHED",
    scope: "No public management-system evidence published",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms: "Nothing on the public surface establishes ISO/IEC 42001 implementation.",
    whatItDoesNotEstablish:
      "Any claim of ISO certification, conformity, or organizational AIMS maturity.",
  },
  {
    id: "gap-production-monitoring",
    concern: "Production monitoring and LIVE operational telemetry",
    frameworkId: "nist-ai-rmf",
    rationale:
      "Public evidence is limited to frozen historical capsules. LIVE production monitoring, continuous measurement, and operational risk registers are not published.",
    alignment: "NOT_ESTABLISHED",
    scope: "Public surface only",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms: "Absence of public LIVE telemetry is explicit.",
    whatItDoesNotEstablish:
      "Production health, continuous monitoring programmes, or operational risk control effectiveness.",
  },
  {
    id: "gap-eu-conformity",
    concern: "Legal conformity assessment under the EU AI Act",
    frameworkId: "eu-ai-act",
    rationale:
      "Conformity assessment is a legal and organizational process. Technical capsule evidence cannot substitute for classification, notified-body processes, or documented legal duties.",
    alignment: "NOT_ESTABLISHED",
    scope: "No legal assessment published",
    productionAuthority: false,
    complianceAssessment: "NOT_ASSESSED",
    whatItInforms: "Public technical evidence is not a legal opinion or conformity dossier.",
    whatItDoesNotEstablish:
      "EU AI Act compliance, readiness, or regulatory approval of any kind.",
  },
];

export function listFrameworks(): FrameworkRef[] {
  return FRAMEWORKS;
}

export function getFramework(id: string): FrameworkRef | undefined {
  return FRAMEWORKS.find((f) => f.id === id);
}

export function listGovernanceMappings(): GovernanceMapping[] {
  return GOVERNANCE_MAPPINGS;
}

export function mappingsWithEvidence(): GovernanceMapping[] {
  return GOVERNANCE_MAPPINGS.filter((m) => Boolean(m.artifactId));
}

export function mappingsGaps(): GovernanceMapping[] {
  return GOVERNANCE_MAPPINGS.filter((m) => m.alignment === "NOT_ESTABLISHED");
}
