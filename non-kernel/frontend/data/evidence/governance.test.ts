/**
 * Governance crosswalk integrity tests — Phase 22 Step 8.
 */
import { describe, it, expect } from "vitest";
import {
  FRAMEWORKS,
  GOVERNANCE_MAPPINGS,
  getFramework,
  listGovernanceMappings,
  mappingsGaps,
  mappingsWithEvidence,
} from "./governance";
import { getReceipt } from "./receipts";

describe("Governance Evidence Crosswalk", () => {
  it("every framework has name, version, reference, URL, and review date", () => {
    for (const f of FRAMEWORKS) {
      expect(f.name.length).toBeGreaterThan(0);
      expect(f.version.length).toBeGreaterThan(0);
      expect(f.referenceId.length).toBeGreaterThan(0);
      expect(f.sourceUrl.startsWith("http")).toBe(true);
      expect(f.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("every mapping has rationale and NOT_ASSESSED compliance", () => {
    for (const m of listGovernanceMappings()) {
      expect(m.rationale.length).toBeGreaterThan(20);
      expect(m.complianceAssessment).toBe("NOT_ASSESSED");
      expect(m.productionAuthority).toBe(false);
      expect(m.whatItDoesNotEstablish.length).toBeGreaterThan(10);
    }
  });

  it("never uses compliance/certification alignment labels", () => {
    const blob = JSON.stringify(GOVERNANCE_MAPPINGS).toLowerCase();
    expect(blob).not.toMatch(
      /"compliant"|"certified"|"conformant"|"approved"|"passed"/
    );
    for (const m of GOVERNANCE_MAPPINGS) {
      expect([
        "ALIGNED",
        "PARTIALLY_RELEVANT",
        "NOT_ESTABLISHED",
        "NOT_APPLICABLE",
      ]).toContain(m.alignment);
    }
  });

  it("artifact references resolve to sealed receipts", () => {
    for (const m of mappingsWithEvidence()) {
      expect(m.artifactId).toBeDefined();
      const r = getReceipt(m.artifactId!);
      expect(r).toBeDefined();
      expect(r!.productionAuthority).toBe(false);
      expect(m.evidenceStatus).toBe(r!.status);
    }
  });

  it("exposes explicit evidence gaps", () => {
    const gaps = mappingsGaps();
    expect(gaps.length).toBeGreaterThanOrEqual(2);
    expect(gaps.some((g) => g.id.includes("iso"))).toBe(true);
    expect(gaps.some((g) => g.id.includes("production") || g.id.includes("eu"))).toBe(
      true
    );
  });

  it("framework ids on mappings resolve", () => {
    for (const m of GOVERNANCE_MAPPINGS) {
      expect(getFramework(m.frameworkId)).toBeDefined();
    }
  });

  it("does not invent score vocabulary", () => {
    const blob = JSON.stringify({ FRAMEWORKS, GOVERNANCE_MAPPINGS }).toLowerCase();
    expect(blob).not.toMatch(/\d+%|governance score|nist score|compliance score/);
  });
});
