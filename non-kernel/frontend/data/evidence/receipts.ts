/**
 * Normalized Verification Receipt data derived solely from:
 * - docs/evidence/EVIDENCE_MANIFEST.json
 * - sealed public capsules ART-L7-*
 * - existing pure-verifier documentation
 *
 * No observed/expected hashes are invented.
 * Production authority is always false on this surface.
 * Phase 22 Step 5.
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
  // TARGET / HISTORICAL / PENDING never become VERIFIED
  return "UNAVAILABLE";
}

/**
 * Canonical receipts for the three sealed L7 capsules.
 * Status and scope are taken verbatim from the Living Evidence Manifest.
 * Expected / Observed remain "Not established" until a pure-verifier run
 * is performed by the evaluator offline.
 */
export const L7_RECEIPTS: Record<string, VerificationReceiptData> = {
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
    // Sealed artifact hash from manifest (presentation only)
    artifactHash:
      "3f1705c85e156b965908f9b604c432461ff105333f27481df800b3b37940dc9f",
    // Pure-verifier result hashes are produced only by offline execution
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
    verifierUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
    reproductionUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
    modifiers: ["FROZEN", "HISTORICAL"],
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
      "Capsule-scoped rejection proof only. Not a general security certification.",
      "Complements valid-path ART-L7-REPLAY-001 with adversarial rejection.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L7-REJECT-001.json",
    verifierUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
    reproductionUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
    modifiers: ["FROZEN", "HISTORICAL"],
  },

  "ART-L7-PARITY-001": {
    artifactId: "ART-L7-PARITY-001",
    artifactPath: "/evidence/artifacts/ART-L7-PARITY-001.json",
    invariantId: "cross_implementation_parity",
    invariantDescription:
      "Independent Node and Python pure verifiers produce identical sealed hashes for the same capsule.",
    verifier: {
      implementation: "Node + Python pure verifiers (parity gate)",
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
      "Parity among pure verifiers for this capsule — not full-kernel parity or production runtime agreement.",
    ],
    artifactUrl: "/evidence/artifacts/ART-L7-PARITY-001.json",
    verifierUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
    reproductionUrl:
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
    modifiers: ["FROZEN", "HISTORICAL"],
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
