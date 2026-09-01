#!/usr/bin/env node
/**
 * Independent reproduction for ART-L7-REPLAY-001.
 * Does not import the website UI or trust its claims.
 *
 * Usage:
 *   node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs
 *   node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs path/to/ART-L7-REPLAY-001.json
 *
 * Exit 0 = sealed hashes reproduced independently.
 * Exit 1 = mismatch or error.
 */

import { createHash } from "crypto";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ALLOWED = {
  INGESTED: new Set(["NORMALIZED"]),
  NORMALIZED: new Set(["VERIFIED"]),
  VERIFIED: new Set(["CORRELATED"]),
  CORRELATED: new Set(["ARCHIVED"]),
  ARCHIVED: new Set(),
  CONTESTED: new Set(),
};

function canonicalize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(",")}}`;
}

function sha256Hex(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function reduceEvent(state, event) {
  const next = {
    lifecycle_state: state.lifecycle_state,
    records: { ...state.records },
    commit_finalized: state.commit_finalized,
  };
  if (event.event_type === "RECORD_INSERT") {
    if (next.records[event.record_id]) throw new Error("duplicate record_id");
    next.records[event.record_id] = event.payload;
  } else if (event.event_type === "STATE_TRANSITION") {
    const st = next.lifecycle_state;
    const t = event.to_state;
    if (!(t === "CONTESTED" || ALLOWED[st]?.has(t))) {
      throw new Error(`illegal transition ${st}->${t}`);
    }
    next.lifecycle_state = t;
  } else if (event.event_type === "COMMIT_FINALIZED") {
    next.commit_finalized = true;
  } else {
    throw new Error(`unsupported event_type ${event.event_type}`);
  }
  return next;
}

function replay(events, initial) {
  let state = structuredClone(initial);
  for (const event of events) state = reduceEvent(state, event);
  return state;
}

function ledgerHead(events) {
  let head = "GENESIS";
  for (const event of events) {
    head = sha256Hex(`${head}|${canonicalize(event)}`);
  }
  return head;
}

function verify(capsule) {
  const runA = replay(capsule.events, capsule.initial_state);
  const runB = replay(capsule.events, capsule.initial_state);
  const stateHashA = sha256Hex(canonicalize(runA));
  const stateHashB = sha256Hex(canonicalize(runB));
  const ledger_head_hash = ledgerHead(capsule.events);
  const receipt_payload = {
    version_bundle: capsule.version_bundle,
    event_count: capsule.events.length,
    state_hash: stateHashA,
    ledger_head_hash,
    terminal_lifecycle: runA.lifecycle_state,
    commit_finalized: runA.commit_finalized,
  };
  const receipt_hash = sha256Hex(canonicalize(receipt_payload));

  const checks = {
    independent_parity: stateHashA === stateHashB,
    state_hash: stateHashA === capsule.expected.state_hash,
    ledger_head_hash: ledger_head_hash === capsule.expected.ledger_head_hash,
    receipt_hash: receipt_hash === capsule.expected.receipt_hash,
    terminal_lifecycle: runA.lifecycle_state === capsule.expected.terminal_lifecycle,
    commit_finalized: runA.commit_finalized === capsule.expected.commit_finalized,
  };

  return {
    artifactId: capsule.artifactId,
    pass: Object.values(checks).every(Boolean),
    checks,
    computed: {
      state_hash: stateHashA,
      receipt_hash,
      ledger_head_hash,
    },
    expected: capsule.expected,
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const defaultPath = join(here, "../data/evidence/artifacts/ART-L7-REPLAY-001.json");
const path = process.argv[2] || defaultPath;

let capsule;
try {
  capsule = JSON.parse(readFileSync(path, "utf8"));
} catch (err) {
  console.error("FAIL: cannot read capsule", path, err.message);
  process.exit(1);
}

if (capsule.artifactId !== "ART-L7-REPLAY-001") {
  console.error("FAIL: unexpected artifactId", capsule.artifactId);
  process.exit(1);
}

const result = verify(capsule);
console.log(JSON.stringify(result, null, 2));
process.exit(result.pass ? 0 : 1);
