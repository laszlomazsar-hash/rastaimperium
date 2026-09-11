/**
 * Challenge Lab v2 integrity tests.
 * Phase 22 Step 6.
 */
import { describe, it, expect } from "vitest";
import {
  CANONICAL_CHALLENGE_ID,
  getChallengeLabRecord,
  listChallengeLabRecords,
} from "./challenges";
import { getReceipt } from "./receipts";

describe("Challenge Lab v2 — data integrity", () => {
  it("exposes CHAL-ILLEGAL-TRANSITION-001 as canonical", () => {
    const c = getChallengeLabRecord(CANONICAL_CHALLENGE_ID);
    expect(c).toBeDefined();
    expect(c!.challengeId).toBe("CHAL-ILLEGAL-TRANSITION-001");
  });

  it("maps illegal transition → INV-002 → ART-L7-REJECT-001", () => {
    const c = getChallengeLabRecord(CANONICAL_CHALLENGE_ID)!;
    expect(c.invariantId).toBe("INV-002");
    expect(c.artifactId).toBe("ART-L7-REJECT-001");
    expect(c.sealedEvidence).toBe(true);
    expect(c.receiptAnchor).toBe("/proof/#receipt-ART-L7-REJECT-001");
  });

  it("does not invent production authority", () => {
    for (const c of listChallengeLabRecords()) {
      expect(c.productionAuthority).toBe(false);
    }
  });

  it("does not upgrade evidence status beyond the receipt", () => {
    const c = getChallengeLabRecord(CANONICAL_CHALLENGE_ID)!;
    const receipt = getReceipt("ART-L7-REJECT-001")!;
    expect(c.evidenceStatus).toBe(receipt.status);
    expect(c.evidenceStatus).toBe("VERIFIED");
  });

  it("keeps verificationLabel subordinate to evidence status", () => {
    const c = getChallengeLabRecord(CANONICAL_CHALLENGE_ID)!;
    // Manifest uses REJECTED_AS_DESIGNED — not an EvidenceStatus
    expect(c.verificationLabel).toBe("REJECTED_AS_DESIGNED");
    expect(["VERIFIED", "DEMONSTRATION", "UNAVAILABLE"]).toContain(
      c.evidenceStatus
    );
  });

  it("provides real artifact and reproduction destinations for sealed challenges", () => {
    const c = getChallengeLabRecord(CANONICAL_CHALLENGE_ID)!;
    expect(c.artifactUrl).toBe("/evidence/artifacts/ART-L7-REJECT-001.json");
    expect(c.verifierUrl).toBeTruthy();
    expect(c.reproductionUrl).toBeTruthy();
  });

  it("does not invent a receipt for challenges without sealed evidence", () => {
    const altered = getChallengeLabRecord("CHAL-ALTERED-RECEIPT-001");
    expect(altered).toBeDefined();
    expect(altered!.sealedEvidence).toBe(false);
    expect(altered!.artifactId).toBeUndefined();
    expect(altered!.receiptAnchor).toBeUndefined();
  });

  it("returns undefined for unknown challenges", () => {
    expect(getChallengeLabRecord("CHAL-FAKE-999")).toBeUndefined();
  });
});
