# Rasta Imperium Main Domain v1.1

Next.js 15 static-export frontend for `rastaimperium.com`.

## Pages
- `/` homepage with Hero → Pillars → Vision → Email capture → Featured Products (+ continuity sections)
- `/empire`
- `/pillars`
- `/library`
- `/intelligence`

## Brand Tokens
- Gold: `#B8860B`
- Deep Green: `#1A3A2A`
- Black: `#111111`
- Heading font: Georgia
- Body font: Calibri
- Code font: Courier New
- Icons: 🦁 ☀️ 🌀

## Local Development
```bash
npm install
npm run dev
```

## Production Build (GitHub Pages-ready static export)
```bash
npm run build
```

Build output is generated in `out/` via `next.config.ts` static export settings.

## Build-time API configuration (GitHub Pages)

Set `NEXT_PUBLIC_API_URL` during the static build to your Render backend URL (for example `https://your-render-service.onrender.com`).

> Guard: if `NEXT_PUBLIC_API_URL` is unset, the static frontend falls back to relative API paths (e.g. `/api/v1/...`). On GitHub Pages this points to the Pages origin and API calls will fail unless you proxy them.

Key API callers already route through `apiUrl("/api/v1/...")`:
- `frontend/app/consulting/checkout.tsx` (lead submission)
- `frontend/app/dashboard/admin/page.tsx` (admin pipeline fetch)

## One-command deploy
```bash
NEXT_PUBLIC_API_URL="https://codebylaszlo-rastaimperium-backend.hf.space" npm run deploy
```

`deploy` now performs a real publication step: it validates `NEXT_PUBLIC_API_URL`, runs `next build` (static export to `out/`), then publishes `out/` to the `gh-pages` branch via the `gh-pages` CLI.

### Required environment variables
- `NEXT_PUBLIC_API_URL` (**required**): public backend API base URL used at build time.

### Optional environment variables
- `NEXT_PUBLIC_BASE_PATH` (optional, default: `/rastaimperium`): set this to match your GitHub Pages target path.
  - Use `/rastaimperium` for project Pages URLs like `https://<owner>.github.io/rastaimperium`.
  - Use an empty string (`""`) when serving from a custom domain root.

## Render Backend Configuration (Required)

When deploying the backend service on Render, configure the database connection explicitly so production does **not** fall back to local SQLite.

### 1) Set `DATABASE_URL` in Render service settings
1. Open your Render backend service.
2. Go to **Environment**.
3. Add `DATABASE_URL` as an environment secret (do not hardcode this in source files).

### 2) Use the Supabase Postgres connection string
1. In Supabase, open your project.
2. Go to **Project Settings → Database**.
3. Copy the Postgres connection string.
4. Paste that value into Render as `DATABASE_URL`.

### 3) Never commit credentials to `.env` files
- Keep real credentials in Render/Supabase secrets management.
- Do **not** commit production secrets to `.env` files tracked by git.

### 4) Post-deploy verification checklist
After each deploy, verify both app health and database-backed behavior:

1. **Health check**
   - `GET /healthz`
2. **Database-backed endpoint check**
   - `GET /api/v1/leads` (or another endpoint that requires DB access)

Example:
```bash
curl -fsS https://<your-render-service>/healthz
curl -fsS https://<your-render-service>/api/v1/leads
```

> Important backend note: `frontend/app/core/database.py` uses `os.getenv("DATABASE_URL", "sqlite:///./app.db")`.  
> If `DATABASE_URL` is missing in Render, the app will silently use SQLite (`./app.db`) instead of Supabase Postgres.

## Namecheap DNS Setup (Custom Domain → HF Spaces Frontend)

Use these exact steps to route `rastaimperium.com` from Namecheap to the frontend space.

### 1) Log in to Namecheap
1. Go to `https://www.namecheap.com`.
2. Sign in to your Namecheap account.
3. Open **Manage Domains** from your dashboard.
4. Select `rastaimperium.com`.

### 2) Open DNS settings
1. Open the **Domain** tab.
2. Click **Manage DNS** / **Advanced DNS**.

### 3) Add the CNAME record
In the DNS Records section, add:

