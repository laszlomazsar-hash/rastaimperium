#!/usr/bin/env node
/**
 * Pure offline verifier for ART-L3-DECISION-001 (INV-L3-001).
 * No network. No live policy. No application imports. UI is not the authority.
 *
 *   node non-kernel/frontend/scripts/verify-art-l3-decision-001.mjs
 *   node non-kernel/frontend/scripts/verify-art-l3-decision-001.mjs path/to/ART-L3-DECISION-001.json
 *
 * Exit 0 only when all cases match and observedDigest === sealed expectedDigest.
 */
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function canonicalize(value) {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("rejectNonFiniteNumbers");
    return JSON.stringify(value);
  }
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`;
  }
  throw new Error(`unsupported type ${typeof value}`);
}

function sha256Hex(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function evaluate(request, policySnapshot) {
  if (
    request === null ||
    typeof request !== "object" ||
    Array.isArray(request) ||
    typeof request.from_state !== "string" ||
    typeof request.event !== "string" ||
    typeof request.to_state !== "string" ||
    request.from_state === "" ||
    request.event === "" ||
    request.to_state === ""
  ) {
    return { decision: "DENY", reason: "INVALID_REQUEST" };
  }
  const states = policySnapshot.states || [];
  const events = policySnapshot.events || [];
  const legal = policySnapshot.legalTransitions || [];
  if (!states.includes(request.from_state)) {
    return { decision: "DENY", reason: "UNKNOWN_STATE" };
  }
  if (!states.includes(request.to_state)) {
    return { decision: "DENY", reason: "UNKNOWN_STATE" };
  }
  if (!events.includes(request.event)) {
    return { decision: "DENY", reason: "UNKNOWN_EVENT" };
  }
  const ok = legal.some(
    (t) =>
      t.from_state === request.from_state &&
      t.event === request.event &&
      t.to_state === request.to_state
  );
  if (ok) return { decision: "ALLOW", reason: "TRANSITION_PERMITTED" };
  return { decision: "DENY", reason: "ILLEGAL_TRANSITION" };
}

function verify(capsule) {
  if (!capsule || capsule.artifactId !== "ART-L3-DECISION-001") {
    return { pass: false, reason: "artifactId mismatch" };
  }
  if (capsule.invariantId !== "INV-L3-001") {
    return { pass: false, reason: "invariantId mismatch" };
  }
  if (capsule.productionAuthority !== false) {
    return { pass: false, reason: "productionAuthority must be false" };
  }
  if (!capsule.policySnapshot || !Array.isArray(capsule.cases)) {
    return { pass: false, reason: "missing policySnapshot or cases" };
  }
  if (!capsule.expectedDigest || typeof capsule.expectedDigest !== "string") {
    return { pass: false, reason: "missing expectedDigest" };
  }

  const caseIds = new Set();
  const results = [];
  for (const c of capsule.cases) {
    if (!c.caseId || caseIds.has(c.caseId)) {
      return { pass: false, reason: `duplicate or missing caseId: ${c.caseId}` };
    }
    caseIds.add(c.caseId);
    const got = evaluate(c.request, capsule.policySnapshot);
    if (got.decision !== c.expected.decision || got.reason !== c.expected.reason) {
      return {
        pass: false,
        reason: `case ${c.caseId}: expected ${c.expected.decision}/${c.expected.reason} got ${got.decision}/${got.reason}`,
      };
    }
    results.push({ caseId: c.caseId, decision: got.decision, reason: got.reason });
  }

  const observedResult = {
    schemaVersion: "ri-l3-result-1.0.0",
    artifactId: "ART-L3-DECISION-001",
    invariantId: "INV-L3-001",
    results,
  };
  const observedDigest = sha256Hex(canonicalize(observedResult));

  if (observedDigest !== capsule.expectedDigest) {
    return {
      pass: false,
      reason: "digest mismatch",
      expectedDigest: capsule.expectedDigest,
      observedDigest,
      observedResult,
    };
  }

  if (capsule.expectedResult) {
    const sealedCanon = canonicalize(capsule.expectedResult);
    const sealedDigest = sha256Hex(sealedCanon);
    if (sealedDigest !== capsule.expectedDigest) {
      return { pass: false, reason: "expectedResult does not match expectedDigest" };
    }
  }

  return {
    pass: true,
    expectedDigest: capsule.expectedDigest,
    observedDigest,
    observedResult,
  };
}

function main() {
  const defaultPath = join(__dirname, "../../../docs/evidence/artifacts/ART-L3-DECISION-001.json");
  const path = process.argv[2] || defaultPath;
  let capsule;
  try {
    capsule = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    console.error("FAIL: cannot read capsule:", e.message);
    process.exit(1);
  }

  const result = verify(capsule);
  console.log("Artifact:           ART-L3-DECISION-001");
  console.log("Invariant:          INV-L3-001");
  console.log("Verifier:           node/verify-art-l3-decision-001.mjs");
  console.log("Expected Digest:   ", result.expectedDigest || capsule.expectedDigest);
  console.log("Observed Digest:   ", result.observedDigest || "(n/a)");
  console.log("Status:            ", result.pass ? "PASS" : "FAIL");
  console.log("Scope:              Capsule-scoped deterministic L3 decision fixture");
  console.log("Production Authority: NOT ESTABLISHED (false)");
  console.log("Limitations:        Not production enforcement; not full EVO-V runtime; not L4/L5/L6/L8");
  if (!result.pass) {
    console.error("Reason:", result.reason);
    process.exit(1);
  }
  process.exit(0);
}

main();
