# Jah Recursive Engine Security Requirements (v1)

## 1) Scope and Goal

This document defines production security requirements for enabling **recursive execution** in Jah. It applies to all runtime components that accept user prompts and may autonomously plan, call tools, execute code, fetch data, or chain model invocations.

**Goal:** prevent unauthorized actions, data exfiltration, privilege escalation, and untraceable behavior while preserving operational utility.

---

## 2) Threat Model and Trust Boundaries

### 2.1 Primary Threats

- Prompt injection leading to unsafe tool usage or policy bypass.
- Malicious or accidental recursive loops causing runaway costs/DoS.
- Unauthorized network access and exfiltration from tool execution.
- Privilege escalation from sandbox to host or cluster resources.
- Leakage of secrets/PII via logs, traces, or model context.
- Tampering with audit records to hide actions.

### 2.2 Trust Boundaries

1. **User Boundary:** untrusted user input enters API gateway.
2. **Model Boundary:** LLM outputs are untrusted instructions, not authority.
3. **Tool Boundary:** tool execution is isolated and policy-enforced.
4. **Data Boundary:** internal knowledge stores and external APIs are least-privilege.
5. **Control Boundary:** human approvals for high-risk actions.
6. **Audit Boundary:** immutable evidence store separate from execution plane.

---

## 3) Security Control Requirements

### 3.1 Identity, Authentication, and Authorization

#### MUST

- All API requests MUST be authenticated (OIDC/JWT or equivalent) with short-lived tokens.
- Every recursive run MUST carry a unique `run_id`, `user_id`, and `policy_profile`.
- Tool calls MUST be authorized per-tool and per-action via explicit allowlists.
- Service-to-service auth MUST use mTLS and workload identities (no static shared secrets).

#### SHOULD

- Support step-up auth for privileged actions.
- Enforce session binding and anti-replay for agent operations.

### 3.2 Recursive Execution Guardrails

#### MUST

- Enforce hard caps:
  - Max recursion depth.
  - Max tool invocations per run.
  - Max wall-clock runtime.
  - Max token/cost budget.
- Enforce deterministic stop conditions (timeout, budget reached, policy conflict).
- Require explicit plan generation and policy validation before first tool execution.
- Block self-modifying prompts/policies unless explicitly approved.

#### SHOULD

- Adaptive risk scoring that tightens caps for high-risk prompts.
- Circuit breaker disabling recursion globally when anomaly thresholds are exceeded.

### 3.3 Runtime Isolation (MicroVM / Sandbox)

#### MUST

- All executable tool actions run in microVM-class isolation (e.g., Firecracker/gVisor-grade boundary).
- Sandbox filesystem MUST be ephemeral and read-only by default.
- No host mounts except explicit, scoped, read-only mounts.
- Disable privilege escalation (no `--privileged`, no host network, no host PID/IPC namespaces).
- Apply syscall filtering (seccomp) and minimal Linux capabilities.

#### SHOULD

- Use per-run unique VM images/snapshots with integrity verification.
- Continuous sandbox escape monitoring with automatic quarantine.

### 3.4 Network Egress and Ingress Policy

#### MUST

- Default-deny egress from recursive runtime.
- Allow outbound only to approved FQDNs/IPs and required ports.
- DNS restricted to approved resolvers; block raw outbound DNS.
- No direct access to cloud metadata services from workloads.
- Kubernetes network policies MUST deny pod-to-pod traffic except explicit allow rules.

#### SHOULD

- Layer-7 egress proxy with domain allowlist enforcement and request logging.
- Geo/IP deny controls where business-appropriate.

### 3.5 Secrets and Sensitive Data Handling

#### MUST

- Secrets stored only in managed secrets service (AWS/GCP Secret Manager equivalent).
- Secrets injected at runtime with short TTL and automatic rotation.
- No secrets in repository, images, environment files, or plaintext logs.
- Prompt/response logs MUST redact credentials, tokens, and regulated identifiers.
- Encrypt data in transit (TLS 1.2+) and at rest (KMS-backed keys).

#### SHOULD

- Tokenization for high-sensitivity user data before model submission.
- Field-level encryption for sensitive columns in audit store.

### 3.6 Human-in-the-Loop Approval Workflow

#### MUST

- Risk engine classifies each proposed tool/action as `LOW`, `MEDIUM`, or `HIGH`.
- `HIGH` risk actions MUST require explicit human approval before execution.
- Approval records MUST include approver identity, timestamp, reason, and decision.
- Expired approvals MUST not be reusable.