| Field | Value |
|-------|-------|
| Type | `CNAME` |
| Host | `@` (or blank if Namecheap defaults to root) |
| Value / Points to | `codebylaszlo-rastaimperium.hf.space` |
| TTL | `3600` (or default) |

Save the record (checkmark icon in Namecheap UI).

### 4) Verify propagation
1. Wait **5–15 minutes**.
2. Open `https://rastaimperium.com`.
3. Confirm the frontend loads.

### Troubleshooting
If not live after ~15 minutes:
- Confirm the record value is exactly `codebylaszlo-rastaimperium.hf.space`.
- Check Namecheap record status for pending propagation.
- Flush local DNS cache if needed:

```bash
# macOS
sudo dscacheutil -flushcache

# Windows (PowerShell as admin)
ipconfig /flushdns

# Linux
sudo systemctl restart systemd-resolved
```

### Final checklist
- [ ] CNAME added at Namecheap
- [ ] Waited 5–15 minutes for propagation
- [ ] `https://rastaimperium.com` loads frontend
- [ ] Backend health check passes:
      `https://codebylaszlo-rastaimperium-backend.hf.space/healthz`
- [ ] Frontend calls API endpoints successfully



## CI path-routing policy (predict checks before push)

CI check routing for this repository is documented in `docs/operations/ci-path-routing.md`.

- Frontend page-only changes route to frontend page checks.
- Backend Python changes route to backend lint and tests.
- Shared infra/workflow changes route to the full workflow matrix.

## PR/CI debugging: job scope first

When triaging lint failures (especially `F821 undefined name`), identify the workflow job
and its `working-directory` before inspecting code.

- `infra/.github/workflows/python-package-conda.yml` → `build-linux` sets
  `working-directory: backend`, and its lint step targets `src migrations` under `backend/`.
- Treat those `F821` reports as **backend tree** issues first (`backend/src/**`,
  `backend/migrations/**`).
- If you need lint coverage for another root such as `evo-v-core/`, add a separate explicit
  lint job (or matrix entry) with its own `working-directory` and target paths, rather than
  mixing repository roots in one implicit command.

## Hugging Face Spaces deployment bridge (canonical)

For deterministic Spaces builds in this monorepo, Hugging Face should build from the **`infra/Dockerfile`**.

- The root Dockerfile intentionally copies only EVO-V runtime files from `evo-v-core/` into `/app`:
  - `evo-v-core/requirements.txt`
  - `evo-v-core/app/**`
- Runtime entrypoint remains `app.main:app` inside the container.
- Root `.dockerignore` keeps the build context minimal and excludes unrelated monorepo assets.

### Why this exists

The repository contains multiple app surfaces (frontend, backend, docs, and legacy deployment files).  
The root HF bridge prevents accidental coupling to unrelated root-level files while keeping EVO-V source canonical in `evo-v/`.

### Entrypoint precedence during HF build

When Spaces builds with Docker, it uses the root `Dockerfile` command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}
```

`Procfile` and other non-Docker entrypoints are not used by Hugging Face Docker builds.

## CI conventions: Python working directories and import roots

To keep CI deterministic, Python workflow steps must always declare explicit `working-directory`, target paths, and (when needed) step-level `PYTHONPATH`.

- `backend` project:
  - Use repository root (`.`) for repo-level scripts under `infra/scripts/`.
  - Use `working-directory: backend` for backend lint and tests.
  - Lint targets must be explicit (for example: `src`, `migrations`, `tests`).
  - Test target must be explicit (for example: `pytest tests`).
  - Set `PYTHONPATH: src` for lint/test steps so imports resolve from `backend/src` without relying on implicit shell cwd behavior.
- `evo-v-core` project:
  - Use `working-directory: evo-v-core` for project-local lint/test commands.
  - Prefer package-qualified imports rooted at the project package instead of cwd-sensitive imports like `from state import ...`.
  - If tests run from outside `evo-v-core`, set `PYTHONPATH` explicitly to the intended source root.

General rule: avoid implicit import resolution that changes with cwd; CI should encode import roots directly in workflow step configuration.
