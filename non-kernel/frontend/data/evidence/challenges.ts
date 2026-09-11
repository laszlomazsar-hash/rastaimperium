/**
 * Challenge Lab v2 — normalized public challenge records.
 * Derived only from existing Challenge entries in manifest.ts and L7 receipts.
 * Phase 22 Step 6.
 *
 * Does not invent fixtures, observed results, or production authority.
 */

import type { EvidenceStatus } from "@/components/design-system/StatusBadge";
import { challenges as manifestChallenges } from "./manifest";
import type { Challenge, ProvenanceKind } from "./types";
import { getReceipt } from "./receipts";

/** Frontend-safe challenge presentation record. */
export interface ChallengeLabRecord {
  challengeId: string;
  title: string;
  /** Boundary / what is being tested */
  boundary: string;
  /** Public input description (from manifest; not a reconstructed fixture) */
  input: string;
  /** Expected invariant / outcome language from source */
  expected: string;
  invariant: string;
  invariantId?: string;
  /** Result language from source — presentation only */
  result: string;
  reason: string;
  /** Manifest verification label — NOT an evidence status */
  verificationLabel: Challenge["verification"];
  /** Evidence status of linked sealed artifact, if any */
  evidenceStatus: EvidenceStatus;
  provenance: ProvenanceKind;
  proofId?: string;
  /** Linked sealed artifact when authoritative */
  artifactId?: string;
  artifactUrl?: string;
  receiptAnchor?: string;
  verifierUrl?: string;
  reproductionUrl?: string;
  productionAuthority: false;
  scope: string;
  limitations: string[];
  /** Whether a sealed public capsule backs this challenge */
  sealedEvidence: boolean;
}

function evidenceStatusFor(
  artifactId: string | undefined,
  provenance: ProvenanceKind
): EvidenceStatus {
  if (artifactId) {
    const r = getReceipt(artifactId);
    if (r) return r.status;
  }
  if (provenance === "DEMONSTRATION") return "DEMONSTRATION";
  return "UNAVAILABLE";
}

/** Map known challenge → sealed artifact (only when established). */
function linkedArtifact(c: Challenge): string | undefined {
  if (c.challengeId === "CHAL-ILLEGAL-TRANSITION-001") return "ART-L7-REJECT-001";
  if (c.challengeId === "CHAL-REPLAY-MISMATCH-001") return "ART-L7-REPLAY-001";
  // CHAL-ALTERED-RECEIPT-001 has no sealed public capsule
  return undefined;
}

function invariantIdFrom(invariant: string): string | undefined {
  if (invariant.includes("INV-002")) return "INV-002";
  if (invariant.includes("INV-001")) return "INV-001";
  return undefined;
}

function limitationsFor(c: Challenge, artifactId?: string): string[] {
  const base = [
    "Challenges are deterministic, non-destructive, and isolated from production.",
    "They do not establish production performance, certification, or full-kernel parity.",
  ];
  if (artifactId === "ART-L7-REJECT-001") {
    return [
      ...base,
      "Capsule-scoped rejection proof only (ART-L7-REJECT-001). Not a general security certification.",
      "Complements valid-path ART-L7-REPLAY-001 with adversarial rejection.",
    ];
  }
  if (artifactId === "ART-L7-REPLAY-001") {
    return [
      ...base,
      "Capsule-scoped only. Does not prove production EVO-V health or LIVE telemetry.",
    ];
  }
  return [
    ...base,
    "No sealed public capsule is attached to this challenge on the public surface.",
  ];
}

function toRecord(c: Challenge): ChallengeLabRecord {
  const artifactId = linkedArtifact(c);
  const receipt = artifactId ? getReceipt(artifactId) : undefined;
  const sealed = Boolean(receipt);

  return {
    challengeId: c.challengeId,
    title: c.title,
    boundary: c.description,
    input: c.input,
    expected: c.expected,
    invariant: c.invariant,
    invariantId: invariantIdFrom(c.invariant),
    result: c.result,
    reason: c.reason,
    verificationLabel: c.verification,
    evidenceStatus: evidenceStatusFor(artifactId, c.provenance),
    provenance: c.provenance,
    proofId: c.proofId,
    artifactId,
    artifactUrl: receipt?.artifactUrl,
    receiptAnchor: artifactId ? `/proof/#receipt-${artifactId}` : undefined,
    verifierUrl: receipt?.verifierUrl,
    reproductionUrl: receipt?.reproductionUrl,
    productionAuthority: false,
    scope: sealed ? "Capsule-scoped only" : "No sealed public capsule",
    limitations: limitationsFor(c, artifactId),
    sealedEvidence: sealed,
  };
}

/** All challenges from the Living Evidence Manifest, normalized. */
export const CHALLENGE_LAB_RECORDS: ChallengeLabRecord[] =
  manifestChallenges.map(toRecord);

export function listChallengeLabRecords(): ChallengeLabRecord[] {
  return CHALLENGE_LAB_RECORDS;
}

export function getChallengeLabRecord(
  challengeId: string
): ChallengeLabRecord | undefined {
  return CHALLENGE_LAB_RECORDS.find((r) => r.challengeId === challengeId);
}

/** Canonical evidence-backed challenge for Step 6. */
export const CANONICAL_CHALLENGE_ID = "CHAL-ILLEGAL-TRANSITION-001" as const;
