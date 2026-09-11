/**
 * Pilot readiness integrity — Phase 22 Step 10.
 */
import { describe, it, expect } from "vitest";
import {
  ASSURANCE_JOURNEY,
  PILOT_DECISION_OPTIONS,
  PILOT_EXCLUDED,
  PILOT_INCLUDED,
  PILOT_READINESS_MATRIX,
  PILOT_SUCCESS_CONDITIONS,
  listPilotReadinessRows,
} from "./pilot";
import { getReceipt } from "./receipts";

describe("Institutional pilot readiness", () => {
  it("verified rows map to sealed L7 receipts", () => {
    const verified = listPilotReadinessRows().filter((r) => r.status === "VERIFIED");
    expect(verified.length).toBe(3);
    for (const id of ["ART-L7-REPLAY-001", "ART-L7-REJECT-001", "ART-L7-PARITY-001"]) {
      expect(getReceipt(id)?.productionAuthority).toBe(false);
      expect(getReceipt(id)?.status).toBe("VERIFIED");
    }
  });

  it("exposes monitoring/telemetry/org/regulatory as non-verified", () => {
    const gaps = PILOT_READINESS_MATRIX.filter((r) => r.status !== "VERIFIED");
    expect(gaps.length).toBeGreaterThanOrEqual(3);
    expect(gaps.some((g) => g.status === "UNAVAILABLE")).toBe(true);
    expect(gaps.some((g) => g.status === "NOT_ASSESSED" || g.status === "NOT_ESTABLISHED")).toBe(
      true
    );
  });

  it("does not invent scores, customers, or certification language", () => {
    const blob = JSON.stringify({
      PILOT_READINESS_MATRIX,
      PILOT_INCLUDED,
      PILOT_EXCLUDED,
      PILOT_SUCCESS_CONDITIONS,
      PILOT_DECISION_OPTIONS,
    }).toLowerCase();
    expect(blob).not.toMatch(
      /\d+%|trust score|production ready|certified|customer logo|guaranteed/
    );
  });

  it("assurance journey links required Phase 22 surfaces", () => {
    const hrefs = ASSURANCE_JOURNEY.map((j) => j.href).join(" ");
    expect(hrefs).toContain("/proof/");
    expect(hrefs).toContain("/verify/");
    expect(hrefs).toContain("/challenge/");
    expect(hrefs).toContain("/evidence/export/");
    expect(hrefs).toContain("/governance-crosswalk/");
    expect(hrefs).toContain("/institutional-pilots/");
    expect(hrefs).toContain("/evaluate/");
  });

  it("decision authority remains with the institution", () => {
    expect(PILOT_INCLUDED.some((s) => s.toLowerCase().includes("decision"))).toBe(true);
    expect(PILOT_EXCLUDED.some((s) => s.toLowerCase().includes("certification"))).toBe(true);
  });
});
