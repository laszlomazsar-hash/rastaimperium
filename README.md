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

## One-command deploy
```bash
npm run deploy
```

`deploy` currently performs a production build + static export. Publish the `out/` directory to GitHub Pages for `rastaimperium.github.io`.

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

> Important backend note: `app/core/database.py` uses `os.getenv("DATABASE_URL", "sqlite:///./app.db")`.  
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
