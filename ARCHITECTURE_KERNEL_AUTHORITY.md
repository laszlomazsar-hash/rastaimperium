# Kernel Authority Boundary

This repository defines authoritative execution semantics **only** within the kernel directories:

- `runtime/`
- `ledger/`
- `governance/`
- `tests/`
- `docs/kernel/`

All other directories are non-authoritative for kernel execution semantics and are treated as archival, reference, or non-kernel surfaces.

Core validation entry points (imports, lint, tests, and policy checks) must resolve to kernel directories only.
