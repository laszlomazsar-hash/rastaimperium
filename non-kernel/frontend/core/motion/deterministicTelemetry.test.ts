import test from "node:test";
import assert from "node:assert/strict";
import { getTelemetrySample } from "./deterministicTelemetry";

test("deterministic telemetry repeats for same seed/state/tick", () => {
  const a = getTelemetrySample("seed-1", 42, "VERIFIED", { id: "liveTerminal", phase: "stability" });
  const b = getTelemetrySample("seed-1", 42, "VERIFIED", { id: "liveTerminal", phase: "stability" });
  assert.deepEqual(a, b);
});

test("different ticks produce deterministic but distinct samples", () => {
  const a = getTelemetrySample("seed-1", 42, "VERIFIED", { id: "liveTerminal", phase: "stability" });
  const b = getTelemetrySample("seed-1", 43, "VERIFIED", { id: "liveTerminal", phase: "stability" });
  assert.notDeepEqual(a, b);
});
