# Stronghold Observability Compatibility Policy

This policy defines compatibility rules for the Stronghold monitor-facing payloads exposed by:

- `GET /health`
- `GET /state`
- `GET /epistemic`

## Schema versioning rules

Stronghold responses use semantic versioning in the top-level `schema_version` field.

- **Patch or minor** version updates are used for additive, backward-compatible changes.
  - Example: adding a new optional field.
- **Major** version updates are required for any breaking change.
  - Example: removing a field, renaming a field, or changing a field type.

## Endpoint payload contracts

### `GET /health`

Required fields:

- `schema_version` (`string`, semantic version)
- `status` (`string`)

Optional fields:

- None currently.

### `GET /state`

Required fields:

- `schema_version` (`string`, semantic version)
- `coverage` (`array[object]`)
- `rollback_ready` (`boolean`)

Optional fields:

- None currently.

### `GET /epistemic`

Required fields:

- `schema_version` (`string`, semantic version)
- `trace_coverage` (`float`)
- `rollback_ready` (`boolean`)
- `latest_audit_digest` (`string`)

Optional fields:

- None currently.

## Monitor validation guidance

Monitors must validate compatibility by checking:

1. `schema_version` exists and is parseable as semver.
2. The major version is supported by the monitor.
3. Required keys exist.

Monitors should **not** require exact full-body equality for payloads. Additional fields may be added in patch/minor releases and should be ignored unless explicitly consumed.

## Reference monitor check behavior

Recommended baseline monitor checks:

- `/health`: verify required keys and supported `schema_version` major.
- `/state`: verify required keys and supported `schema_version` major.
- `/epistemic`: verify required keys and supported `schema_version` major.

This keeps monitors stable while allowing Stronghold payloads to evolve safely.
