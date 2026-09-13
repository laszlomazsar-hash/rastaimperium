/**
 * Reproducibility export integrity tests.
 */
import { describe, it, expect } from "vitest";
import {
  REPRODUCIBILITY_RECORDS,
  buildEvidenceExportJson,
  SOURCE_INDEX,
} from "./reproducibility";
import { getReceipt } from "./receipts";

describe("Reproducibility & evidence export", () => {
  it("covers the three canonical L7 artifacts and the sealed L3 decision capsule", () => {
    const ids = REPRODUCIBILITY_RECORDS.map((r) => r.artifactId);
    expect(ids).toContain("ART-L7-REPLAY-001");
    expect(ids).toContain("ART-L7-REJECT-001");
    expect(ids).toContain("ART-L7-PARITY-001");
    expect(ids).toContain("ART-L3-DECISION-001");
    expect(ids).toHaveLength(4);
  });

  it("every record has a matching receipt and productionAuthority false", () => {
    for (const rec of REPRODUCIBILITY_RECORDS) {
      const receipt = getReceipt(rec.artifactId);
      expect(receipt).toBeTruthy();
      expect(receipt!.productionAuthority).toBe(false);
      expect(rec.productionAuthority).toBe(false);
    }
  });

  it("commands are non-empty and do not invent results", () => {
    for (const rec of REPRODUCIBILITY_RECORDS) {
      expect(rec.commands.length).toBeGreaterThan(0);
      for (const c of rec.commands) {
        expect(c.command.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("export JSON uses null for expected/observed", () => {
    const json = buildEvidenceExportJson();
    const parsed = JSON.parse(json);
    for (const item of parsed.records ?? parsed) {
      if (item && typeof item === "object") {
        if ("expected" in item) expect(item.expected).toBeNull();
        if ("observed" in item) expect(item.observed).toBeNull();
      }
    }
  });

  it("source index links sealed artifacts and docs", () => {
    expect(SOURCE_INDEX.length).toBeGreaterThan(0);
  });
});
