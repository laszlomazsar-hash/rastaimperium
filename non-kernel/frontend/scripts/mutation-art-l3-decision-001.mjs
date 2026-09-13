#!/usr/bin/env node
/**
 * Mutation suite for ART-L3-DECISION-001.
 * Works on temporary copies only. NEVER modifies the canonical sealed capsule.
 *
 *   node non-kernel/frontend/scripts/mutation-art-l3-decision-001.mjs
 *
 * All mutations must FAIL verification. Original capsule must remain byte-identical.
 */
import { createHash } from "crypto";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const CANON = join(ROOT, "docs/evidence/artifacts/ART-L3-DECISION-001.json");
const VERIFIER = join(__dirname, "verify-art-l3-decision-001.mjs");

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function runVerifier(path) {
  const r = spawnSync(process.execPath, [VERIFIER, path], { encoding: "utf8" });
  return { status: r.status, stdout: r.stdout, stderr: r.stderr };
}

function cloneCapsule() {
  return JSON.parse(readFileSync(CANON, "utf8"));
}

function writeTemp(obj, name) {
  const p = join(ROOT, `docs/evidence/artifacts/.tmp-mut-${name}.json`);
  writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
  return p;
}

const beforeSha = sha256File(CANON);
const mutations = [];

function mut(id, description, transform) {
  const c = cloneCapsule();
  transform(c);
  const tmp = writeTemp(c, id);
  const result = runVerifier(tmp);
  const failed = result.status !== 0;
  mutations.push({ id, description, verificationFailed: failed, exit: result.status });
  try {
    unlinkSync(tmp);
  } catch (_) {}
  return failed;
}

mut("M-L3-V-01", "Flip expected ALLOW to DENY", (c) => {
  const legal = c.cases.find((x) => x.caseId === "L3-LEGAL-001");
  legal.expected.decision = "DENY";
  legal.expected.reason = "ILLEGAL_TRANSITION";
});

mut("M-L3-V-02", "Change expected reason code", (c) => {
  const illegal = c.cases.find((x) => x.caseId === "L3-ILLEGAL-001");
  illegal.expected.reason = "TRANSITION_PERMITTED";
});

mut("M-L3-V-03", "Add illegal transition to legalTransitions", (c) => {
  c.policySnapshot.legalTransitions.push({
    from_state: "VERIFIED",
    event: "STATE_TRANSITION",
    to_state: "INGESTED",
  });
});

mut("M-L3-V-04", "Remove legal transition", (c) => {
  c.policySnapshot.legalTransitions = c.policySnapshot.legalTransitions.filter(
    (t) => !(t.from_state === "INGESTED" && t.to_state === "NORMALIZED")
  );
});

mut("M-L3-V-05", "Alter expectedResult results order / content", (c) => {
  if (c.expectedResult && c.expectedResult.results) {
    c.expectedResult.results = [...c.expectedResult.results].reverse();
  }
});

mut("M-L3-V-06", "Duplicate caseId", (c) => {
  c.cases.push({ ...c.cases[0], caseId: "L3-LEGAL-001" });
});

mut("M-L3-V-07", "Alter expectedDigest", (c) => {
  c.expectedDigest = "0".repeat(64);
});

mut("M-L3-V-08", "Inject extra semantically relevant field into expectedResult", (c) => {
  c.expectedResult.extraField = "injected";
});

const afterSha = sha256File(CANON);
const allFailed = mutations.every((m) => m.verificationFailed);
const byteIdentical = beforeSha === afterSha;

console.log("ART-L3-DECISION-001 mutation suite");
console.log("Canonical SHA-256 before:", beforeSha);
console.log("Canonical SHA-256 after: ", afterSha);
console.log("Byte-identical:         ", byteIdentical ? "YES" : "NO");
console.log("");
for (const m of mutations) {
  console.log(
    `${m.id}: ${m.verificationFailed ? "PASS (verifier correctly failed)" : "FAIL (verifier did not fail)"} — ${m.description}`
  );
}
console.log("");
console.log(allFailed && byteIdentical ? "MUTATION SUITE: PASS" : "MUTATION SUITE: FAIL");
process.exit(allFailed && byteIdentical ? 0 : 1);
