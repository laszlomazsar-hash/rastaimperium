/**
 * Evaluator Console integrity tests.
 * Phase 22 Step 7.
 */
import { describe, it, expect } from "vitest";
import {
  EVALUATOR_ARTIFACTS,
  EVALUATOR_CHECKLIST,
  EVALUATOR_STAGES,
  getEvaluatorStage,
  listEvaluatorStages,
} from "./evaluator";
import { getReceipt } from "./receipts";
import { getChallengeLabRecord, CANONICAL_CHALLENGE_ID } from "./challenges";

describe("Evaluator Console — workflow integrity", () => {
  it("exposes seven ordered stages", () => {
    const stages = listEvaluatorStages();
    expect(stages).toHaveLength(7);
    expect(stages.map((s) => s.id)).toEqual([
      "define",
      "inspect",
      "challenge",
      "verify",
      "assess",
      "pilot",
      "decide",
    ]);
  });

  it("every stage has a non-empty destination href", () => {
    for (const s of EVALUATOR_STAGES) {
      expect(s.href.length).toBeGreaterThan(0);
      expect(s.linkLabel.length).toBeGreaterThan(0);
    }
  });

  it("links challenge stage to Challenge Lab", () => {
    const c = getEvaluatorStage("challenge");
    expect(c?.href).toBe("/challenge/");
  });

  it("links verify stage to Verify console", () => {
    expect(getEvaluatorStage("verify")?.href).toBe("/verify/");
  });

  it("links inspect stage to Proof Registry", () => {
    expect(getEvaluatorStage("inspect")?.href).toBe("/proof/");
  });

  it("canonical artifacts match sealed receipts", () => {
    for (const a of EVALUATOR_ARTIFACTS) {
      const r = getReceipt(a.artifactId);
      expect(r).toBeDefined();
      expect(r!.productionAuthority).toBe(false);
      expect(r!.status).toBe("VERIFIED");
    }
  });

  it("canonical challenge remains CHAL-ILLEGAL-TRANSITION-001", () => {
    const chal = getChallengeLabRecord(CANONICAL_CHALLENGE_ID);
    expect(chal).toBeDefined();
    expect(chal!.artifactId).toBe("ART-L7-REJECT-001");
  });

  it("checklist does not encode scores or compliance claims", () => {
    const blob = JSON.stringify(EVALUATOR_CHECKLIST).toLowerCase();
    expect(blob).not.toMatch(/score|percent|compliant|certified|safe|ready/);
    expect(EVALUATOR_CHECKLIST.length).toBeGreaterThanOrEqual(8);
  });

  it("workflow language avoids assurance-score vocabulary", () => {
    const blob = JSON.stringify(EVALUATOR_STAGES).toLowerCase();
    expect(blob).not.toMatch(/\d+%|trust score|risk score|production ready|certified/);
  });
});
