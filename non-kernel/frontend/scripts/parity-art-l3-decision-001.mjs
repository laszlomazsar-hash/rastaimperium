#!/usr/bin/env node
/**
 * Parity gate: Node result == Python result == sealed expectedDigest.
 *
 *   node non-kernel/frontend/scripts/parity-art-l3-decision-001.mjs
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const CAPSULE = join(ROOT, "docs/evidence/artifacts/ART-L3-DECISION-001.json");
const NODE_V = join(__dirname, "verify-art-l3-decision-001.mjs");
const PY_V = join(ROOT, "scripts/verify_art_l3_decision_001.py");

function run(cmd, args) {
  return spawnSync(cmd, args, { encoding: "utf8" });
}

const capsule = JSON.parse(readFileSync(CAPSULE, "utf8"));
const sealed = capsule.expectedDigest;

const node = run(process.execPath, [NODE_V, CAPSULE]);
const py = run("python3", [PY_V, CAPSULE]);

function extractDigest(stdout) {
  const m = stdout.match(/Observed Digest:\s+(\S+)/);
  return m ? m[1] : null;
}

const nodeDigest = extractDigest(node.stdout || "");
const pyDigest = extractDigest(py.stdout || "");

console.log("Parity report — ART-L3-DECISION-001");
console.log("Sealed expectedDigest:", sealed);
console.log("Node exit:            ", node.status, "digest:", nodeDigest);
console.log("Python exit:          ", py.status, "digest:", pyDigest);

const ok =
  node.status === 0 &&
  py.status === 0 &&
  nodeDigest === sealed &&
  pyDigest === sealed &&
  nodeDigest === pyDigest;

console.log("Parity:               ", ok ? "PASS" : "FAIL");
process.exit(ok ? 0 : 1);
