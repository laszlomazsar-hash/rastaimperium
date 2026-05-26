import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTelemetrySnapshot } from './telemetry.ts';

test('generateTelemetrySnapshot is deterministic for same inputs', () => {
  const first = generateTelemetrySnapshot(5, 'darwin-kernel-v7.2');
  const second = generateTelemetrySnapshot(5, 'darwin-kernel-v7.2');
  assert.deepEqual(first, second);
});

test('generateTelemetrySnapshot changes with tick', () => {
  const first = generateTelemetrySnapshot(5, 'darwin-kernel-v7.2');
  const second = generateTelemetrySnapshot(6, 'darwin-kernel-v7.2');
  assert.notDeepEqual(first, second);
});
