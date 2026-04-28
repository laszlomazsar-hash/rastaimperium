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
# Stronghold Observability: External Monitor Contracts and Operations Runbook

## Purpose
This document defines the **external monitor contract** for Stronghold edge probes and uptime systems. It standardizes:

- endpoint response expectations,
- alert thresholds,
- sample monitor configurations,
- escalation flow, and
- incident runbooks for `OFFLINE`, `DEGRADED`, and `COMPROMISE` states.

## Scope
This contract is for **unauthenticated external monitors** (public HTTP probes and uptime services), not internal service-to-service checks.

---

## Endpoint response contracts

> All endpoints below are expected to support `GET` and return no-cache headers when feasible (`Cache-Control: no-store`) so monitors see real-time state.

### 1) `GET /`
Operational gateway/liveness of the web surface.

**Expected status codes**
- `200 OK`: Service reachable and page rendered.
- `5xx`: Server-side failure (alert).
- `3xx` may be accepted if intentionally configured (for canonical redirect), but should be treated as warning unless documented change request exists.

**Expected content contract**
- `Content-Type` includes `text/html`.
- Body is non-empty (`> 1 KB` recommended).

**Minimal validation**
- HTTP status is `200`.
- Body contains known marker string: `Rasta Imperium`.

---

### 2) `GET /health`
Application health contract for external probes.

**Expected status codes**
- `200 OK`: Health check reports service healthy.
- `503 Service Unavailable`: Explicit unhealthy/degraded state.
- `5xx`: Unexpected fault (alert).

**Expected response schema (JSON)**
```json
{
  "status": "ok | degraded | starting",
  "started": true,
  "startup_completed_at": "2026-04-26T12:00:00+00:00",
  "redis_connected": true,
  "notes": ["optional note"]
}
```

**Schema requirements**
- `status`: string enum `ok | degraded | starting`
- `started`: boolean
- `startup_completed_at`: string or null, ISO-8601 timestamp
- `redis_connected`: boolean
- `notes`: array of strings

---

### 3) `GET /state`
High-level service state for operational routing and incident triage.

**Expected status codes**
- `200 OK`: State payload valid.
- `503 Service Unavailable`: State indicates non-operational posture.

**Expected response schema (JSON)**
```json
{
  "state": "ONLINE | DEGRADED | OFFLINE | COMPROMISE",
  "ready": true,
  "checks": {
    "startup": true,
    "redis": true,
    "dependencies": true
  },
  "updated_at": "2026-04-26T12:00:00+00:00"
}
```

**Schema requirements**
- `state`: string enum `ONLINE | DEGRADED | OFFLINE | COMPROMISE`
- `ready`: boolean
- `checks`: object with boolean leaf values
- `updated_at`: ISO-8601 timestamp

---

### 4) `GET /epistemic`
Integrity/introspection contract for monitor confidence and tamper-aware verification.

**Expected status codes**
- `200 OK`: Introspection payload valid.
- `503 Service Unavailable`: Integrity confidence below safe threshold.

**Expected response schema (JSON)**
```json
{
  "confidence": "high | medium | low",
  "integrity": {
    "config_hash": "sha256:...",
    "build_id": "stronghold-2026.04.26",
    "signature_valid": true
  },
  "policy": {
    "mode": "normal | restricted | lockdown"
  },
  "timestamp": "2026-04-26T12:00:00+00:00"
}
```

**Schema requirements**
- `confidence`: enum `high | medium | low`
- `integrity.config_hash`: non-empty string
- `integrity.signature_valid`: boolean
- `policy.mode`: enum `normal | restricted | lockdown`
- `timestamp`: ISO-8601 timestamp

---

## Alert thresholds and monitor logic

### Alert classes

1. **Timeout**
   - Trigger when request exceeds timeout budget.
   - **Threshold**: 2 consecutive timeouts within 5 minutes.

2. **Non-2xx status**
   - Trigger on any `>= 400` for `/`, `/health`, `/state`, `/epistemic`.
   - **Threshold**: 2 consecutive failures per endpoint.
   - `503` from `/health`, `/state`, `/epistemic` should be classified as **DEGRADED/OFFLINE signal** (not parser error).

3. **Invalid JSON / schema mismatch**
   - Applies to `/health`, `/state`, `/epistemic`.
   - Trigger when response is not valid JSON or fails schema checks.
   - **Threshold**: 1 failure for high-severity warning; escalate to incident if 2 consecutive failures.

4. **Max latency breach**
   - Separate from hard timeout; captures slow degradation.
   - **Threshold**:
     - warn when p95 latency > 800 ms for 10 minutes,
     - critical when p95 latency > 1500 ms for 10 minutes,
     - emergency when p95 latency > 2500 ms for 5 minutes.

