# Deprecated legacy tree (`evo-v/`)

`evo-v/` is a **non-runtime compatibility location** and is hard-deprecated.

## Policy

- Do not add new Python modules, imports, or executable entrypoints under `evo-v/`.
- Do not route new runtime behavior through `evo-v/`.
- All runtime Python changes must be made under `backend/src/`.

CI enforces this policy using `infra/scripts/check_legacy_runtime_reintroduction.sh`.
