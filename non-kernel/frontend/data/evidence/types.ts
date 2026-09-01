/**
 * Phase 8 — Public Trust & Evidence Layer
 * Structured types for claims, proofs, evidence, benchmarks, challenges.
 * Prefer static versioned manifests; do not invent production telemetry.
 */

export type ProvenanceKind =
  | "LIVE"
  | "DEMONSTRATION"
  | "HISTORICAL"
  | "TARGET"
  | "UNAVAILABLE";

export type VerificationStatus =
  | "VERIFIED"
  | "DEMONSTRATION"
  | "TARGET"
  | "HISTORICAL"
  | "UNAVAILABLE"
  | "PENDING";

export type ProofType =
  | "deterministic_replay"
  | "receipt_verification"
  | "chain_integrity"
  | "lifecycle_transition"
  | "illegal_transition_rejection"
  | "invariant_enforcement"
  | "cross_implementation_parity"
  | "adversarial_rejection"
  | "governance_decision"
  | "transparency_verification";

export type TrustSectionId =
  | "registry"
  | "keys"
  | "transparency"
  | "parity"
  | "adversarial"
  | "governance"
  | "challenge";

export interface Claim {
  claimId: string;
  statement: string;
  category: string;
  relatedInvariantIds: string[];
  evidenceIds: string[];
  proofIds: string[];
  verificationStatus: VerificationStatus;
  provenance: ProvenanceKind;
  notes?: string;
}

export interface Evidence {
  evidenceId: string;
  title: string;
  description: string;
  claimIds: string[];
  proofIds: string[];
  artifactId?: string;
  hash?: string;
  implementation?: string;
  version?: string;
  timestamp?: string;
  source: string;
  verificationStatus: VerificationStatus;
  provenance: ProvenanceKind;
  relatedInvariantIds: string[];
  relatedTrustSections: TrustSectionId[];
  verificationMethod?: string;
  notes?: string;
}

export interface Proof {
  proofId: string;
  title: string;
  description: string;
  status: VerificationStatus;
  proofType: ProofType;
  invariant?: string;
  inputFixture?: string;
  expectedOutcome?: string;
  observedOutcome?: string;
  engineVersion?: string;
  receiptVersion?: string;
  timestamp?: string;
  artifactId?: string;
  hash?: string;
  source: string;
  verificationMethod: string;
  replayAvailable: boolean;
  implementation?: string;
  relatedClaim?: string;
  provenance: ProvenanceKind;
  notes?: string;
}

export interface Benchmark {
  benchmarkId: string;
  metric: string;
  value: string;
  target: string;
  result: string;
  benchmarkVersion?: string;
  executionDate?: string;
  environment?: string;
  artifactId?: string;
  evidenceId?: string;
  verificationStatus: VerificationStatus;
  provenance: ProvenanceKind;
  notes?: string;
}

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  input: string;
  expected: string;
  result: string;
  invariant: string;
  reason: string;
  receipt?: string;
  hash?: string;
  verification: "PASS" | "FAIL" | "REJECTED_AS_DESIGNED";
  deterministic: true;
  nonDestructive: true;
  isolatedFromProduction: true;
  provenance: ProvenanceKind;
  proofId?: string;
}

export interface TrustSectionStatus {
  id: TrustSectionId;
  label: string;
  status: string;
  timestamp?: string;
  version?: string;
  evidenceId?: string;
  proofId?: string;
  provenance: ProvenanceKind;
  verificationActionHref: string;
  verificationActionLabel: string;
  notes?: string;
}

export interface TrustConsoleSnapshot {
  overallLabel: string;
  overallStatus: string;
  asOf: string;
  version: string;
  provenance: ProvenanceKind;
  sections: TrustSectionStatus[];
  notes: string;
}
