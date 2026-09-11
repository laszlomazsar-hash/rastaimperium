/**
 * Phase 22 Step 11 — canonical journey integrity.
 */
import { describe, it, expect } from "vitest";
import { ASSURANCE_JOURNEY_STEPS } from "@/components/EvidenceJourneyNav";
import { ASSURANCE_JOURNEY } from "./pilot";
import { getReceipt } from "./receipts";

describe("Public assurance journey consolidation", () => {
  it("canonical nav order is Observe…Decide", () => {
    expect(ASSURANCE_JOURNEY_STEPS.map((s) => s.label)).toEqual([
      "Observe",
      "Inspect",
      "Challenge",
      "Verify",
      "Reproduce",
      "Assess",
      "Crosswalk",
      "Pilot",
      "Decide",
    ]);
  });

  it("every nav step has a public href", () => {
    for (const s of ASSURANCE_JOURNEY_STEPS) {
      expect(s.href.startsWith("/")).toBe(true);
    }
  });

  it("pilot ASSURANCE_JOURNEY still covers Phase 22 surfaces", () => {
    const hrefs = ASSURANCE_JOURNEY.map((j) => j.href).join(" ");
    expect(hrefs).toContain("/proof/");
    expect(hrefs).toContain("/challenge/");
    expect(hrefs).toContain("/verify/");
    expect(hrefs).toContain("/evidence/export/");
    expect(hrefs).toContain("/governance-crosswalk/");
    expect(hrefs).toContain("/institutional-pilots/");
  });

  it("three canonical artifacts remain VERIFIED without production authority", () => {
    for (const id of [
      "ART-L7-REPLAY-001",
      "ART-L7-REJECT-001",
      "ART-L7-PARITY-001",
    ]) {
      const r = getReceipt(id);
      expect(r?.status).toBe("VERIFIED");
      expect(r?.productionAuthority).toBe(false);
    }
  });
});
