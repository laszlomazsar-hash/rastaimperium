# Rasta Imperium

**Laszlo Mazsar** — Founder & AI Systems Architect

I architect **constitutional intelligence systems** capable of enforcing epistemic integrity across autonomous infrastructures.

## Current Focus

- Rasta Imperium: Public narrative and constitutional layer
- EVO-V Kernel: Deterministic, replayable governance for civilization-scale AI
- Sovereign digital territories built on mythic-technical foundations

[Visit Site →](https://rastaimperium.com) | [Architecture →](/architecture) | [Governance →](/governance-model)

---

Rastaimperium is the **public documentation and narrative layer** for EVO-V.

It communicates architecture, constitutional principles, and institutional positioning.
It is not the execution runtime.

## Repository role
- Public-facing architecture and governance documentation
- Institutional communication surface
- Conceptual and constitutional framing for EVO-V

## Explicit non-goals
This repository must not contain runtime execution logic for EVO-V governance operations.

## Required docs
- `docs/HOME.md`
- `docs/ARCHITECTURE.md`
- `docs/CONSTITUTION.md`
- `docs/GLOSSARY.md`

## Production web deployment

`backend/static/` is the canonical, committed production website export. The
production ASGI entrypoint is `src.ark_safety.main:app`, which serves that
directory at `/`; Docker and Railway both start this entrypoint. GitHub Pages
publishes the same `backend/static/` directory through
`infra/scripts/deploy-pages.sh`.

To refresh the generated export, run the frontend build from
`non-kernel/frontend`, then copy the resulting `out/` directory into
`backend/static/` (the **Build Static Site** workflow performs this exact
operation). Do not deploy `public/` or a separate frontend build directory.
The artifact-integrity CI check rejects a reintroduced `public/index.html` and
checks that the Docker and Pages paths both resolve the canonical root page.

## Site pages
- `/vision`
- `/architecture`
- `/governance-model`
- `/institutional-pilots`
- `/about-evo-v-kernel`

## Core message
1. EVO-V is a deterministic governance kernel.
2. Rastaimperium is the constitutional/conceptual layer.
3. Execution occurs in a separate EVO-V repository.
4. The model is built around replayable, auditable systems.
