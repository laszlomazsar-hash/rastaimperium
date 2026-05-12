# replay_verify CLI

`tools/replay_verify` performs deterministic replay verification over an event log.

## What it validates

- strict `global_sequence` ordering
- deterministic snapshot reconstruction from proof deltas
- replay parity against optional `expected_hashes`
- audit completeness (`STATE_TRANSITION` streams must include `COMMIT_FINALIZED`)
- lineage consistency (`prev_event_hash` must match prior canonical event hash)

On the first critical divergence, the CLI emits a deterministic counterexample artifact (if `--counterexample-out` is provided) and exits non-zero.

## Input format

Provide a JSON file with:

- `initial_state` (object)
- `events` (array): each event must include `global_sequence`, `event_type`, and `proof`
- `version_bundle` (object): `schema_version`, `ruleset_version`, `governance_version`, `canon_spec_version`, optional `cert_profile`
- optional `expected_hashes` (array of snapshot hashes)

## Examples

Replay full history:

```bash
tools/replay_verify \
  --input /tmp/replay_payload.json \
  --counterexample-out /tmp/replay_counterexample.json
```

Replay a bounded sequence window (`global_sequence` 1200..1800):

```bash
tools/replay_verify \
  --input /tmp/replay_payload.json \
  --start-sequence 1200 \
  --end-sequence 1800 \
  --counterexample-out /tmp/replay_counterexample_window.json
```
