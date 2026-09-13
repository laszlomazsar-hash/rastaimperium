/**
 * Phase 8/9 evidence manifest.
 * VERIFIED only when a sealed public capsule independently reproduces expected hashes.
 * ART-L7-REPLAY-001 · ART-L7-REJECT-001 · ART-L7-PARITY-001 · ART-L3-DECISION-001
 */

import type {
  Benchmark,
  Challenge,
  Claim,
  Evidence,
  Proof,
  TrustConsoleSnapshot,
} from "./types";

export const MANIFEST_VERSION = "phase25-verified-l3-decision-v1";
export const MANIFEST_AS_OF = "2026-09-13T03:45:00Z";

export const claims: Claim[] = [
  {
    claimId: "CLAIM-REPLAY-001",
    statement:
      "For sealed public capsule ART-L7-REPLAY-001, deterministic replay under identical inputs and event order yields identical terminal state hash, receipt hash, and ledger head hash (INV-001).",
    category: "determinism",
    relatedInvariantIds: ["INV-001"],
    evidenceIds: ["EVD-REPLAY-DOC-001", "EVD-REPLAY-ART-001"],
    proofIds: ["PROOF-REPLAY-001"],
    verificationStatus: "VERIFIED",
    provenance: "HISTORICAL",
    notes:
      "VERIFIED applies only to ART-L7-REPLAY-001 via independent pure-engine replay. Not production EVO-V runtime measurement.",
  },
  {
    claimId: "CLAIM-L3-DECISION-001",
    statement:
      "For sealed public capsule ART-L3-DECISION-001, deterministic operational transition decisions under INV-L3-001 reproduce the sealed digest via independent Node and Python pure verifiers (capsule-scoped only).",
    category: "governance",
    relatedInvariantIds: ["INV-L3-001"],
    evidenceIds: ["EVD-L3-DECISION-001"],
    proofIds: ["PROOF-L3-DECISION-001"],
    verificationStatus: "VERIFIED",
    provenance: "HISTORICAL",
    notes:
      "VERIFIED — capsule-scoped deterministic L3 decision evidence. Does not establish production enforcement or full EVO-V runtime verification.",
  },
  {
    claimId: "CLAIM-LEDGER-001",
    statement: "Append-only audit lineage with hash-linked chronology.",
    category: "integrity",
    relatedInvariantIds: ["INV-002"],
    evidenceIds: ["EVD-LEDGER-DOC-001"],
    proofIds: ["PROOF-CHAIN-001"],
    verificationStatus: "DEMONSTRATION",
    provenance: "DEMONSTRATION",
  },
  {
    claimId: "CLAIM-LIFECYCLE-001",
    statement:
      "For sealed public capsule ART-L7-REJECT-001, illegal lifecycle edge VERIFIED→INGESTED is deterministically rejected with no state mutation and a sealed rejection receipt (INV-002 family).",
    category: "governance",
    relatedInvariantIds: ["INV-002"],
    evidenceIds: ["EVD-LIFECYCLE-DOC-001", "EVD-REJECT-ART-001"],
    proofIds: ["PROOF-ILLEGAL-001"],
    verificationStatus: "VERIFIED",
    provenance: "HISTORICAL",
    notes:
      "VERIFIED applies only to ART-L7-REJECT-001. Complements valid-path ART-L7-REPLAY-001 with adversarial rejection.",
  },
];
