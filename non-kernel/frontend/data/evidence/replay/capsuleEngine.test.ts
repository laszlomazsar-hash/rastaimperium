import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";
import {
  type ReplayCapsule,
  replay,
  sha256Hex,
  canonicalize,
  verifyCapsule,
} from "./capsuleEngine";

const here = dirname(fileURLToPath(import.meta.url));
const capsulePath = join(here, "../artifacts/ART-L7-REPLAY-001.json");

describe("ART-L7-REPLAY-001 earned verification", () => {
  const capsule = JSON.parse(readFileSync(capsulePath, "utf8")) as ReplayCapsule;

  it("independent double replay yields identical state hash", () => {
    const a = replay(capsule.events, capsule.initial_state);
    const b = replay(capsule.events, capsule.initial_state);
    expect(sha256Hex(canonicalize(a))).toBe(sha256Hex(canonicalize(b)));
  });

  it("verifyCapsule passes sealed expected hashes", () => {
    const result = verifyCapsule(capsule);
    expect(result.mismatches).toEqual([]);
    expect(result.pass).toBe(true);
    expect(result.state_hash).toBe(capsule.expected.state_hash);
    expect(result.receipt_hash).toBe(capsule.expected.receipt_hash);
    expect(result.ledger_head_hash).toBe(capsule.expected.ledger_head_hash);
  });

  it("permuted event order fails parity against sealed state hash", () => {
    const permuted = [capsule.events[0], capsule.events[2], capsule.events[1], capsule.events[3]];
    const bad = replay(permuted as typeof capsule.events, capsule.initial_state);
    expect(sha256Hex(canonicalize(bad))).not.toBe(capsule.expected.state_hash);
  });
});
