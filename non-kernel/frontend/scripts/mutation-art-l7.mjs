#!/usr/bin/env node
/**
 * Phase 10.1 — Mutation-driven challenge framework.
 * Operates on COPIES of frozen capsules. Never writes originals.
 *
 *   node non-kernel/frontend/scripts/mutation-art-l7.mjs [replay.json] [reject.json]
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
function sha256Hex(s) {
  return createHash("sha256").update(s, "utf8").digest("hex");
}
function fileHash(buf) {
  return createHash("sha256").update(buf).digest("hex");
}
function deepClone(x) {
  return JSON.parse(JSON.stringify(x));
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
  } else throw new Error(`unsupported event_type ${event.event_type}`);
  return next;
}
function replay(events, initial) {
  let state = deepClone(initial);
  for (const event of events) state = reduceEvent(state, event);
  return state;
}
function verifyReplayCapsule(capsule) {
  try {
    const a = replay(capsule.events, capsule.initial_state);
    const b = replay(capsule.events, capsule.initial_state);
    const stateHash = sha256Hex(canonicalize(a));
    if (stateHash !== sha256Hex(canonicalize(b))) return { ok: false, reason: "parity" };
    let head = "GENESIS";
    for (const e of capsule.events) head = sha256Hex(`${head}|${canonicalize(e)}`);
    const receipt = {
      version_bundle: capsule.version_bundle,
      event_count: capsule.events.length,
      state_hash: stateHash,
      ledger_head_hash: head,
      terminal_lifecycle: a.lifecycle_state,
      commit_finalized: a.commit_finalized,
    };
    const receipt_hash = sha256Hex(canonicalize(receipt));
    const exp = capsule.expected;
    const match =
      stateHash === exp.state_hash &&
      head === exp.ledger_head_hash &&
      receipt_hash === exp.receipt_hash &&
      a.lifecycle_state === exp.terminal_lifecycle &&
      a.commit_finalized === exp.commit_finalized;
    return { ok: match, reason: match ? "match" : "mismatch" };
  } catch (e) {
    return { ok: false, reason: "throw:" + e.message };
  }
}
function verifyRejectCapsule(capsule) {
  try {
    let state = deepClone(capsule.initial_state);
    let rejected = false;
    let rejIdx = 0;
    let fromS, toS, msg;
    for (let i = 0; i < capsule.events.length; i++) {
      try {
        state = reduceEvent(state, capsule.events[i]);
      } catch (e) {
        rejected = true;
        rejIdx = i;
        msg = e.message;
        const m = /^illegal transition (.+)->(.+)$/.exec(e.message);
        if (m) {
          fromS = m[1];
          toS = m[2];
        }
        break;
      }
    }
    if (!rejected) return { ok: false, reason: "no_reject" };
    const state_before_hash = sha256Hex(canonicalize(state));
    let head = "GENESIS";
    for (const e of capsule.events) head = sha256Hex(`${head}|${canonicalize(e)}`);
    const receipt = {
      version_bundle: capsule.version_bundle,
      event_count: capsule.events.length,
      rejection_index: rejIdx,
      rejection_code: "ILLEGAL_TRANSITION",
      rejection_message: msg,
      from_state: fromS,
      to_state: toS,
      state_before_hash,
      attempted_ledger_head: head,
      state_mutated: false,
    };
    const receipt_hash = sha256Hex(canonicalize(receipt));
    const exp = capsule.expected;
    const match =
      state_before_hash === exp.state_before_hash &&
      head === exp.attempted_ledger_head &&
      receipt_hash === exp.receipt_hash;
    return { ok: match, reason: match ? "match" : "mismatch" };
  } catch (e) {
    return { ok: false, reason: "throw:" + e.message };
  }
}

const here = dirname(fileURLToPath(import.meta.url));
const replayPath =
  process.argv[2] || join(here, "../data/evidence/artifacts/ART-L7-REPLAY-001.json");
const rejectPath =
  process.argv[3] || join(here, "../data/evidence/artifacts/ART-L7-REJECT-001.json");

const replayRaw = readFileSync(replayPath);
const rejectRaw = readFileSync(rejectPath);
const origReplayHash = fileHash(replayRaw);
const origRejectHash = fileHash(rejectRaw);
const replayCap = JSON.parse(replayRaw.toString("utf8"));
const rejectCap = JSON.parse(rejectRaw.toString("utf8"));

const results = [];

function record(mut) {
  const mutatedHash = sha256Hex(JSON.stringify(mut.mutatedObject));
  const observed = mut.run();
  const pass = observed.outcome === mut.expectedOutcome;
  results.push({
    mutationId: mut.id,
    sourceArtifact: mut.source,
    mutation: mut.description,
    expectedOutcome: mut.expectedOutcome,
    observedOutcome: observed.outcome,
    observedDetail: observed.detail,
    pass,
    originalArtifactHash: mut.source === "ART-L7-REPLAY-001" ? origReplayHash : origRejectHash,
    mutatedArtifactHash: mutatedHash,
  });
}

record({
  id: "M01-EVENT-INSERT",
  source: "ART-L7-REPLAY-001",
  description: "Insert extra RECORD_INSERT before final event",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.events = [
      ...c.events.slice(0, -1),
      { event_type: "RECORD_INSERT", record_id: "rX", payload: { n: 99 } },
      c.events[c.events.length - 1],
    ];
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M02-EVENT-DELETE",
  source: "ART-L7-REPLAY-001",
  description: "Delete COMMIT_FINALIZED event",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.events = c.events.filter((e) => e.event_type !== "COMMIT_FINALIZED");
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M03-EVENT-DUPLICATE",
  source: "ART-L7-REPLAY-001",
  description: "Duplicate first RECORD_INSERT",
  expectedOutcome: "THROW",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.events = [c.events[0], c.events[0], ...c.events.slice(1)];
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    const outcome = r.reason?.startsWith("throw:") ? "THROW" : r.ok ? "VERIFY_PASS" : "VERIFY_FAIL";
    return { outcome, detail: r.reason };
  },
});
record({
  id: "M04-EVENT-PERMUTATION",
  source: "ART-L7-REPLAY-001",
  description: "Swap the two STATE_TRANSITION events",
  expectedOutcome: "THROW",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    const ev = [...c.events];
    const i1 = ev.findIndex((e) => e.event_type === "STATE_TRANSITION");
    const i2 = ev.findIndex((e, i) => i > i1 && e.event_type === "STATE_TRANSITION");
    [ev[i1], ev[i2]] = [ev[i2], ev[i1]];
    c.events = ev;
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    const outcome = r.reason?.startsWith("throw:") ? "THROW" : r.ok ? "VERIFY_PASS" : "VERIFY_FAIL";
    return { outcome, detail: r.reason };
  },
});
record({
  id: "M05-STATE-MUTATION",
  source: "ART-L7-REPLAY-001",
  description: "initial_state.lifecycle_state forced to VERIFIED",
  expectedOutcome: "THROW",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.initial_state.lifecycle_state = "VERIFIED";
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    const outcome = r.reason?.startsWith("throw:") ? "THROW" : r.ok ? "VERIFY_PASS" : "VERIFY_FAIL";
    return { outcome, detail: r.reason };
  },
});
record({
  id: "M06-STATE-KEY-REORDER-ONLY",
  source: "ART-L7-REPLAY-001",
  description: "Reorder keys in initial_state (semantic no-op)",
  expectedOutcome: "VERIFY_PASS",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    const s = c.initial_state;
    c.initial_state = {
      commit_finalized: s.commit_finalized,
      records: s.records,
      lifecycle_state: s.lifecycle_state,
    };
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M07-EXPECTED-STATE-HASH-MUTATION",
  source: "ART-L7-REPLAY-001",
  description: "Flip last nibble of expected.state_hash",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    const h = c.expected.state_hash;
    c.expected.state_hash = h.slice(0, -1) + (h.endsWith("0") ? "1" : "0");
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M08-EXPECTED-RECEIPT-HASH-MUTATION",
  source: "ART-L7-REPLAY-001",
  description: "Flip last nibble of expected.receipt_hash",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    const h = c.expected.receipt_hash;
    c.expected.receipt_hash = h.slice(0, -1) + (h.endsWith("a") ? "b" : "a");
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M09-LEDGER-EXPECTED-MUTATION",
  source: "ART-L7-REPLAY-001",
  description: "Mutate expected.ledger_head_hash",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.expected.ledger_head_hash = "0".repeat(64);
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M10-VERSION-BUNDLE-MUTATION",
  source: "ART-L7-REPLAY-001",
  description: "Change version_bundle.schema_version",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.version_bundle.schema_version = "ri-capsule-9.9.9";
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M11-LIFECYCLE-ILLEGAL-IN-REPLAY",
  source: "ART-L7-REPLAY-001",
  description: "Illegal to_state INGESTED on VERIFIED transition",
  expectedOutcome: "THROW",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.events = c.events.map((e) =>
      e.event_type === "STATE_TRANSITION" && e.to_state === "VERIFIED"
        ? { ...e, to_state: "INGESTED" }
        : e
    );
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    const outcome = r.reason?.startsWith("throw:") ? "THROW" : r.ok ? "VERIFY_PASS" : "VERIFY_FAIL";
    return { outcome, detail: r.reason };
  },
});
record({
  id: "M12-CANON-PAYLOAD-KEY-REORDER",
  source: "ART-L7-REPLAY-001",
  description: "Payload key rewrite (semantic no-op)",
  expectedOutcome: "VERIFY_PASS",
  mutatedObject: (() => {
    const c = deepClone(replayCap);
    c.events = c.events.map((e) =>
      e.event_type === "RECORD_INSERT" ? { ...e, payload: { n: e.payload.n } } : e
    );
    return c;
  })(),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M13-REJECT-MAKE-LEGAL",
  source: "ART-L7-REJECT-001",
  description: "Illegal edge changed to legal CORRELATED",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(rejectCap);
    c.events = [{ event_type: "STATE_TRANSITION", to_state: "CORRELATED" }];
    return c;
  })(),
  run() {
    const r = verifyRejectCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M14-REJECT-EXPECTED-RECEIPT-MUTATION",
  source: "ART-L7-REJECT-001",
  description: "Mutate expected.receipt_hash",
  expectedOutcome: "VERIFY_FAIL",
  mutatedObject: (() => {
    const c = deepClone(rejectCap);
    c.expected.receipt_hash = "ff".repeat(32);
    return c;
  })(),
  run() {
    const r = verifyRejectCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M15-REJECT-UNCHANGED-CONTROL",
  source: "ART-L7-REJECT-001",
  description: "Unmodified reject control",
  expectedOutcome: "VERIFY_PASS",
  mutatedObject: deepClone(rejectCap),
  run() {
    const r = verifyRejectCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});
record({
  id: "M16-REPLAY-UNCHANGED-CONTROL",
  source: "ART-L7-REPLAY-001",
  description: "Unmodified replay control",
  expectedOutcome: "VERIFY_PASS",
  mutatedObject: deepClone(replayCap),
  run() {
    const r = verifyReplayCapsule(deepClone(this.mutatedObject));
    return { outcome: r.ok ? "VERIFY_PASS" : "VERIFY_FAIL", detail: r.reason };
  },
});

const pass = results.every((r) => r.pass);
const originalsIntact =
  fileHash(readFileSync(replayPath)) === origReplayHash &&
  fileHash(readFileSync(rejectPath)) === origRejectHash;

console.log(
  JSON.stringify(
    {
      suite: "phase10.1-mutation-art-l7-v1",
      pass: pass && originalsIntact,
      originalsIntact,
      originalHashes: { replay: origReplayHash, reject: origRejectHash },
      mutationCount: results.length,
      passed: results.filter((r) => r.pass).length,
      failed: results.filter((r) => !r.pass).map((r) => r.mutationId),
      results,
    },
    null,
    2
  )
);
process.exit(pass && originalsIntact ? 0 : 1);
