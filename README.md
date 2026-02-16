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
