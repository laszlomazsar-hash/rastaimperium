#!/usr/bin/env node
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";
const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE = join(__dirname, "../../../docs/evidence/artifacts/ART-OPS-RUNTIME-REF-001.json");
const NODE_V = join(__dirname, "verify-art-ops-runtime-001.mjs");
const PY_V = join(__dirname, "verify_art_ops_runtime_001.py");
const TMP = join(__dirname, "../../../docs/evidence/artifacts/.mutation-ops-runtime-tmp.json");
const originalBytes = readFileSync(FIXTURE);
const original = JSON.parse(originalBytes.toString("utf8"));
function run(path) {
  const n = spawnSync("node", [NODE_V, path], { encoding: "utf8" });
  const p = spawnSync("python3", [PY_V, path], { encoding: "utf8" });
  return { node: n.status, python: p.status };
}
function mustFail(name, mutator) {
  const clone = JSON.parse(JSON.stringify(original)); mutator(clone);
  writeFileSync(TMP, JSON.stringify(clone, null, 2) + "\n");
  const r = run(TMP); const ok = r.node !== 0 && r.python !== 0;
  console.log(ok ? "PASS" : "FAIL", name); return ok;
}
const results = [];
{ const r = run(FIXTURE); results.push(r.node === 0 && r.python === 0); console.log(results.at(-1) ? "PASS" : "FAIL", "clean"); }
results.push(mustFail("payload", c => { c.payload = { ...c.payload, note: "x" }; }));
results.push(mustFail("digest", c => { c.integrity.digest = "0".repeat(64); }));
results.push(mustFail("eventId", c => { c.eventId = "t"; }));
results.push(mustFail("producerId", c => { c.producerId = "evil"; }));
results.push(mustFail("eventType", c => { c.eventType = "FAKE"; }));
results.push(mustFail("observedAt", c => { c.observedAt = "1999-01-01T00:00:00.000Z"; }));
results.push(mustFail("sequence", c => { c.sequence = 0; }));
results.push(mustFail("unknown", c => { c.eventType = "X"; }));
results.push(mustFail("missing", c => { delete c.scope; }));
results.push(mustFail("pa-true", c => { c.productionAuthority = true; }));
try { unlinkSync(TMP); } catch {}
results.push(Buffer.compare(originalBytes, readFileSync(FIXTURE)) === 0);
console.log(results.every(Boolean) ? "MUTATION SUITE: PASS" : "MUTATION SUITE: FAIL");
process.exit(results.every(Boolean) ? 0 : 1);
