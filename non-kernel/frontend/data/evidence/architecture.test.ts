import { describe, expect, it } from "vitest";
import { architectureLayers, getArchitectureLayer } from "./architecture";
import { getChallenge, getEvidence, getProof } from "./manifest";

describe("Phase 9 architecture layer integrity", () => {
  it("defines nine unique layers L1–L9", () => {
    expect(architectureLayers).toHaveLength(9);
    const ids = architectureLayers.map((l) => l.layerId);
    expect(new Set(ids).size).toBe(9);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      expect(ids).toContain(`L${n}`);
    }
  });

  it("never marks UNAVAILABLE layers as VERIFIED and never uses LIVE", () => {
    for (const l of architectureLayers) {
      expect(l.provenance).not.toBe("LIVE");
      if (l.provenance === "UNAVAILABLE") {
        expect(l.verificationStatus).not.toBe("VERIFIED");
      }
    }
  });

  it("links only existing evidence, proof, and challenge ids", () => {
    for (const l of architectureLayers) {
      for (const eid of l.evidenceIds) {
        expect(getEvidence(eid), `missing evidence ${eid} on ${l.layerId}`).toBeTruthy();
      }
      for (const pid of l.proofIds) {
        expect(getProof(pid), `missing proof ${pid} on ${l.layerId}`).toBeTruthy();
      }
      for (const cid of l.challengeIds) {
        expect(getChallenge(cid), `missing challenge ${cid} on ${l.layerId}`).toBeTruthy();
      }
    }
  });

  it("L7 Identity + Trust holds the earned VERIFIED capsule path", () => {
    const l7 = getArchitectureLayer("L7");
    expect(l7).toBeTruthy();
    expect(l7!.name).toMatch(/Identity/i);
    expect(l7!.evidenceIds).toContain("EVD-REPLAY-ART-001");
    expect(l7!.proofIds).toContain("PROOF-REPLAY-001");
    expect(l7!.verificationStatus).toBe("VERIFIED");
    expect(l7!.provenance).toBe("HISTORICAL");
    const proof = getProof("PROOF-REPLAY-001");
    expect(proof?.status).toBe("VERIFIED");
    expect(proof?.artifactId).toBe("ART-L7-REPLAY-001");
  });

  it("empty evidence arrays use explicit unavailable posture", () => {
    for (const l of architectureLayers) {
      if (l.evidenceIds.length === 0) {
        expect(["UNAVAILABLE", "TARGET", "PENDING"]).toContain(l.verificationStatus);
      }
    }
  });
});
