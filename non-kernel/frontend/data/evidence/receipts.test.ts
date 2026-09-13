/**
 * Focused integrity tests for VerificationReceipt + sealed receipts.
 * Phase 22 Step 5 / Phase 25 Step 4.
 */
import { describe, it, expect } from "vitest";
import { L7_RECEIPTS, getReceipt, listReceipts } from "./receipts";

const L7_CANONICAL_IDS = [
  "ART-L7-REPLAY-001",
  "ART-L7-REJECT-001",
  "ART-L7-PARITY-001",
] as const;

const SEALED_RECEIPT_IDS = [
  "ART-L3-DECISION-001",
  "ART-L7-REPLAY-001",
  "ART-L7-REJECT-001",
  "ART-L7-PARITY-001",
] as const;

describe("L7 Verification Receipts — data integrity", () => {
  it("exposes the three canonical L7 capsules plus the sealed L3 decision capsule", () => {
    const ids = listReceipts().map((r) => r.artifactId).sort();
    expect(ids).toEqual([...SEALED_RECEIPT_IDS].sort());
    for (const id of L7_CANONICAL_IDS) {
      expect(ids).toContain(id);
    }
  });

  it("never upgrades status beyond the source", () => {
    for (const id of SEALED_RECEIPT_IDS) {
      const r = getReceipt(id)!;
      expect(r.status).toBe("VERIFIED");
    }
  });

  it("always declares production authority as false", () => {
    for (const id of SEALED_RECEIPT_IDS) {
      const r = getReceipt(id)!;
      expect(r.productionAuthority).toBe(false);
    }
  });

  it("does not fabricate expected or observed hashes", () => {
    for (const id of SEALED_RECEIPT_IDS) {
      const r = getReceipt(id)!;
      expect(r.expected).toBeUndefined();
      expect(r.observed).toBeUndefined();
    }
  });

  it("ART-L7-REPLAY-001 carries the sealed artifact hash from the manifest", () => {
    const r = getReceipt("ART-L7-REPLAY-001")!;
    expect(r.artifactHash).toBe(
      "3f1705c85e156b965908f9b604c432461ff105333f27481df800b3b37940dc9f",
    );
  });

  it("ART-L7-REJECT-001 carries the sealed artifact hash from the manifest", () => {
    const r = getReceipt("ART-L7-REJECT-001")!;
    expect(r.artifactHash).toBe(
      "4e208e48227cb5387b8d745f2cb5e35db3ec80c2f1844ce4b3b185c0c6a21f5a",
    );
  });

  it("ART-L7-PARITY-001 remains VERIFIED and capsule-scoped", () => {
    const r = getReceipt("ART-L7-PARITY-001")!;
    expect(r.status).toBe("VERIFIED");
    expect(r.scope?.toLowerCase()).toContain("capsule");
  });

  it("provides real artifact and verifier destinations", () => {
    for (const id of SEALED_RECEIPT_IDS) {
      const r = getReceipt(id)!;
      expect(r.artifactUrl).toBe(`/evidence/artifacts/${id}.json`);
      expect(r.verifierUrl).toBeTruthy();
      expect(r.reproductionUrl).toBeTruthy();
    }
  });

  it("returns undefined for unknown artifacts (no invention)", () => {
    expect(getReceipt("ART-DOES-NOT-EXIST")).toBeUndefined();
    expect(L7_RECEIPTS["ART-DOES-NOT-EXIST"]).toBeUndefined();
  });
});
