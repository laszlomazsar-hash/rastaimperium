/**
 * Normalized Verification Receipt data derived solely from:
 * - docs/evidence/EVIDENCE_MANIFEST.json
 * - sealed public capsules ART-L7-* and ART-L3-DECISION-001
 * - existing pure-verifier documentation
 *
 * No observed/expected hashes are invented.
 * Production authority is always false on this surface.
 * Phase 22 Step 5 / Phase 25 Step 3.
 */

import type { VerificationReceiptData } from "@/components/design-system/VerificationReceipt";
import type { EvidenceStatus } from "@/components/design-system/StatusBadge";

/** Map manifest VerificationStatus → design-system EvidenceStatus without upgrade. */
function toEvidenceStatus(
  s: string
): EvidenceStatus {
  if (s === "VERIFIED") return "VERIFIED";
  if (s === "DEMONSTRATION") return "DEMONSTRATION";
  if (s === "UNAVAILABLE") return "UNAVAILABLE";
  // TARGET / HISTORICAL and other non-badge statuses degrade to UNAVAILABLE for UI.
  return "UNAVAILABLE";
}

/**
 * Canonical receipts for sealed public capsules.
 * Keys are artifact IDs. Do not invent receipts for unpublished artifacts.
 */
const L7_RECEIPTS: Record<string, VerificationReceiptData> = {
  "ART-L3-DECISION-001": {
    artifactId: "ART-L3-DECISION-001",
    artifactPath: "/evidence/artifacts/ART-L3-DECISION-001.json",
    invariantId: "INV-L3-001",
    invariantDescription:
      "deterministic_operational_transition_decision — ALLOW/DENY under frozen policySnapshot with stable reason codes; sealed digest reproducible offline.",
    verifier: {
      implementation: "Node + Python pure verifiers",
      path: "non-kernel/frontend/scripts/verify-art-l3-decision-001.mjs · scripts/verify_art_l3_decision_001.py",
      reproductionAvailable: true,
    },
    artifactHash: "88db345296504fa85c62d108ba24b9e64a772a764043bd85419c47ad51ad8577",
    expected: undefined,
    observed: undefined,
    status: toEvidenceStatus("VERIFIED"),
    scope: "Capsule-scoped deterministic L3 decision fixture",
    productionAuthority: false,
    limitations: [
      "Does not establish production enforcement or full EVO-V runtime verification.",
      "VERIFIED applies only to the sealed public capsule ART-L3-DECISION-001 under independent pure verifiers.",
      "Seal is over the canonical payload; file SHA is transport integrity only.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L3-DECISION-001.json",
  },
  "ART-L7-REPLAY-001": {
    artifactId: "ART-L7-REPLAY-001",
    artifactPath: "/evidence/artifacts/ART-L7-REPLAY-001.json",
    invariantId: "INV-001",
    invariantDescription: "replay_parity — deterministic replay under identical inputs and event order yields identical terminal state, receipt, and ledger head hashes.",
    verifier: {
      implementation: "Node + Python pure verifiers",
      path: "non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs · verify_art_l7_replay_001.py",
      reproductionAvailable: true,
    },
    artifactHash:
      "3f1705c85e156b965908f9b604c432461ff105333f27481df800b3b37940dc9f",
    expected: undefined,
    observed: undefined,
    status: toEvidenceStatus("VERIFIED"),
    scope: "Capsule-scoped only",
    productionAuthority: false,
    limitations: [
      "Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity.",
      "VERIFIED applies only to the sealed public capsule under independent pure-engine replay.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L7-REPLAY-001.json",
  },
  "ART-L7-REJECT-001": {
    artifactId: "ART-L7-REJECT-001",
    artifactPath: "/evidence/artifacts/ART-L7-REJECT-001.json",
    invariantId: "INV-002",
    invariantDescription:
      "illegal_transition_rejection — illegal lifecycle edge is rejected with no state mutation and a sealed rejection receipt.",
    verifier: {
      implementation: "Node + Python pure verifiers",
      path: "non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs · verify_art_l7_reject_001.py",
      reproductionAvailable: true,
    },
    artifactHash:
      "4e208e48227cb5387b8d745f2cb5e35db3ec80c2f1844ce4b3b185c0c6a21f5a",
    expected: undefined,
    observed: undefined,
    status: toEvidenceStatus("VERIFIED"),
    scope: "Capsule-scoped only",
    productionAuthority: false,
    limitations: [
      "Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity.",
      "Complements valid-path ART-L7-REPLAY-001 with adversarial rejection.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L7-REJECT-001.json",
  },
  "ART-L7-PARITY-001": {
    artifactId: "ART-L7-PARITY-001",
    artifactPath: "/evidence/artifacts/ART-L7-PARITY-001.json",
    invariantId: "cross_implementation_parity",
    invariantDescription:
      "cross_implementation_parity — independent Node and Python pure verifiers agree on sealed hashes.",
    verifier: {
      implementation: "Node + Python pure verifiers",
      path: "non-kernel/frontend/scripts/parity-art-l7.mjs",
      reproductionAvailable: true,
    },
    artifactHash: undefined,
    expected: undefined,
    observed: undefined,
    status: toEvidenceStatus("VERIFIED"),
    scope: "Capsule-scoped (Node + Python pure verifiers)",
    productionAuthority: false,
    limitations: [
      "Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity.",
      "Parity is over sealed public capsules only.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L7-PARITY-001.json",
  },
};

/** Lookup helper — never invents a receipt. */
export function getReceipt(
  artifactId: string
): VerificationReceiptData | undefined {
  return L7_RECEIPTS[artifactId];
}

/** All public receipts that currently exist. */
export function listReceipts(): VerificationReceiptData[] {
  return Object.values(L7_RECEIPTS);
}
