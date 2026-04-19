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
NEXT_PUBLIC_API_URL="https://codebylaszlo-rastaimperium-backend.hf.space" npm run deploy
```

`deploy` now performs a real publication step: it validates `NEXT_PUBLIC_API_URL`, runs `next build` (static export to `out/`), then publishes `out/` to the `gh-pages` branch via the `gh-pages` CLI.

### Required environment variables
- `NEXT_PUBLIC_API_URL` (**required**): public backend API base URL used at build time.

### Optional environment variables
- `NEXT_PUBLIC_BASE_PATH` (optional, default: `/rastaimperium`): set this to match your GitHub Pages target path.
  - Use `/rastaimperium` for project Pages URLs like `https://<owner>.github.io/rastaimperium`.
  - Use an empty string (`""`) when serving from a custom domain root.

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
