#!/usr/bin/env node
/**
 * Phase 10 — Independent Challenge battery (Level 4).
 * Probes frozen L7 capsules without mutating them.
 * Exit 0 = all challenges behaved as designed.
 *
 *   node non-kernel/frontend/scripts/challenge-art-l7.mjs
 *   node non-kernel/frontend/scripts/challenge-art-l7.mjs replay.json reject.json
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

function replay(events, initial) {
  let state = structuredClone(initial);
  for (const event of events) state = reduceEvent(state, event);
  return state;
}

const here = dirname(fileURLToPath(import.meta.url));
const defaultReplay = join(here, "../data/evidence/artifacts/ART-L7-REPLAY-001.json");
const defaultReject = join(here, "../data/evidence/artifacts/ART-L7-REJECT-001.json");

const replayPath = process.argv[2] || defaultReplay;
const rejectPath = process.argv[3] || defaultReject;

const capsule = JSON.parse(readFileSync(replayPath, "utf8"));
const reject = JSON.parse(readFileSync(rejectPath, "utf8"));

if (capsule.artifactId !== "ART-L7-REPLAY-001" || reject.artifactId !== "ART-L7-REJECT-001") {
  console.error("FAIL: unexpected artifact ids");
  process.exit(1);
}

const results = [];

function check(id, expect, pass) {
  results.push({ id, expect, pass: !!pass });
}

// C1 — order permutation must diverge from sealed state hash
{
  const ev = structuredClone(capsule.events);
  if (ev.length >= 3) [ev[1], ev[2]] = [ev[2], ev[1]];
  let diverged = false;
  try {
    const h = sha256Hex(canonicalize(replay(ev, capsule.initial_state)));
    diverged = h !== capsule.expected.state_hash;
  } catch {
    diverged = true;
  }
  check("C1-ORDER-PERMUTATION", "permuted order diverges or rejects", diverged);
}

// C2 — tampered expected hash must not equal true computation
{
  const trueHash = sha256Hex(canonicalize(replay(capsule.events, capsule.initial_state)));
  const tampered =
    capsule.expected.state_hash.slice(0, -1) +
    (capsule.expected.state_hash.endsWith("0") ? "1" : "0");
  check(
    "C2-TAMPERED-EXPECTED",
    "computed matches seal and differs from tampered",
    trueHash === capsule.expected.state_hash && trueHash !== tampered
  );
}

// C3 — illegal edge must reject
{
  let rejected = false;
  try {
    replay(reject.events, reject.initial_state);
  } catch {
    rejected = true;
  }
  check("C3-ILLEGAL-EDGE", "VERIFIED→INGESTED rejects", rejected);
}

// C4 — canonicalization key-order independence
{
  check(
    "C4-CANON-KEY-ORDER",
    "canonicalize({b,a}) === canonicalize({a,b})",
    canonicalize({ b: 1, a: 2 }) === canonicalize({ a: 2, b: 1 })
  );
}

// C5 — stable hash under state key reorder
{
  const s = replay(capsule.events, capsule.initial_state);
  const reordered = {
    commit_finalized: s.commit_finalized,
    lifecycle_state: s.lifecycle_state,
    records: s.records,
  };
  const ok =
    canonicalize(s) === canonicalize(reordered) &&
    sha256Hex(canonicalize(s)) === capsule.expected.state_hash;
  check("C5-CANON-STABLE", "reordered keys still match sealed hash", ok);
}

// C6 — empty stream must not match sealed terminal
{
  const h = sha256Hex(canonicalize(replay([], capsule.initial_state)));
  check("C6-EMPTY-STREAM", "empty stream ≠ sealed terminal", h !== capsule.expected.state_hash);
}

// C7 — duplicate insert rejected
{
  let rejected = false;
  try {
    replay(
      [
        { event_type: "RECORD_INSERT", record_id: "r1", payload: { n: 1 } },
        { event_type: "RECORD_INSERT", record_id: "r1", payload: { n: 2 } },
      ],
      capsule.initial_state
    );
  } catch {
    rejected = true;
  }
  check("C7-DUPLICATE-INSERT", "duplicate record_id rejects", rejected);
}

const pass = results.every((r) => r.pass);
console.log(
  JSON.stringify(
    {
      suite: "phase10-l7-adversarial-v1",
      frozen_artifacts: ["ART-L7-REPLAY-001", "ART-L7-REJECT-001"],
      pass,
      results,
      notes:
        "Does not claim production security. Does not mutate frozen artifacts. Not LIVE evidence.",
    },
    null,
    2
  )
);
process.exit(pass ? 0 : 1);
