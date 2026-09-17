import type { ProvenanceKind, VerificationStatus } from "./types";

export type ArchitectureLayerId =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "L8"
  | "L9";

export interface ArchitectureLayer {
  layerId: ArchitectureLayerId;
  name: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  invariantIds: string[];
  invariantNotes: string[];
  evidenceIds: string[];
  proofIds: string[];
  challengeIds: string[];
  implementation: string;
  verificationHref: string;
  verificationLabel: string;
  challengeHref: string;
  verificationStatus: VerificationStatus;
  provenance: ProvenanceKind;
  notes?: string;
}

export const architectureLayers: ArchitectureLayer[] = [
  {
    layerId: "L9",
    name: "Cosmology Layer",
    purpose: "Mythic narrative and civilizational meaning — orientation, not runtime control.",
    inputs: ["Doctrine documents", "Published works", "Institutional narrative constraints"],
    outputs: ["Shared meaning frame", "Public positioning", "Engagement pathways"],
    invariantIds: [],
    invariantNotes: ["No machine-checkable invariant published on this public surface."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Documentation / doctrine (Blueprint PDFs, library)",
    verificationHref: "/evidence/",
    verificationLabel: "Browse evidence catalog",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L8",
    name: "Constitutional Layer",
    purpose: "Seven Articles — constitutional intent and governance doctrine, not established runtime enforcement.",
    inputs: ["Constitutional articles", "Capability boundaries", "Policy constraints"],
    outputs: ["Admissible action space", "Governance ruleset references"],
    invariantIds: [],
    invariantNotes: ["Constitutional articles referenced in doctrine; formal public proof set not attached."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Governance model documentation · constitution modules (repo)",
    verificationHref: "/governance-model/",
    verificationLabel: "Governance model",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L7",
    name: "Identity + Trust Layer",
    purpose: "Deterministic identity, sealed receipts, and replayable trust artifacts.",
    inputs: ["Sealed event streams", "Version bundles", "Independent pure verifiers"],
    outputs: ["Terminal state hashes", "Rejection receipts", "Parity results"],
    invariantIds: ["INV-001", "INV-002"],
    invariantNotes: [
      "INV-001 replay_parity — VERIFIED for ART-L7-REPLAY-001 only.",
      "INV-002 family illegal transition rejection — VERIFIED for ART-L7-REJECT-001 only.",
    ],
    evidenceIds: ["EVD-REPLAY-ART-001", "EVD-REJECT-ART-001", "EVD-PARITY-ART-001"],
    proofIds: ["PROOF-REPLAY-001", "PROOF-ILLEGAL-001", "PROOF-PARITY-001"],
    challengeIds: ["CHAL-ILLEGAL-TRANSITION-001", "CHAL-REPLAY-MISMATCH-001"],
    implementation: "Sealed public capsules + independent Node/Python pure verifiers",
    verificationHref: "/proof/#PROOF-REPLAY-001",
    verificationLabel: "Proof Registry",
    challengeHref: "/challenge/",
    verificationStatus: "VERIFIED",
    provenance: "HISTORICAL",
    notes: "Capsule-scoped VERIFIED only. Not production LIVE telemetry or full-kernel parity.",
  },
  {
    layerId: "L6",
    name: "Epistemic Governance Layer",
    purpose: "Bayesian calibration and drift detection for epistemic integrity.",
    inputs: ["Belief states", "Observation streams", "Calibration targets"],
    outputs: ["Drift signals", "Calibration status", "Admissibility hints"],
    invariantIds: [],
    invariantNotes: ["No sealed L6 public evidence capsule."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Implementation material only; not public L6 evidence",
    verificationHref: "/limitations/",
    verificationLabel: "Limitations",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L5",
    name: "Intelligence Layer",
    purpose: "Reasoning and decision-support intelligence under governance constraints.",
    inputs: ["Task context", "Governance constraints", "Model outputs"],
    outputs: ["Reasoning traces (target)", "Decision proposals"],
    invariantIds: [],
    invariantNotes: ["No sealed L5 public evidence capsule."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Not published as sealed public evidence",
    verificationHref: "/limitations/",
    verificationLabel: "Limitations",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L4",
    name: "Agentic Infrastructure Layer",
    purpose: "Deep Seed agent orchestration under governed operation.",
    inputs: ["Agent tasks", "Orchestration policies", "Sandbox boundaries"],
    outputs: ["Orchestration records (target)", "Bounded agent outcomes"],
    invariantIds: [],
    invariantNotes: ["No sealed multi-agent L4 public evidence capsule."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Not published as sealed public evidence",
    verificationHref: "/limitations/",
    verificationLabel: "Limitations",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L3",
    name: "Operational Systems Layer",
    purpose: "Real-time invariant enforcement on operational transitions.",
    inputs: ["Operational events", "Enforcement policies", "Invariant registry"],
    outputs: ["Allow / reject decisions", "Enforcement audit records (target)"],
    invariantIds: ["INV-L3-001"],
    invariantNotes: [
      "INV-L3-001 — VERIFIED for sealed ART-L3-DECISION-001 only.",
    ],
    evidenceIds: ["EVD-L3-DECISION-ART-001"],
    proofIds: ["PROOF-L3-DECISION-001"],
    challengeIds: ["CHAL-ILLEGAL-TRANSITION-001", "CHAL-REPLAY-MISMATCH-001"],
    implementation: "Sealed L3 decision capsule + independent Node/Python pure verifiers",
    verificationHref: "/proof/#PROOF-L3-DECISION-001",
    verificationLabel: "L3 decision proof",
    challengeHref: "/challenge/",
    verificationStatus: "VERIFIED",
    provenance: "HISTORICAL",
    notes: "VERIFIED — capsule-scoped deterministic L3 decision evidence (ART-L3-DECISION-001 / INV-L3-001). This verifies the sealed decision contract and its reproducibility. It does not establish production enforcement or verification of the full EVO-V runtime.",
  },
  {
    layerId: "L2",
    name: "Economic + Institutional Layer",
    purpose: "Enterprise integration, compliance pathways, and institutional pilots.",
    inputs: ["Institutional requirements", "Compliance constraints", "Pilot scopes"],
    outputs: ["Pilot designs", "Assurance pathways", "Engagement contracts (off-surface)"],
    invariantIds: [],
    invariantNotes: ["Institutional process is documented; not a cryptographic invariant set."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "/institutional-pilots · consulting intake",
    verificationHref: "/institutional-pilots/",
    verificationLabel: "Institutional pilots",
    challengeHref: "/challenge/",
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
  },
  {
    layerId: "L1",
    name: "Human Interface Layer",
    purpose: "Public verification surfaces and human-facing assurance journeys.",
    inputs: ["Evidence packages", "Evaluator intent", "Navigation requests"],
    outputs: ["Inspectable surfaces", "Reproduction paths", "Decision ownership clarity"],
    invariantIds: [],
    invariantNotes: ["UI is not the authority; sealed artifacts and pure verifiers are."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Public site · /proof · /verify · /blueprint",
    verificationHref: "/proof/",
    verificationLabel: "Proof Registry",
    challengeHref: "/challenge/",
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
  },
];

export function getArchitectureLayer(id: ArchitectureLayerId): ArchitectureLayer | undefined {
  return architectureLayers.find((l) => l.layerId === id);
}

export function architectureLayersByEvidenceDensity(): ArchitectureLayer[] {
  const rank = (s: VerificationStatus): number => {
    if (s === "VERIFIED") return 3;
    if (s === "DEMONSTRATION") return 2;
    if (s === "TARGET" || s === "PENDING") return 1;
    return 0;
  };
  return [...architectureLayers].sort(
    (a, b) => rank(b.verificationStatus) - rank(a.verificationStatus)
  );
}
