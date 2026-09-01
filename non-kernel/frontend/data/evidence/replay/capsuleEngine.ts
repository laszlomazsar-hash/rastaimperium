/**
 * Pure public capsule engine for INV-001 replay parity.
 * Mirrors evo-v/tests/replay_test.py reducer semantics.
 * Not the full EVO-V production kernel — sealed public demonstration capsule only.
 */

import { createHash } from "crypto";

export type LifecycleState =
  | "INGESTED"
  | "NORMALIZED"
  | "VERIFIED"
  | "CORRELATED"
  | "ARCHIVED"
  | "CONTESTED";

export type CapsuleEvent =
  | { event_type: "RECORD_INSERT"; record_id: string; payload: Record<string, unknown> }
  | { event_type: "STATE_TRANSITION"; to_state: LifecycleState }
  | { event_type: "COMMIT_FINALIZED" };

export interface CapsuleState {
  lifecycle_state: LifecycleState;
  records: Record<string, Record<string, unknown>>;
  commit_finalized: boolean;
}

export interface VersionBundle {
  schema_version: string;
  ruleset_version: string;
  governance_version: string;
  canon_spec_version: string;
  cert_profile: string;
}

export interface ReplayCapsule {
  artifactId: string;
  invariant: "INV-001";
  title: string;
  version_bundle: VersionBundle;
  initial_state: CapsuleState;
  events: CapsuleEvent[];
  expected: {
    state_hash: string;
    receipt_hash: string;
    ledger_head_hash: string;
    terminal_lifecycle: LifecycleState;
    commit_finalized: boolean;
  };
  algorithm: {
    hash: "sha256";
    canonicalization: "json-canonical-sorted-keys-1";
    ledger_link: "sha256(prev_head + '|' + canonicalize(event))";
    receipt: "sha256(canonicalize(receipt_payload))";
  };
  scope: string;
}

const ALLOWED: Record<LifecycleState, Set<LifecycleState>> = {
  INGESTED: new Set(["NORMALIZED"]),
  NORMALIZED: new Set(["VERIFIED"]),
  VERIFIED: new Set(["CORRELATED"]),
  CORRELATED: new Set(["ARCHIVED"]),
  ARCHIVED: new Set(),
  CONTESTED: new Set(),
};

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalize(v)).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`).join(",")}}`;
}

export function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function applyTransition(state: LifecycleState, target: LifecycleState): LifecycleState {
  if (target === "CONTESTED" || ALLOWED[state]?.has(target)) return target;
  throw new Error(`illegal transition ${state}->${target}`);
}

export function reduceEvent(state: CapsuleState, event: CapsuleEvent): CapsuleState {
  const next: CapsuleState = {
    lifecycle_state: state.lifecycle_state,
    records: { ...state.records },
    commit_finalized: state.commit_finalized,
  };

  if (event.event_type === "RECORD_INSERT") {
    if (next.records[event.record_id]) throw new Error("duplicate record_id");
    next.records[event.record_id] = event.payload;
  } else if (event.event_type === "STATE_TRANSITION") {
    next.lifecycle_state = applyTransition(next.lifecycle_state, event.to_state);
  } else if (event.event_type === "COMMIT_FINALIZED") {
    next.commit_finalized = true;
  }
  return next;
}

export function emptyState(): CapsuleState {
  return { lifecycle_state: "INGESTED", records: {}, commit_finalized: false };
}

export function replay(events: CapsuleEvent[], initial: CapsuleState = emptyState()): CapsuleState {
  let state = structuredClone(initial);
  for (const event of events) state = reduceEvent(state, event);
  return state;
}

export function ledgerHead(events: CapsuleEvent[]): string {
  let head = "GENESIS";
  for (const event of events) {
    head = sha256Hex(`${head}|${canonicalize(event)}`);
  }
  return head;
}

export function verifyCapsule(capsule: ReplayCapsule): {
  pass: boolean;
  state_hash: string;
  receipt_hash: string;
  ledger_head_hash: string;
  run_a_state_hash: string;
  run_b_state_hash: string;
  mismatches: string[];
} {
  const runA = replay(capsule.events, capsule.initial_state);
  const runB = replay(capsule.events, capsule.initial_state);
  const stateHashA = sha256Hex(canonicalize(runA));
  const stateHashB = sha256Hex(canonicalize(runB));
  const ledger_head_hash = ledgerHead(capsule.events);
  const receiptPayload = {
    version_bundle: capsule.version_bundle,
    event_count: capsule.events.length,
    state_hash: stateHashA,
    ledger_head_hash,
    terminal_lifecycle: runA.lifecycle_state,
    commit_finalized: runA.commit_finalized,
  };
  const receipt_hash = sha256Hex(canonicalize(receiptPayload));

  const mismatches: string[] = [];
  if (stateHashA !== stateHashB) mismatches.push("replay_parity_state_hash");
  if (stateHashA !== capsule.expected.state_hash) mismatches.push("expected_state_hash");
  if (ledger_head_hash !== capsule.expected.ledger_head_hash) mismatches.push("expected_ledger_head_hash");
  if (receipt_hash !== capsule.expected.receipt_hash) mismatches.push("expected_receipt_hash");
  if (runA.lifecycle_state !== capsule.expected.terminal_lifecycle) {
    mismatches.push("expected_terminal_lifecycle");
  }
  if (runA.commit_finalized !== capsule.expected.commit_finalized) {
    mismatches.push("expected_commit_finalized");
  }

  return {
    pass: mismatches.length === 0,
    state_hash: stateHashA,
    receipt_hash,
    ledger_head_hash,
    run_a_state_hash: stateHashA,
    run_b_state_hash: stateHashB,
    mismatches,
  };
}
