/**
 * Reproducibility & evidence export records — Phase 22 Step 9.
 * Derived from L7 receipts + published pure-verifier documentation only.
 * Commands sourced from docs/evidence/REPRODUCE_OFFLINE.md.
 * Expected/Observed remain unset until the evaluator runs offline.
 */

import type { EvidenceStatus } from "@/components/design-system/StatusBadge";
import { L7_RECEIPTS, getReceipt } from "./receipts";
import type { VerificationReceiptData } from "@/components/design-system/VerificationReceipt";

export interface ReproducibilityRecord {
  artifactId: string;
  artifactUrl: string;
  artifactHash?: string;
  invariantId: string;
  invariantDescription: string;
  verifierImplementation: string;
  verifierPath: string;
  verifierDocUrl: string;
  reproductionDocUrl: string;
  /** Exact command from REPRODUCE_OFFLINE.md / verify surface */
  command: string;
  /** Optional alternate command */
  commandAlt?: string;
  environment: string;
  expected: undefined;
  observed: undefined;
  status: EvidenceStatus;
  scope: string;
  productionAuthority: false;
  limitations: string[];
  receiptHref: string;
  modifiers?: Array<"FROZEN" | "HISTORICAL">;
}

/** Commands taken from docs/evidence/REPRODUCE_OFFLINE.md (repo-root path form). */
const COMMANDS: Record<string, { command: string; commandAlt?: string }> = {
  "ART-L7-REPLAY-001": {
    command: "node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs",
    commandAlt: "# or: node verify-art-l7-replay-001.mjs ./ART-L7-REPLAY-001.json",
  },
  "ART-L7-REJECT-001": {
    command: "node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs",
    commandAlt: "# or: node verify-art-l7-reject-001.mjs ./ART-L7-REJECT-001.json",
  },
  "ART-L7-PARITY-001": {
    command: "node non-kernel/frontend/scripts/parity-art-l7.mjs",
  },
};

function fromReceipt(r: VerificationReceiptData): ReproducibilityRecord {
  const cmds = COMMANDS[r.artifactId] ?? { command: "# See PURE_VERIFIER_README.md" };
  return {
    artifactId: r.artifactId,
    artifactUrl: r.artifactUrl ?? r.artifactPath,
    artifactHash: r.artifactHash,
    invariantId: r.invariantId,
    invariantDescription: r.invariantDescription,
    verifierImplementation: r.verifier.implementation,
    verifierPath: r.verifier.path,
    verifierDocUrl:
      r.verifierUrl ??
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
    reproductionDocUrl:
      r.reproductionUrl ??
      "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
    command: cmds.command,
    commandAlt: cmds.commandAlt,
    environment: "Node.js ≥ 18 (and Python 3 where parity scripts require it). Offline; no network required for pure verifiers.",
    expected: undefined,
    observed: undefined,
    status: r.status,
    scope: r.scope,
    productionAuthority: false,
    limitations: r.limitations,
    receiptHref: `/proof/#receipt-${r.artifactId}`,
    modifiers: r.modifiers,
  };
}

export const REPRODUCIBILITY_RECORDS: ReproducibilityRecord[] = Object.values(
  L7_RECEIPTS
).map(fromReceipt);

export function listReproducibilityRecords(): ReproducibilityRecord[] {
  return REPRODUCIBILITY_RECORDS;
}

export function getReproducibilityRecord(
  artifactId: string
): ReproducibilityRecord | undefined {
  return REPRODUCIBILITY_RECORDS.find((r) => r.artifactId === artifactId);
}

/** Machine-readable export schema for evaluators (null = not established). */
export function toExportJson(r: ReproducibilityRecord) {
  return {
    artifactId: r.artifactId,
    artifactUrl: r.artifactUrl,
    artifactHash: r.artifactHash ?? null,
    invariant: r.invariantId,
    invariantDescription: r.invariantDescription,
    verifier: r.verifierImplementation,
    verifierPath: r.verifierPath,
    expected: null,
    observed: null,
    status: r.status,
    scope: r.scope,
    productionAuthority: false,
    limitations: r.limitations,
    reproduction: {
      method: "offline pure verifier",
      command: r.command,
      environment: r.environment,
      documentation: r.reproductionDocUrl,
    },
    receiptHref: r.receiptHref,
    note: "Evaluator-local export template. Not a Rasta Imperium certification. Expected/observed require offline execution.",
  };
}

/** Authoritative public file index for the export surface (no generated archive). */
export const EVIDENCE_SOURCE_INDEX = [
  {
    label: "Living Evidence Manifest (JSON)",
    href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/EVIDENCE_MANIFEST.json",
  },
  {
    label: "Reproduce offline guide",
    href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/REPRODUCE_OFFLINE.md",
  },
  {
    label: "Pure Verifier README",
    href: "https://github.com/laszlomazsar-hash/rastaimperium/blob/main/docs/evidence/PURE_VERIFIER_README.md",
  },
  {
    label: "ART-L7-REPLAY-001 sealed artifact",
    href: "/evidence/artifacts/ART-L7-REPLAY-001.json",
  },
  {
    label: "ART-L7-REJECT-001 sealed artifact",
    href: "/evidence/artifacts/ART-L7-REJECT-001.json",
  },
  {
    label: "ART-L7-PARITY-001 sealed artifact",
    href: "/evidence/artifacts/ART-L7-PARITY-001.json",
  },
] as const;

/** Local preservation checklist — procedural only. */
export const PRESERVATION_STEPS = [
  "Download or copy the sealed artifact JSON exactly as published.",
  "Preserve the pure-verifier script(s) or repository revision you used.",
  "Preserve REPRODUCE_OFFLINE.md / PURE_VERIFIER_README.md as inspected.",
  "Record environment (runtime version) and exact command.",
  "Record exit code and any locally computed digests — label them as local reproduction results.",
  "Do not treat this website session as the authoritative archive.",
] as const;

/** Ensure receipt exists for each reproducibility row. */
export function assertReceiptCoverage(): boolean {
  return REPRODUCIBILITY_RECORDS.every((r) => Boolean(getReceipt(r.artifactId)));
}
