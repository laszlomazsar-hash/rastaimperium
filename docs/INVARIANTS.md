# INVARIANTS

This document defines machine-checkable invariants for the deterministic governance kernel.
Canonical terminology aligns with [SYSTEM_FLOW](./SYSTEM_FLOW.md), [ARCHITECTURE](./ARCHITECTURE.md), and [GLOSSARY](./GLOSSARY.md).

## Invariant format

Each invariant definition must be evaluated against a fixed input capsule:
- ordered event sequence
- fixed version bundle (`schema_version`, `ruleset_version`, `governance_version`, `canon_spec_version`, and `cert_profile` when applicable)
- deterministic canonicalization profile

```yaml
id: string
name: string
critical: boolean
inputs:
  events: ordered_append_only
  version_bundle: required
  canonicalization: required
check:
  type: pure_function
  returns: pass | fail
on_fail:
  write_freeze: true
  emit_counterexample: true
```

## INV-001 Replay parity

```yaml
id: INV-001
name: replay_parity
critical: true
assertion: >
  Replaying the same canonical event stream with the same version bundle
  yields identical terminal state hash, receipt hash, and ledger head hash.
check:
  procedure:
    - run_replay(events, version_bundle) -> run_a
    - run_replay(events, version_bundle) -> run_b
    - assert run_a.state_hash == run_b.state_hash
    - assert run_a.receipt_hash == run_b.receipt_hash
    - assert run_a.ledger_head_hash == run_b.ledger_head_hash
failure_payload:
  required_fields:
    - violated_invariant
    - divergence_index
    - expected_hashes
    - actual_hashes
    - version_bundle
    - replay_capsule_ref
```

## INV-002 No hidden state mutation

```yaml
id: INV-002
name: no_hidden_state_mutation
critical: true
assertion: >
  Lifecycle state may change only via explicit STATE_TRANSITION events;
  no other event type or side effect may mutate lifecycle state.
check:
  procedure:
    - reconstruct_state(events) -> state_trace
    - for each delta in state_trace:
        assert delta.origin_event_type == STATE_TRANSITION
    - assert RECORD_INSERT only creates identity and does not change lifecycle state
    - assert no out_of_band_store_writes affect reconstructed lifecycle state
failure_payload:
  required_fields:
    - violated_invariant
    - offending_event_id
    - offending_event_type
    - prior_state
    - observed_state
    - expected_transition_matrix_ref
```

## Mapping to execution semantics

- **Event:** append-only, globally ordered input to validation and replay.
- **State:** lifecycle value constrained by legal transition matrix.
- **Ledger:** hash-linked sequence anchoring receipts and commit boundaries.
- **Replay:** pure reconstruction function over ordered events + fixed version bundle.

For end-to-end pipeline placement of checks, see [SYSTEM_FLOW](./SYSTEM_FLOW.md).
