# Stronghold observability contracts

This document defines the external probe contracts for ARK Safety observability endpoints.

## Schema versioning

- Contract field: `schema_version` (required on all probe responses).
- Current version: `1.0.0`.
- Version format: semantic version (`MAJOR.MINOR.PATCH`).

## Backward-compatible change policy

Within the same **major** version:

- ✅ Additive changes are allowed (new optional fields).
- ✅ Value refinements are allowed if existing field names and types remain stable.
- ❌ Removing a required field is not allowed.
- ❌ Renaming an existing field is not allowed.
- ❌ Changing field type is not allowed.

Major version bumps are required for any breaking change.

## Endpoint contracts

### `GET /health`

Required keys:

- `schema_version` (string)
- `status` (string)

Example:

```json
{
  "schema_version": "1.0.0",
  "status": "ok"
}
```

### `GET /state`

Required keys:

- `schema_version` (string)
- `rollback_ready` (boolean)
- `trace_coverage` (array)

Example:

```json
{
  "schema_version": "1.0.0",
  "rollback_ready": false,
  "trace_coverage": [
    {
      "layer": "L1",
      "coverage": 100.0
    }
  ]
}
```

### `GET /epistemic`

Required keys:

- `schema_version` (string)
- `audit_log_entries` (integer)
- `trace_layers_monitored` (integer)

Example:

```json
{
  "schema_version": "1.0.0",
  "audit_log_entries": 0,
  "trace_layers_monitored": 9
}
```

## Monitor rule guidance

Probes MUST validate:

1. `schema_version` exists and begins with the expected major version (`1.` for current contract).
2. Required keys exist for each endpoint.
3. HTTP status code is healthy (2xx) for steady-state checks.

Probes MUST NOT require full-body exact matches, so additive fields do not break monitoring.