#### SHOULD

- Two-person approval for irreversible/high-impact operations.
- Policy-configurable emergency break-glass path with mandatory post-incident review.

### 3.7 Auditability and Non-Repudiation

#### MUST

- Log immutable append-only audit events for:
  - User request receipt.
  - Model/tool decisions.
  - Policy checks and denials.
  - Human approvals/rejections.
  - Outbound network requests.
  - Final action outcomes.
- Every event MUST include `trace_id`, `run_id`, actor, timestamp, policy version, and hash chain pointer.
- Stream audit logs to external SIEM in near-real-time.
- Retain audit records per compliance policy with tamper-evidence checks.

#### SHOULD

- Periodic cryptographic sealing/signing of audit segments.
- Automated anomaly detection on action sequences and access patterns.

### 3.8 Model and Prompt Security

#### MUST

- Treat model output as untrusted until policy-filtered.
- Run prompt injection and jailbreak detection before tool planning.
- Enforce output schema validation for all tool call arguments.
- Maintain allowlist of system prompts and signed policy bundles.

#### SHOULD

- Multi-model cross-check for high-risk instructions.
- Canary prompts for continuous prompt-defense regression testing.

### 3.9 Supply Chain and Image Security

#### MUST

- All runtime artifacts signed and verified before deployment.
- CI MUST run SAST, dependency scanning, and container image scanning.
- Block deployment on critical vulnerabilities unless documented exception approved.
- Pin base images and dependencies to immutable digests/versions.

#### SHOULD

- SBOM generation per build and continuous drift monitoring.
- Runtime detection for unexpected binaries/process trees.

### 3.10 Incident Response and Recovery

#### MUST

- Maintain runbook for security incidents specific to recursive engine.
- Provide one-click kill switch for recursion and tool execution.
- Backup and restore procedures tested in staging at defined intervals.
- Post-incident forensics MUST preserve full audit chain and artifacts.

#### SHOULD

- Game-day exercises for sandbox escape, exfiltration, and policy bypass scenarios.

---

## 4) Security Acceptance Criteria (Go/No-Go)

Recursive engine production enablement is blocked unless all criteria pass:

1. **Isolation Validation:** sandbox escape tests fail to breach boundary.
2. **Policy Enforcement:** disallowed actions consistently blocked in red-team suite.
3. **Approval Gating:** all high-risk actions require and enforce human approval.
4. **Audit Integrity:** append-only, tamper-evident logs available in SIEM with traceability.
5. **Secrets Hygiene:** zero hardcoded secrets in repo/history and runtime logs.
6. **Network Containment:** default-deny egress with verified allowlist-only access.
7. **Performance Safety:** guardrails prevent runaway recursion under adversarial inputs.
8. **Third-Party Pen Test:** no unresolved critical findings.

---

## 5) Verification Matrix

| Control Area | Verification Method | Evidence Artifact |
|---|---|---|
| AuthZ for tools | Integration tests + policy unit tests | CI test reports |
| Recursion caps | Load/adversarial test harness | Test logs + metrics snapshots |
| MicroVM isolation | Security test scripts + escape PoC checks | Signed test report |
| Network default-deny | Network policy conformance tests | K8s policy reports |
| Secrets management | Repo scan + runtime config audit | Scan output + secret manager inventory |
| Human approval flow | End-to-end workflow tests | Approval audit records |
| Audit immutability | Hash-chain verification job | Verification logs |
| SIEM export | Alert pipeline test | SIEM ingestion screenshots/logs |

---

## 6) Operational Baselines

- **Rate limits:** per-user and per-tenant quotas with burst limits.
- **SLO/SLI:** p95 latency, error budget, and denied-action rate tracked.
- **Monitoring:** 5xx, policy-deny spikes, recursion-depth anomalies, egress denies.
- **Change control:** policy updates versioned; rollback supported within minutes.

---

## 7) Roles and Responsibilities

- **Security Engineer:** owns control design, test plans, and final security sign-off.
- **Backend/AI Lead:** implements guardrails, policy engine integration, and audit schema.
- **DevOps Engineer:** enforces runtime isolation, network policy, and observability.
- **Technical Lead:** accountable for go/no-go decision and exception management.

---

## 8) Versioning and Review

- **Document version:** v1.0
- **Review cadence:** weekly during rollout; monthly post-launch.
- **Change process:** updates require Security + Technical Lead approval and ADR linkage.
