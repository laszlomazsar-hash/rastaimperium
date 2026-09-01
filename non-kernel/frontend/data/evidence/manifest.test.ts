import { describe, expect, it } from "vitest";
import {
  benchmarks,
  challenges,
  claims,
  evidence,
  getClaim,
  getEvidence,
  getProof,
  proofs,
  trustConsole,
} from "./manifest";

describe("Phase 8/9 evidence manifest integrity", () => {
  it("has unique proof, evidence, and claim ids", () => {
    const proofIds = proofs.map((p) => p.proofId);
    const evidenceIds = evidence.map((e) => e.evidenceId);
    const claimIds = claims.map((c) => c.claimId);
    expect(new Set(proofIds).size).toBe(proofIds.length);
    expect(new Set(evidenceIds).size).toBe(evidenceIds.length);
    expect(new Set(claimIds).size).toBe(claimIds.length);
  });

  it("links claims only to existing evidence and proofs", () => {
    for (const c of claims) {
      for (const eid of c.evidenceIds) {
        expect(getEvidence(eid), `missing evidence ${eid}`).toBeTruthy();
      }
      for (const pid of c.proofIds) {
        expect(getProof(pid), `missing proof ${pid}`).toBeTruthy();
      }
    }
  });

  it("never marks UNAVAILABLE provenance as VERIFIED", () => {
    for (const e of evidence) {
      if (e.provenance === "UNAVAILABLE") {
        expect(e.verificationStatus).not.toBe("VERIFIED");
      }
    }
    for (const b of benchmarks) {
      if (b.provenance === "UNAVAILABLE") {
        expect(b.verificationStatus).not.toBe("VERIFIED");
      }
    }
  });

  it("VERIFIED records require artifactId and are not LIVE", () => {
    for (const p of proofs) {
      if (p.status === "VERIFIED") {
        expect(p.artifactId).toBeTruthy();
        expect(p.hash).toBeTruthy();
        expect(p.provenance).not.toBe("LIVE");
        expect(p.replayAvailable).toBe(true);
      }
    }
    for (const e of evidence) {
      if (e.verificationStatus === "VERIFIED") {
        expect(e.artifactId).toBeTruthy();
        expect(e.provenance).not.toBe("LIVE");
      }
    }
    for (const c of claims) {
      if (c.verificationStatus === "VERIFIED") {
        expect(c.provenance).not.toBe("LIVE");
        expect(c.notes?.toLowerCase()).toContain("capsule");
      }
    }
  });

  it("trust console sections do not invent LIVE", () => {
    for (const s of trustConsole.sections) {
      expect(["LIVE", "DEMONSTRATION", "HISTORICAL", "TARGET", "UNAVAILABLE"]).toContain(
        s.provenance
      );
      expect(s.provenance).not.toBe("LIVE");
    }
    expect(trustConsole.provenance).not.toBe("LIVE");
  });

  it("challenges are safe by construction", () => {
    for (const ch of challenges) {
      expect(ch.deterministic).toBe(true);
      expect(ch.nonDestructive).toBe(true);
      expect(ch.isolatedFromProduction).toBe(true);
      expect(ch.provenance).not.toBe("LIVE");
    }
  });

  it("high-value claims resolve and replay claim is VERIFIED for capsule", () => {
    expect(getClaim("CLAIM-REPLAY-001")?.verificationStatus).toBe("VERIFIED");
    expect(getEvidence("EVD-REPLAY-ART-001")?.verificationStatus).toBe("VERIFIED");
    expect(getProof("PROOF-REPLAY-001")?.status).toBe("VERIFIED");
    expect(getClaim("CLAIM-LEDGER-001")).toBeTruthy();
    expect(getClaim("CLAIM-LIFECYCLE-001")).toBeTruthy();
  });
});
