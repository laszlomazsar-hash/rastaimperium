# Rasta Imperium Canonical Architecture

## Version & Ownership
- Canonical architecture version: `3.6.0`
- Status: `active`
- Source of truth: `docs/ARCHITECTURE_CANONICAL.md`
- Machine-readable derivative: `config/blueprint-v3.5.json`

## Intent
This document is the authoritative architecture artifact for the repository.
All architecture summaries, blueprints, and generated representations must match this version.

## Derived Artifacts
- `config/blueprint-v3.5.json` (machine-readable blueprint used by tooling/integrations)

## Canonical Snapshot Determinism
- Canonical snapshot bytes MUST be derived from canonical row content only.
- Runtime ingestion/source order MUST NOT affect canonical snapshot bytes.
- If rows are exact duplicates, snapshot format MUST encode multiplicity explicitly (for example, `{row, count}`), instead of relying on positional duplicates.

## Update Workflow
When architecture changes, update files in this exact order:

1. **Update canonical architecture first**
   - Edit this file and bump `Canonical architecture version`.
2. **Update machine-readable derivative second**
   - Edit `config/blueprint-v3.5.json` and set both `version` and `metadata.architectureVersion` to the same version.
   - Ensure `metadata.sourceOfTruth` points to this file.
3. **Run version validation**
   - Execute `python scripts/validate_architecture_version.py`.
4. **Update references/documentation**
   - If links or guidance changed, update README's "Version & Source of Truth" section.
5. **Commit all architecture updates together**
   - Canonical doc, derivative JSON, validation script changes, and README updates should land in one commit.
