# Runtime import policy

Legacy imports are runtime-fatal.

The production startup path installs `backend.src.runtime_import_guard.install_legacy_import_guard()`,
which blocks imports of the legacy `evo-v`/`evo_v` namespace with a deterministic `ImportError`.

Migration and tooling scripts can opt in temporarily by setting:

- `RASTA_TOOLING_ALLOW_LEGACY_IMPORTS=1`

This allowlist path is explicitly tool-only and must not be enabled in production runtime.
