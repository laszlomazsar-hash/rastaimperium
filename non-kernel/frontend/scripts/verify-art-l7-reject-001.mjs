#!/usr/bin/env node
/**
 * Independent reproduction for ART-L7-REJECT-001 (illegal transition rejection).
 * No website UI dependency.
 *
 *   node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs
 *   node non-kernel/frontend/scripts/verify-art-l7-reject-001.mjs path/to/ART-L7-REJECT-001.json
 *
 * Exit 0 = independent rejection matches sealed receipt.
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
      const err = new Error(`illegal transition ${st}->${t}`);
      err.code = "ILLEGAL_TRANSITION";
      err.from = st;
      err.to = t;
      throw err;
    }
    next.lifecycle_state = t;
  } else if (event.event_type === "COMMIT_FINALIZED") {
    next.commit_finalized = true;
  } else {
    throw new Error(`unsupported event_type ${event.event_type}`);
  }
  return next;
}

function run(capsule) {
  let state = structuredClone(capsule.initial_state);
  let rejection = null;
  let index = 0;
  for (const event of capsule.events) {
    try {
      state = reduceEvent(state, event);
      index++;
    } catch (e) {
      rejection = {
        rejected: true,
        rejection_index: index,
        rejection_code: e.code || "REJECT",
        rejection_message: e.message,
        from_state: e.from,
        to_state: e.to,
        state_before_reject: state,
      };
      break;
    }
  }
  if (!rejection) {
    return { pass: false, reason: "expected rejection did not occur" };
  }

  const state_before_hash = sha256Hex(canonicalize(rejection.state_before_reject));
  let head = "GENESIS";
  for (const event of capsule.events) {
    head = sha256Hex(`${head}|${canonicalize(event)}`);
  }
  const receipt_payload = {
    version_bundle: capsule.version_bundle,
    event_count: capsule.events.length,
    rejection_index: rejection.rejection_index,
    rejection_code: rejection.rejection_code,
    rejection_message: rejection.rejection_message,
    from_state: rejection.from_state,
    to_state: rejection.to_state,
    state_before_hash,
    attempted_ledger_head: head,
    state_mutated: false,
  };
  const receipt_hash = sha256Hex(canonicalize(receipt_payload));

  const exp = capsule.expected;
  const checks = {
    rejected: rejection.rejected === exp.rejected,
    rejection_index: rejection.rejection_index === exp.rejection_index,
    rejection_code: rejection.rejection_code === exp.rejection_code,
    rejection_message: rejection.rejection_message === exp.rejection_message,
    from_state: rejection.from_state === exp.from_state,
    to_state: rejection.to_state === exp.to_state,
    state_before_hash: state_before_hash === exp.state_before_hash,
    attempted_ledger_head: head === exp.attempted_ledger_head,
    receipt_hash: receipt_hash === exp.receipt_hash,
    state_mutated: exp.state_mutated === false,
  };

  return {
    artifactId: capsule.artifactId,
    pass: Object.values(checks).every(Boolean),
    checks,
    computed: {
      state_before_hash,
      attempted_ledger_head: head,
      receipt_hash,
      rejection_code: rejection.rejection_code,
      rejection_message: rejection.rejection_message,
    },
    expected: exp,
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const defaultPath = join(here, "../data/evidence/artifacts/ART-L7-REJECT-001.json");
const path = process.argv[2] || defaultPath;

let capsule;
try {
  capsule = JSON.parse(readFileSync(path, "utf8"));
} catch (err) {
  console.error("FAIL: cannot read capsule", path, err.message);
  process.exit(1);
}

if (capsule.artifactId !== "ART-L7-REJECT-001") {
  console.error("FAIL: unexpected artifactId", capsule.artifactId);
  process.exit(1);
}

const result = run(capsule);
console.log(JSON.stringify(result, null, 2));
process.exit(result.pass ? 0 : 1);
