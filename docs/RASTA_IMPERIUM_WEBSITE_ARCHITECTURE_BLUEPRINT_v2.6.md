# RASTA IMPERIUM WEBSITE ARCHITECTURE BLUEPRINT v2.6

> **Status:** Canonical architecture specification (active)
> 
> **Supersedes:** `ARCHITECTURE.md` and `docs/RASTA_IMPERIUM_COMPLETE_PRODUCTION_BLUEPRINT_v2.1.7.md`

## 1) Canonical domain topology (v2.6)

All architecture, DNS, routing, and documentation references must use this exact domain set:

- `rastaimperium.com` — public field, identity surface, and primary website
- `jah.rastaimperium.com` — living dashboard, metrics, and ritual/state observability
- `codex.rastaimperium.com` — governance canon, constitutional docs, and codex artifacts
- `consulting.rastaimperium.com` — advisory, offers, intake, and commercial funnel

Only the four domains above are canonical in v2.6 and must be used in documentation, DNS, and routing references.

---

## 2) System layers

### L0 — Edge + Trust Boundary
- Managed DNS and global CDN at edge provider
- WAF with managed + custom rule sets
- DDoS mitigation and bot management
- TLS 1.2+ everywhere, HSTS enabled, automatic certificate rotation
- Rate limiting for public and API-facing endpoints

### L1 — Experience Layer
- Static/SSR web experience for `rastaimperium.com`
- Branded pages for gateways (Curiosity, Recognition, Codex, ARK)
- Content sections for legitimacy, community, legal, and contact

### L2 — Application Layer
- FastAPI application exposing canonical routes:
  - `/codex`
  - `/manifest`
  - `/simulate`
  - `/nuggets`
- Versioned API surface under `/api/v1/*`
- Health endpoints (`/healthz`, `/readyz`) for runtime checks

### L3 — Data + State Layer
- Managed PostgreSQL for durable app state and governance records
- Redis for cache, queueing, and short-lived runtime coordination
- Object storage for immutable artifacts (Codex exports, manifests, signed snapshots)

### L4 — Governance + Operations Layer
- Git-based source of truth
- CI/CD with branch protections and required checks
- Audit logging for deploys and privileged actions
- Backups, restore drills, and incident playbooks

---

## 3) Canonical routing model

### External routes
- `https://rastaimperium.com/` → root field and navigation
- `https://rastaimperium.com/codex` → codex gateway UI
- `https://rastaimperium.com/recognition` → trust/governance UI
- `https://rastaimperium.com/ark` → simulation/engine UI
- `https://rastaimperium.com/curiosity` → nuggets/discovery UI

### Service endpoints
- `https://codex.rastaimperium.com/codex`
- `https://codex.rastaimperium.com/manifest`
- `https://jah.rastaimperium.com/simulate`
- `https://jah.rastaimperium.com/nuggets`
- `https://consulting.rastaimperium.com/` (commercial + intake flows)

---

## 4) v2.6 deployment stack

v2.6 defines a **defense-in-depth, multi-layer deployment stack** instead of a single-platform narrative.

1. **Edge platform**
   - DNS, CDN, TLS termination, WAF, rate limiting, bot mitigation
2. **Web hosting/runtime**
   - Frontend deployed as static/SSR workload with immutable build artifacts
3. **Container runtime for FastAPI**
   - App deployed as containerized service with rolling deploys and health checks
4. **Managed data services**
   - PostgreSQL + Redis with encrypted-at-rest volumes and private networking
5. **Artifact storage + backups**
   - Versioned object storage and scheduled database backups with tested restore paths
6. **CI/CD control plane**
   - Signed commits/tags optional, required status checks, deploy approvals for production

This stack may be implemented across one or more vendors, but the architecture requirements above are mandatory.

---

## 5) Security controls baseline (v2.6)

### Identity & access
- SSO + MFA for production control-plane access
- Least-privilege RBAC for deploy, DB, and DNS operations
- Short-lived credentials wherever possible

### Application security
- Input validation at API boundary (Pydantic models)
- Strict CORS allow-list by environment
- Security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy)
- Dependency and container image scanning in CI

### Platform security
- Private networking between app and data plane
- Secrets managed in vault/runtime secret store (never committed)
- Automated certificate rotation
- Runtime alerting on auth anomalies, elevated 5xx rates, and latency spikes

### Data protection
- Encryption in transit (TLS) and at rest (DB + storage)
- Daily backups with retention policy
- Recovery-time and recovery-point objectives documented and tested

---

## 6) SLOs and reliability targets

- Availability target: 99.9% monthly for public website and core APIs
- P95 latency target:
  - `< 250ms` for cached/static paths
  - `< 600ms` for dynamic API paths under normal load
- Error budget and incident response runbook maintained in repo

---

## 7) Documentation policy

- This file is the **single canonical architecture document**.
- Legacy documents must include a deprecation banner that points here.
- New architecture decisions must update this file first, then downstream references.

---

## 8) Migration notes from v2.1.7/legacy

- Replace all legacy subdomain references with the canonical v2.6 domain set listed in Section 1.
- Replace single-provider deployment narratives with the layered stack in Section 4.
- Keep canonical business domain: `consulting.rastaimperium.com`.


## 9) What else is needed (execution checklist)

- [ ] Update DNS records so the four canonical domains resolve to the v2.6 edge/runtime targets.
- [ ] Enforce redirects from all legacy hostnames to canonical v2.6 hostnames.
- [ ] Add CI link-check to block non-canonical domain references in markdown/docs.
- [ ] Confirm WAF, TLS, rate-limit, and bot controls are enabled in production.
- [ ] Validate `/healthz` and `/readyz` in deployment probes and alerts.
- [ ] Run backup + restore drill and document evidence in ops runbook.
