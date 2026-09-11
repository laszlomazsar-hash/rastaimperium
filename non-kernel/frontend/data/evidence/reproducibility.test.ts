/**
 * Reproducibility integrity tests — Phase 22 Step 9.
 */
import { describe, it, expect } from "vitest";
import {
  EVIDENCE_SOURCE_INDEX,
  assertReceiptCoverage,
  getReproducibilityRecord,
  listReproducibilityRecords,
  toExportJson,
} from "./reproducibility";
import { getReceipt } from "./receipts";

describe("Reproducibility & evidence export", () => {
  it("covers all three canonical L7 artifacts", () => {
    const ids = listReproducibilityRecords().map((r) => r.artifactId);
    expect(ids).toContain("ART-L7-REPLAY-001");
    expect(ids).toContain("ART-L7-REJECT-001");
    expect(ids).toContain("ART-L7-PARITY-001");
    expect(ids).toHaveLength(3);
  });

  it("every record has a matching receipt and productionAuthority false", () => {
    expect(assertReceiptCoverage()).toBe(true);
    for (const r of listReproducibilityRecords()) {
      expect(r.productionAuthority).toBe(false);
      expect(getReceipt(r.artifactId)?.status).toBe(r.status);
      expect(r.expected).toBeUndefined();
      expect(r.observed).toBeUndefined();
    }
  });

  it("commands are non-empty and do not invent results", () => {
    for (const r of listReproducibilityRecords()) {
      expect(r.command.length).toBeGreaterThan(10);
      expect(r.command.toLowerCase()).not.toMatch(/exit 0 guaranteed|always pass/);
    }
  });

  it("export JSON uses null for expected/observed", () => {
    const r = getReproducibilityRecord("ART-L7-REJECT-001")!;
    const j = toExportJson(r);
    expect(j.expected).toBeNull();
    expect(j.observed).toBeNull();
    expect(j.productionAuthority).toBe(false);
    expect(j.reproduction.command).toContain("verify-art-l7-reject");
  });

  it("source index links sealed artifacts and docs", () => {
    const hrefs = EVIDENCE_SOURCE_INDEX.map((x) => x.href).join(" ");
    expect(hrefs).toContain("ART-L7-REPLAY-001");
    expect(hrefs).toContain("REPRODUCE_OFFLINE");
    expect(hrefs).toContain("EVIDENCE_MANIFEST");
  });
});
