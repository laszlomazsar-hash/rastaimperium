#!/usr/bin/env node
/**
 * Reproducibility CI gate — executable documentation contract.
 *
 * Runs the SAME commands published to external evaluators:
 *
 *   node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
 *   python3 non-kernel/frontend/scripts/verify_art_l7_replay_001.py
 *   node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
 *   python3 non-kernel/frontend/scripts/verify_art_l7_reject_001.py
 *   node non-kernel/frontend/scripts/parity-art-l7.mjs
 *
 * Asserts exit 0 and that sealed capsule files are byte-identical after runs.
 * No network. Does not modify evidence.
 */

import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(__dirname, "..");
const repoRoot = resolve(frontendRoot, "../..");

const errors = [];

const sealedPaths = [
  "non-kernel/frontend/data/evidence/artifacts/ART-L7-REPLAY-001.json",
  "non-kernel/frontend/data/evidence/artifacts/ART-L7-REJECT-001.json",
  "non-kernel/frontend/data/evidence/artifacts/ART-L7-PARITY-001.json",
  "non-kernel/frontend/public/evidence/artifacts/ART-L7-REPLAY-001.json",
  "non-kernel/frontend/public/evidence/artifacts/ART-L7-REJECT-001.json",
  "non-kernel/frontend/public/evidence/artifacts/ART-L7-PARITY-001.json",
];

function sha256(absPath) {
  return createHash("sha256").update(readFileSync(absPath)).digest("hex");
}

function snapshot() {
  const map = new Map();
  for (const rel of sealedPaths) {
    const abs = join(repoRoot, rel);
    if (!existsSync(abs)) {
      errors.push(`missing sealed path: ${rel}`);
      continue;
    }
    map.set(rel, sha256(abs));
  }
  return map;
}

function run(label, cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, // no extra network secrets
    },
  });
  if (r.status !== 0) {
    errors.push(
      `${label}: exit ${r.status}\nstdout:\n${(r.stdout || "").slice(0, 800)}\nstderr:\n${(r.stderr || "").slice(0, 400)}`,
    );
    return null;
  }
  let parsed = null;
  try {
    parsed = JSON.parse((r.stdout || "").trim());
  } catch {
    // parity and verifiers emit JSON; soft-fail parse only if needed later
  }
  if (parsed && parsed.pass === false) {
    errors.push(`${label}: JSON pass===false`);
  }
  return parsed;
}

const before = snapshot();

// Exact documented command set (repository root cwd)
run("REPLAY Node", "node", [
  "non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs",
]);
run("REPLAY Python", "python3", [
  "non-kernel/frontend/scripts/verify_art_l7_replay_001.py",
]);
run("REJECT Node", "node", [
  "non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs",
]);
run("REJECT Python", "python3", [
  "non-kernel/frontend/scripts/verify_art_l7_reject_001.py",
]);
const parity = run("PARITY gate", "node", [
  "non-kernel/frontend/scripts/parity-art-l7.mjs",
]);
if (parity && parity.pass !== true) {
  errors.push("PARITY gate: report.pass is not true");
}

const after = snapshot();
for (const rel of sealedPaths) {
  if (!before.has(rel) || !after.has(rel)) continue;
  if (before.get(rel) !== after.get(rel)) {
    errors.push(`sealed evidence mutated during reproducibility run: ${rel}`);
  }
}

if (errors.length) {
  console.error("Reproducibility gate FAILED");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log(
  "Reproducibility OK — Node+Python REPLAY/REJECT + parity exit 0; sealed capsules immutable",
);
