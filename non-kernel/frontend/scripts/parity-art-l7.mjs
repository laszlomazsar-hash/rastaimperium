#!/usr/bin/env node
/**
 * Cross-implementation parity for frozen L7 capsules.
 * Runs Node and Python verifiers on the SAME sealed artifacts.
 * Does not trust the website UI.
 *
 *   node non-kernel/frontend/scripts/parity-art-l7.mjs
 *
 * Exit 0 only if both implementations pass both capsules and computed hashes match.
 */

import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  let parsed = null;
  try {
    parsed = JSON.parse((r.stdout || "").trim().split("\n").filter(Boolean).slice(-1)[0] || r.stdout);
  } catch {
    /* leave null */
  }
  return {
    status: r.status,
    stdout: r.stdout,
    stderr: r.stderr,
    parsed,
  };
}

const cases = [
  {
    id: "ART-L7-REPLAY-001",
    node: ["node", join(here, "verify-art-l7-replay-001.mjs")],
    py: ["python3", join(here, "verify_art_l7_replay_001.py")],
    hashKeys: ["state_hash", "receipt_hash", "ledger_head_hash"],
  },
  {
    id: "ART-L7-REJECT-001",
    node: ["node", join(here, "verify-art-l7-reject-001.mjs")],
    py: ["python3", join(here, "verify_art_l7_reject_001.py")],
    hashKeys: ["state_before_hash", "attempted_ledger_head", "receipt_hash"],
  },
];

const report = { cases: [], pass: true };

for (const c of cases) {
  const nodeR = run(c.node[0], c.node.slice(1));
  const pyR = run(c.py[0], c.py.slice(1));
  const nodePass = nodeR.status === 0 && nodeR.parsed?.pass === true;
  const pyPass = pyR.status === 0 && pyR.parsed?.pass === true;
  const hashMatch = {};
  let hashesAgree = true;
  for (const k of c.hashKeys) {
    const a = nodeR.parsed?.computed?.[k];
    const b = pyR.parsed?.computed?.[k];
    hashMatch[k] = a != null && b != null && a === b;
    if (!hashMatch[k]) hashesAgree = false;
  }
  const casePass = nodePass && pyPass && hashesAgree;
  if (!casePass) report.pass = false;
  report.cases.push({
    artifactId: c.id,
    node_pass: nodePass,
    python_pass: pyPass,
    hashes_agree: hashesAgree,
    hashMatch,
    node_computed: nodeR.parsed?.computed ?? null,
    python_computed: pyR.parsed?.computed ?? null,
    pass: casePass,
  });
}

console.log(JSON.stringify(report, null, 2));
process.exit(report.pass ? 0 : 1);
