/**
 * Phase 9 — Verifiable Architecture
 * Evidence-linked civilization stack (L1–L9).
 * Honesty rule unchanged: no invented LIVE / VERIFIED status.
 */

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
  /** Aggregate honesty for this layer's public evidence surface */
  verificationStatus: VerificationStatus;
  provenance: ProvenanceKind;
  notes?: string;
}

/**
 * Civilization stack used on the public homepage / Phase 8 narrative.
 * Distinct from the Blueprint PDF's product-layer naming; both are documentation.
 * Evidence links only where Phase 8 manifest already publishes records.
 */
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
    notes: "Narrative layer — evidence not currently published as machine artifacts.",
  },
  {
    layerId: "L8",
    name: "Constitutional Layer",
    purpose: "Seven Articles — hardware-enforced governance physics as constitutional constraints.",
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
    notes: "Evidence not currently published beyond documentation references.",
  },
  {
    layerId: "L7",
    name: "Identity + Trust Layer",
    purpose: "Immutable replay ledger and cryptographic proofs — public verification centre of gravity.",
    inputs: [
      "Ordered event stream",
      "Fixed version bundle",
      "Canonicalization profile",
      "Receipt / ledger head candidates",
    ],
    outputs: [
      "State hash",
      "Receipt hash",
      "Ledger head hash",
      "Counterexample payloads on failure",
    ],
    invariantIds: ["INV-001", "INV-002"],
    invariantNotes: [
      "INV-001 replay_parity — identical inputs yield identical terminal hashes.",
      "INV-002 no_hidden_state_mutation — lifecycle changes only via explicit transitions.",
    ],
    evidenceIds: ["EVD-REPLAY-DOC-001", "EVD-LEDGER-DOC-001", "EVD-LIFECYCLE-DOC-001"],
    proofIds: ["PROOF-REPLAY-001", "PROOF-CHAIN-001", "PROOF-ILLEGAL-001"],
    challengeIds: [
      "CHAL-ILLEGAL-TRANSITION-001",
      "CHAL-REPLAY-MISMATCH-001",
      "CHAL-ALTERED-RECEIPT-001",
    ],
    implementation: "evo-v ledger / replay · docs/INVARIANTS.md · transition matrix",
    verificationHref: "/trust/",
    verificationLabel: "Trust Console",
    challengeHref: "/challenge/",
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
    notes:
      "Strongest public evidence surface: specification + tests + deterministic challenge fixtures. Production receipts not published here.",
  },
  {
    layerId: "L6",
    name: "Epistemic Governance Layer",
    purpose: "Bayesian calibration and drift detection for epistemic integrity.",
    inputs: ["Observation streams", "Calibration priors", "Drift thresholds"],
    outputs: ["Drift signals", "Calibration status", "Admissibility hints"],
    invariantIds: [],
    invariantNotes: ["Drift / calibration invariants not yet linked to public evidence IDs."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Epistemic modules (repo documentation); public artifacts pending",
    verificationHref: "/evidence/",
    verificationLabel: "Evidence Explorer",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L5",
    name: "Deterministic Intelligence Layer",
    purpose: "Causal modeling and symbolic reasoning under constitutional constraints.",
    inputs: ["Structured state", "Causal hypotheses", "Symbolic rules"],
    outputs: ["Causal assessments", "Symbolic conclusions", "Constrained recommendations"],
    invariantIds: [],
    invariantNotes: ["No public proof IDs attached for causal/symbolic determinism yet."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Intelligence layer documentation; runtime outside Rasta Imperium surface",
    verificationHref: "/proof/",
    verificationLabel: "Proof Registry",
    challengeHref: "/challenge/",
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
  },
  {
    layerId: "L4",
    name: "Agentic Infrastructure Layer",
    purpose: "Deep Seed agent orchestration within bounded governance fields.",
    inputs: ["Agent intents", "Capability grants", "Orchestration policies"],
    outputs: ["Coordinated agent actions", "Orchestration receipts (target)"],
    invariantIds: [],
    invariantNotes: ["Agent boundary invariants not published as public evidence records."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "Agent orchestration design docs; demos are not production execution",
    verificationHref: "/evidence/",
    verificationLabel: "Evidence Explorer",
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
    invariantIds: ["INV-001", "INV-002"],
    invariantNotes: [
      "Shares enforcement dependency on INV-001 / INV-002 where lifecycle and replay apply.",
    ],
    evidenceIds: ["EVD-REPLAY-DOC-001", "EVD-LIFECYCLE-DOC-001"],
    proofIds: ["PROOF-REPLAY-001", "PROOF-ILLEGAL-001"],
    challengeIds: ["CHAL-ILLEGAL-TRANSITION-001", "CHAL-REPLAY-MISMATCH-001"],
    implementation: "Operational enforcement path documented via invariants and FSM matrix",
    verificationHref: "/proof/",
    verificationLabel: "Open related proofs",
    challengeHref: "/challenge/",
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
    notes: "Linked to published invariant documentation and challenge fixtures only.",
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
    verificationStatus: "UNAVAILABLE",
    provenance: "UNAVAILABLE",
    notes: "Pathway is public; production institutional assurance artifacts not published.",
  },
  {
    layerId: "L1",
    name: "Human Interface Layer",
    purpose: "Progressive initiation and witness portals — human oversight surface.",
    inputs: ["Human operators", "Witness requests", "Oversight policies"],
    outputs: ["UI surfaces", "Witness views", "Human approval paths (target)"],
    invariantIds: [],
    invariantNotes: ["UI is not a substitute for ledger proof."],
    evidenceIds: [],
    proofIds: [],
    challengeIds: [],
    implementation: "This public site (Rasta Imperium) as constitutional/verification presentation",
    verificationHref: "/trust/",
    verificationLabel: "Trust Console",
    challengeHref: "/challenge/",
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
    notes: "The public site itself is the demonstration surface — not the EVO-V runtime.",
  },
];

export function getArchitectureLayer(id: ArchitectureLayerId): ArchitectureLayer | undefined {
  return architectureLayers.find((l) => l.layerId === id);
}

export function architectureLayersByEvidenceDensity(): ArchitectureLayer[] {
  return [...architectureLayers].sort((a, b) => b.evidenceIds.length - a.evidenceIds.length);
}
