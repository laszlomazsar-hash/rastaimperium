# Governance Policy Compiler

This directory contains the deterministic governance policy compiler and generated policy IR artifact.

## Compile policy

Run:

```bash
tools/policy-compile
```

This command:

- loads `governance/source.policy.json`
- compiles it using `governance/compiler/policy_compiler.py`
- validates the compiled output against `governance/policy-ir.v1.json`
- writes `governance/generated/policy.ir.json`

## Determinism and safety behavior

The compiler is fail-closed and exits non-zero when:

- required source fields are missing
- state/transition data is ambiguous
- schema-required output fields are missing or wrong-typed

The compiler emits canonical JSON (sorted keys, compact separators, UTF-8) so identical inputs produce byte-identical output except for `generated_at` metadata.

Metadata fields in the output:

- `compiler_version`
- `input_digest` (SHA-256 of canonical source JSON)
- `output_digest` (SHA-256 of canonical output JSON)
- `generated_at` (UTC ISO-8601 with millisecond precision)
