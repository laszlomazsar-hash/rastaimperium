import { proofs as baseProofs } from "./manifest";
import type { Claim, Evidence, Proof } from "./types";

export const l3Claim: Claim = {
  claimId: "CLAIM-L3-DECISION-001",
  statement:
    "For sealed public capsule ART-L3-DECISION-001, the frozen decision contract deterministically allows listed legal transitions and rejects malformed or unknown transitions with a stable reason (INV-L3-001).",
  category: "governance",
  relatedInvariantIds: ["INV-L3-001"],
  evidenceIds: ["EVD-L3-DECISION-ART-001"],
  proofIds: ["PROOF-L3-DECISION-001"],
  verificationStatus: "VERIFIED",
  provenance: "HISTORICAL",
  notes:
    "VERIFIED applies only to the sealed L3 decision capsule. It does not establish production enforcement or full EVO-V runtime verification.",
};

export const l3Evidence: Evidence = {
  evidenceId: "EVD-L3-DECISION-ART-001",
  title: "Sealed public L3 decision capsule ART-L3-DECISION-001",
  description:
    "Frozen deterministic decision contract with independent Node and Python pure verifiers. Expected and observed runtime outcomes are not established on this public registry record.",
  claimIds: ["CLAIM-L3-DECISION-001"],
  proofIds: ["PROOF-L3-DECISION-001"],
  artifactId: "ART-L3-DECISION-001",
  source: "/evidence/artifacts/ART-L3-DECISION-001.json",
  verificationStatus: "VERIFIED",
  provenance: "HISTORICAL",
  relatedInvariantIds: ["INV-L3-001"],
  relatedTrustSections: ["governance", "transparency"],
  verificationMethod:
    "Node + Python pure verifiers for ART-L3-DECISION-001",
  notes:
    "Capsule-scoped VERIFIED only. Production authority NOT ESTABLISHED.",
};

export const l3Proof: Proof = {
  proofId: "PROOF-L3-DECISION-001",
  title: "Deterministic L3 decision contract — ART-L3-DECISION-001",
  description:
    "INV-L3-001 verified for the sealed public L3 decision capsule.",
  status: "VERIFIED",
  proofType: "deterministic_decision_contract",
  invariant: "INV-L3-001",
  inputFixture: "ART-L3-DECISION-001.json",
  expectedOutcome: "Not established",
  observedOutcome: "Not established",
  source: "/evidence/artifacts/ART-L3-DECISION-001.json",
  verificationMethod:
    "Node + Python pure verifiers for ART-L3-DECISION-001",
  replayAvailable: true,
  relatedClaim: "CLAIM-L3-DECISION-001",
  provenance: "HISTORICAL",
  notes:
    "VERIFIED — capsule-scoped only. The UI is not the authority. Production authority NOT ESTABLISHED.",
  artifactId: "ART-L3-DECISION-001",
};

export const publicProofs: Proof[] = [...baseProofs, l3Proof];
export const publicClaims: Claim[] = [l3Claim];
export const publicEvidence: Evidence[] = [l3Evidence];
