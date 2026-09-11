/**
 * Evaluator Console — workflow stages only.
 * Phase 22 Step 7.
 *
 * No assurance scores, compliance percentages, or production claims.
 * Evidence is linked to existing public surfaces and L7 receipts only.
 */

export type EvaluatorStageId =
  | "define"
  | "inspect"
  | "challenge"
  | "verify"
  | "assess"
  | "pilot"
  | "decide";

export interface EvaluatorStage {
  id: EvaluatorStageId;
  n: string;
  label: string;
  title: string;
  body: string;
  /** Primary public destination */
  href: string;
  linkLabel: string;
  /** Optional secondary links */
  secondary?: Array<{ href: string; label: string }>;
}

/** Ordered institutional evaluation path. Not a scoring algorithm. */
export const EVALUATOR_STAGES: EvaluatorStage[] = [
  {
    id: "define",
    n: "01",
    label: "DEFINE",
    title: "Define the boundary",
    body: "Identify the behaviour, authority boundary, or state transition under evaluation before interpreting evidence. Public capsules do not define your system boundary.",
    href: "/product/",
    linkLabel: "Product boundary →",
    secondary: [{ href: "/governance/", label: "Governance →" }],
  },
  {
    id: "inspect",
    n: "02",
    label: "INSPECT",
    title: "Inspect public evidence",
    body: "Review sealed L7 capsules and the Living Evidence Manifest. Status remains VERIFIED, DEMONSTRATION, or UNAVAILABLE — capsule-scoped where VERIFIED.",
    href: "/proof/",
    linkLabel: "Proof Registry →",
    secondary: [
      { href: "/proof/#receipt-ART-L7-REPLAY-001", label: "REPLAY-001 receipt →" },
      { href: "/proof/#receipt-ART-L7-REJECT-001", label: "REJECT-001 receipt →" },
      { href: "/proof/#receipt-ART-L7-PARITY-001", label: "PARITY-001 receipt →" },
    ],
  },
  {
    id: "challenge",
    n: "03",
    label: "CHALLENGE",
    title: "Challenge the boundary",
    body: "Inspect deterministic challenges such as CHAL-ILLEGAL-TRANSITION-001 (INV-002 → ART-L7-REJECT-001). Challenges do not execute production systems.",
    href: "/challenge/",
    linkLabel: "Challenge Lab →",
  },
  {
    id: "verify",
    n: "04",
    label: "VERIFY",
    title: "Verify independently",
    body: "Download sealed artifacts and run pure offline verifiers. The website is not the authority — recomputed hashes and exit codes are.",
    href: "/verify/",
    linkLabel: "Verify console →",
    secondary: [
      {
        href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
        label: "Reproduce offline docs →",
      },
    ],
  },
  {
    id: "assess",
    n: "05",
    label: "ASSESS",
    title: "Assess limitations",
    body: "Separate what sealed capsules establish from what remains unestablished: production-wide behaviour, full-kernel parity, LIVE telemetry, certification, and organizational compliance.",
    href: "/limitations/",
    linkLabel: "Limitations →",
  },
  {
    id: "pilot",
    n: "06",
    label: "PILOT",
    title: "Define a bounded pilot",
    body: "Where public evidence is insufficient for production-wide conclusions, a design-partner pilot can generate scoped evidence under institutional controls. No pilot outcomes are claimed here.",
    href: "/institutional-pilots/",
    linkLabel: "Institutional pilots →",
  },
  {
    id: "decide",
    n: "07",
    label: "DECIDE",
    title: "Decide the next step",
    body: "Institutional judgement remains with the evaluator. Continue inspection, request a pilot, escalate to internal review, or stop if evidence is insufficient.",
    href: "/contact/?intent=institutional",
    linkLabel: "Contact →",
    secondary: [
      { href: "/limitations/", label: "Stop / insufficient evidence →" },
      { href: "/proof/", label: "Continue inspection →" },
    ],
  },
];

/** Canonical public artifacts referenced by the console. */
export const EVALUATOR_ARTIFACTS = [
  {
    artifactId: "ART-L7-REPLAY-001",
    invariant: "INV-001",
    receiptHref: "/proof/#receipt-ART-L7-REPLAY-001",
    artifactHref: "/evidence/artifacts/ART-L7-REPLAY-001.json",
  },
  {
    artifactId: "ART-L7-REJECT-001",
    invariant: "INV-002",
    receiptHref: "/proof/#receipt-ART-L7-REJECT-001",
    artifactHref: "/evidence/artifacts/ART-L7-REJECT-001.json",
  },
  {
    artifactId: "ART-L7-PARITY-001",
    invariant: "cross_implementation_parity",
    receiptHref: "/proof/#receipt-ART-L7-PARITY-001",
    artifactHref: "/evidence/artifacts/ART-L7-PARITY-001.json",
  },
] as const;

/** Inspection checklist — interaction aid only. Never computes a score. */
export const EVALUATOR_CHECKLIST = [
  { id: "boundary", label: "Boundary defined" },
  { id: "evidence", label: "Relevant evidence identified" },
  { id: "artifact", label: "Artifact inspected" },
  { id: "invariant", label: "Invariant inspected" },
  { id: "verifier", label: "Verifier / reproduction path reviewed" },
  { id: "challenge", label: "Challenge inspected (where available)" },
  { id: "limitations", label: "Limitations understood" },
  { id: "authority", label: "Production authority checked (NOT ESTABLISHED on public surface)" },
  { id: "pilot", label: "Pilot requirement considered" },
  { id: "decision", label: "Institutional decision remains with the evaluator" },
] as const;

export function listEvaluatorStages(): EvaluatorStage[] {
  return EVALUATOR_STAGES;
}

export function getEvaluatorStage(id: EvaluatorStageId): EvaluatorStage | undefined {
  return EVALUATOR_STAGES.find((s) => s.id === id);
}
