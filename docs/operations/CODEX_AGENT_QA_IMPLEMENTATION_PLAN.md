# Codex Agent Bot — QA Implementation Plan (Pilot → Rollout)

## 1) Scope and assumptions

### Pilot scope (2–4 weeks)
- Focus on two high-value workflows:
  1. PR-level QA review for FastAPI + frontend changes.
  2. Test proposal generation for changed features and routes.
- Pilot with one delivery stream in this repository and a small reviewer cohort (engineering + QA).
- Integrations limited to git workflow, existing Python test stack (`pytest`), and CI checks already used by the project.

### Out of scope (pilot)
- No autonomous production deploys.
- No org-wide replacement of existing QA processes.
- No fine-tuning/custom model training in pilot phase.

### Assumptions
- Baseline metrics exist (or can be measured during week 0):
  - PR review cycle time
  - escaped defects
  - post-merge hotfix count
- Security/compliance review can approve bounded data usage for pilot logs.
- At least one engineering owner and one QA owner are assigned.

---

## 2) Architecture and toolchain

### Proposed architecture
- **Orchestrator layer**: lightweight service or CI job wrapper that:
  - receives a QA task trigger,
  - gathers repository context,
  - invokes LLM workflows,
  - writes structured outputs back to PR/artifacts.
- **Context layer**:
  - git diff + touched files,
  - relevant docs (`README.md`, architecture docs),
  - existing tests under `tests/`.
- **Output surfaces**:
  - PR comment summary,
  - machine-readable artifact (`qa_report.json`),
  - optional markdown report (`qa_report.md`).

### Toolchain for this repository
- Runtime/backend context: FastAPI + Python modules under `src/`.
- Validation:
  - `pytest`
  - targeted Python syntax/import checks
  - repository scripts such as `scripts/validate_architecture_version.py` when architecture files change.
- Optional expansion:
  - static analysis/security scan in rollout phase.

---

## 3) Guardrails and policy model

### Safety policy
- Human review required before merge/deploy.
- AI output is advisory during pilot (comment + recommendation only).
- Dry-run first behavior for risky or broad edits.

### Data handling guardrails
- Minimize context sent to model:
  - include only changed files and required reference docs.
- Exclude secrets and sensitive config from prompts.
- Keep audit logs for:
  - trigger source,
  - prompt class/template,
  - output summary,
  - human disposition (accepted/edited/rejected).

### Control boundaries
- Repo-scoped access only.
- No direct prod environment mutation.
- Rate-limit automated runs to prevent noisy PR spam.

---

## 4) Phase-by-phase timeline

### Week 0–1: setup and alignment
- Define pilot charter and acceptance criteria.
- Finalize prompt templates for:
  - PR QA review,
  - test-case suggestion,
  - risk summary.
- Implement minimal orchestration path and report artifact format.

### Week 2–3: limited live pilot
- Enable on selected PRs using an explicit trigger label/comment.
- Capture metrics on each run:
  - findings count,
  - accepted suggestions,
  - reviewer time delta,
  - false-positive rate.
- Weekly tuning:
  - tighten prompts,
  - reduce noisy findings,
  - improve report clarity.

### Week 4: evaluation and decision gate
- Compare pilot metrics vs baseline.
- Run a retrospective with engineering + QA owners.
- Choose one:
  1. scale to more repos,
  2. continue pilot with targeted fixes,
  3. pause and re-scope.

### Rollout (months 2–4)
- Gradual onboarding by team.
- Add workflow variants (failure triage, regression risk scoring).
- Add dashboards for quality and adoption metrics.

### Optimization (ongoing)
- Monthly prompt/workflow refresh using reviewer feedback.
- Cost/latency tuning by task type.
- Quarterly policy and incident review.

---

## 5) RACI (pilot)

| Workstream | Engineering Lead | QA Lead | Platform/Infra | Security/Compliance | Product/Exec Sponsor |
|---|---|---|---|---|---|
| Pilot scope + success criteria | A | R | C | I | C |
| Orchestrator implementation | R | C | A | I | I |
| Prompt/workflow design | R | A | C | I | I |
| Data handling review | C | I | R | A | I |
| Day-to-day run operations | C | A | R | I | I |
| KPI reporting + go/no-go recommendation | R | A | C | I | C |

Legend: R = Responsible, A = Accountable, C = Consulted, I = Informed.

---

## 6) KPIs and acceptance criteria

### Pilot KPIs
- **Quality impact**
  - increase in pre-merge issue detection.
  - reduction in escaped defects for pilot scope.
- **Delivery impact**
  - reduction in QA review cycle time.
  - reduced rework after review.
- **Adoption signal**
  - % of eligible PRs using agent review.
  - reviewer acceptance ratio for suggestions.

### Go/no-go thresholds
- No critical policy/security incidents.
- Positive net reviewer sentiment from pilot owners.
- At least one validated example of meaningful defect prevention.

---

## 7) Risk register and mitigations

| Risk | Likely cause | Mitigation |
|---|---|---|
| Low adoption | Report noise or workflow friction | Keep trigger simple, tune prompts weekly, publish quick wins |
| Hallucinated guidance | Weak context or ambiguous prompts | Restrict context windows, require human approval, maintain rejection feedback loop |
| Data leakage | Over-broad context ingestion | Apply secret filters + strict file allowlists |
| Scope creep | Expanding asks during pilot | Enforce pilot charter + week-4 gate |
| Over-reliance | Teams accept output without verification | Require explicit reviewer disposition on key findings |

---

## 8) Day-1 runbook (first QA task)

### Use case: PR QA review + test suggestions
1. Confirm repo is enrolled and integration token is valid.
2. Trigger agent with designated label/comment.
3. Gather context:
   - PR diff,
   - linked requirement (if any),
   - relevant existing tests.
4. Produce report sections:
   - risk summary,
   - potential defects,
   - proposed tests,
   - confidence/assumptions.
5. QA reviewer marks each item:
   - Accepted / Modified / Rejected.
6. Log outcomes for KPI and prompt-tuning loop.
7. If unsafe/off-policy behavior appears:
   - disable workflow for repo,
   - open incident ticket,
   - require owner review before re-enable.

---

## 9) Suggested immediate next actions (this repo)
- Add a CI job that can run a structured “QA dry-run” report on demand.
- Standardize report schema (`qa_report.json`) for trend tracking.
- Define baseline metrics from recent PRs (last 30–60 days) before enabling pilot.
