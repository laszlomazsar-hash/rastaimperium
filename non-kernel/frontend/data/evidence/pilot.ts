/**
 * Institutional pilot readiness — Phase 22 Step 10.
 * Bounded evaluation model. Not certification. Not production approval.
 */

import type { EvidenceStatus } from "@/components/design-system/StatusBadge";

export type PilotEvidenceCellStatus =
  | EvidenceStatus
  | "NOT_ASSESSED"
  | "NOT_ESTABLISHED";

export interface PilotReadinessRow {
  id: string;
  area: string;
  currentEvidence: string;
  status: PilotEvidenceCellStatus;
  nextEvidence: string;
  href?: string;
}

/** Matrix grounded in public L7 evidence + explicit gaps. */
export const PILOT_READINESS_MATRIX: PilotReadinessRow[] = [
  {
    id: "replay",
    area: "Replay determinism",
    currentEvidence: "ART-L7-REPLAY-001 · INV-001",
    status: "VERIFIED",
    nextEvidence: "Institution-specific evaluation of the same invariant under scoped inputs",
    href: "/proof/#receipt-ART-L7-REPLAY-001",
  },
  {
    id: "illegal",
    area: "Illegal transition rejection",
    currentEvidence: "ART-L7-REJECT-001 · INV-002 · CHAL-ILLEGAL-TRANSITION-001",
    status: "VERIFIED",
    nextEvidence: "Expanded challenge set under the written pilot boundary",
    href: "/challenge/",
  },
  {
    id: "parity",
    area: "Cross-implementation parity",
    currentEvidence: "ART-L7-PARITY-001",
    status: "VERIFIED",
    nextEvidence: "Scope-specific validation with institutional tooling constraints",
    href: "/proof/#receipt-ART-L7-PARITY-001",
  },
  {
    id: "monitoring",
    area: "Production monitoring",
    currentEvidence: "None on the public surface",
    status: "UNAVAILABLE",
    nextEvidence: "Pilot-specific instrumentation under institutional controls",
  },
  {
    id: "telemetry",
    area: "LIVE telemetry",
    currentEvidence: "None on the public surface",
    status: "UNAVAILABLE",
    nextEvidence: "Explicitly scoped pilot telemetry (if required by the boundary)",
  },
  {
    id: "org-gov",
    area: "Organizational AI management",
    currentEvidence: "Not established by public capsules",
    status: "NOT_ESTABLISHED",
    nextEvidence: "Institutional governance assessment (e.g. AIMS-style), outside this site",
    href: "/governance-crosswalk/",
  },
  {
    id: "regulatory",
    area: "Regulatory conformity",
    currentEvidence: "Not assessed on the public surface",
    status: "NOT_ASSESSED",
    nextEvidence: "Appropriate legal / compliance assessment by the institution",
    href: "/governance-crosswalk/",
  },
];

export const PILOT_INCLUDED = [
  "Written evaluation boundary and system under evaluation",
  "Mapping of institutional concerns to public evidence (L7 capsules)",
  "Challenge and offline reproduction of supplied sealed artifacts",
  "Evidence preservation procedure for the evaluator",
  "Documented limitations and open questions",
  "Institutional decision ownership remains with the evaluator",
] as const;

export const PILOT_EXCLUDED = [
  "Production-wide behaviour or LIVE operational authority",
  "Full-kernel parity beyond pure-verifier capsule scope",
  "Certification, conformity, or legal opinion",
  "Unbounded agent coverage outside the written pilot boundary",
  "Performance thresholds not established by public evidence",
] as const;

export const PILOT_EVIDENCE_REQUIRED = [
  "Sealed public artifacts: ART-L7-REPLAY-001, ART-L7-REJECT-001, ART-L7-PARITY-001",
  "Independent offline pure-verifier reproduction records",
  "Challenge inspection where applicable (e.g. CHAL-ILLEGAL-TRANSITION-001)",
  "Explicit list of unresolved gaps (monitoring, telemetry, org governance, legal)",
  "Written success conditions limited to measurable capsule-scoped outcomes",
] as const;

export const PILOT_SUCCESS_CONDITIONS = [
  "Evaluator can obtain and preserve each sealed capsule",
  "Evaluator can run the supplied pure verifier offline and record exit code / digests",
  "Illegal-transition challenge path remains inspectable",
  "Cross-implementation parity report remains inspectable",
  "Evidence boundaries and production authority remain explicitly stated",
  "Unresolved gaps are documented before any scale-up discussion",
] as const;

export const PILOT_DECISION_OPTIONS = [
  {
    id: "continue",
    label: "Continue evaluation",
    body: "More public evidence inspection is required before a pilot.",
    href: "/evaluate/",
  },
  {
    id: "pilot",
    label: "Define bounded pilot",
    body: "Current evidence justifies a scoped evaluation activity under institutional controls.",
    href: "/contact/?intent=design-partner",
  },
  {
    id: "stop",
    label: "Stop",
    body: "Evidence does not currently justify further evaluation.",
    href: "/limitations/",
  },
  {
    id: "clarify",
    label: "Request clarification",
    body: "Discuss evidence scope, challenge definition, or pilot boundary.",
    href: "/contact/?intent=institutional",
  },
] as const;

/** Template fields for an evaluator-owned pilot brief (not submitted by default). */
export const PILOT_TEMPLATE_FIELDS = [
  "Institution",
  "System under evaluation",
  "Evaluation boundary",
  "Autonomous behaviours in scope",
  "Governance boundary",
  "Evidence required",
  "Challenges required",
  "Verification method",
  "Reproduction method",
  "Preservation method",
  "Known limitations",
  "Open questions",
  "Institutional decision owner",
  "Pilot outcome (evaluator-controlled)",
] as const;

export const ASSURANCE_JOURNEY = [
  { label: "Observe", href: "/" },
  { label: "Inspect", href: "/proof/" },
  { label: "Challenge", href: "/challenge/" },
  { label: "Verify", href: "/verify/" },
  { label: "Reproduce", href: "/evidence/export/" },
  { label: "Assess", href: "/limitations/" },
  { label: "Crosswalk", href: "/governance-crosswalk/" },
  { label: "Define Pilot", href: "/institutional-pilots/" },
  { label: "Contact", href: "/contact/?intent=design-partner" },
  { label: "Decide", href: "/evaluate/" },
] as const;

export function listPilotReadinessRows(): PilotReadinessRow[] {
  return PILOT_READINESS_MATRIX;
}