### Probe cadence
- Interval: every 60 seconds.
- Retry/backoff: immediate retry once after 5 seconds.
- Region diversity: at least 3 probe regions.

---

## Sample monitor configurations

## UptimeRobot (HTTP(s) monitor)

**Recommended baseline**
- Monitor type: `HTTP(s)`
- URL targets:
  - `https://<domain>/`
  - `https://<domain>/health`
  - `https://<domain>/state`
- Monitoring interval: `1 minute`
- Timeout: `5 seconds`
- Alert contacts: on-call primary + backup
- Keyword check for `/`: `Rasta Imperium`

**Escalation guidance with UptimeRobot limits**
- UptimeRobot validates status/keyword but does not fully enforce JSON schema.
- Pair with a programmable HTTP probe (below) for schema contract checks.

## Programmable HTTP probe (schema-aware)

Example pseudo-config:

```yaml
monitors:
  - name: stronghold-root
    method: GET
    url: https://<domain>/
    interval: 60s
    timeout: 5s
    expect:
      status: [200]
      content_type_contains: text/html
      body_contains: ["Rasta Imperium"]

  - name: stronghold-health
    method: GET
    url: https://<domain>/health
    interval: 60s
    timeout: 5s
    expect:
      status: [200, 503]
      json_schema: health_v1

  - name: stronghold-state
    method: GET
    url: https://<domain>/state
    interval: 60s
    timeout: 5s
    expect:
      status: [200, 503]
      json_schema: state_v1

  - name: stronghold-epistemic
    method: GET
    url: https://<domain>/epistemic
    interval: 60s
    timeout: 5s
    expect:
      status: [200, 503]
      json_schema: epistemic_v1
```

---

## Escalation path (expected)

### Severity map
- **SEV-1**: Full outage, sustained `OFFLINE`, or confirmed `COMPROMISE` signal.
- **SEV-2**: Degraded health (`503`) or repeated schema failures across multiple regions.
- **SEV-3**: Single-region failure, intermittent latency warnings.

### Escalation timeline
1. **T+0 min**: Alert opens in on-call system.
2. **T+5 min**: Primary on-call acknowledges and starts triage.
3. **T+10 min**: If unresolved, escalate to secondary on-call + platform lead.
4. **T+15 min**: For SEV-1/COMPROMISE, page security lead and incident commander.
5. **T+30 min**: Stakeholder status update with current state and ETA.

### Communication channels
- Primary: Pager/on-call platform.
- Secondary: incident chat channel.
- Executive/security notification: direct page for SEV-1 and COMPROMISE.

---

## Incident runbook

## Case A: `OFFLINE`
**Trigger examples**
- `/` and `/health` return timeout/5xx from multiple regions.
- `/state` reports `OFFLINE`.

**Immediate actions**
1. Validate broad impact across at least 2 probes/providers.
2. Check edge/CDN, DNS, TLS cert validity, and origin reachability.
3. Roll back most recent deploy/config change if correlated.
4. Confirm database/cache dependency status.
5. Post incident update every 15 minutes until recovery.

**Exit criteria**
- 15 minutes of stable 2xx responses (or expected 200/503 health semantics).
- Latency back below critical threshold.

## Case B: `DEGRADED`
**Trigger examples**
- `/health` or `/state` returns `503` with partial dependency failure.
- Elevated p95 latency with intermittent non-2xx.

**Immediate actions**
1. Identify failing dependency via check fields (`redis`, `dependencies`, etc.).
2. Shift traffic/reduce load if autoscaling or queue controls exist.
3. Apply graceful-degradation toggles/feature flags.
4. Open SEV-2 if degradation persists >10 minutes.

**Exit criteria**
- Health payload returns `status=ok` (or state `ONLINE`) across all regions.
- Latency warnings cleared for 10 continuous minutes.

## Case C: `COMPROMISE`
**Trigger examples**
- `/epistemic` indicates low confidence or invalid signature/integrity mismatch.
- Unexpected contract drift and unexplained config hash change.

**Immediate actions (security first)**
1. Declare SEV-1 security incident.
2. Move system to restrictive posture (`restricted`/`lockdown`) if available.
3. Rotate credentials/secrets according to security policy.
4. Preserve forensic artifacts (logs, deployment metadata, access traces).
5. Notify security lead + incident commander immediately.

**Containment and recovery**
1. Isolate impacted services/environments.
2. Rebuild from known-good artifact and verified config.
3. Re-enable traffic gradually with heightened monitoring.
4. Complete post-incident review with root cause, blast radius, and remediations.

**Exit criteria**
- Integrity checks return valid signatures and expected config hash.
- Security sign-off completed before full traffic restoration.

---

## Operational notes
- Keep this document versioned with infrastructure and endpoint contract updates.
- Any response schema change for monitored endpoints requires:
  1. change review,
  2. monitor schema update,
  3. rollback plan,
  4. incident communication notice.
