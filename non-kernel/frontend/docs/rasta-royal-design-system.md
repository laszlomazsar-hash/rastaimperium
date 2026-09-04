# Rasta Royal — Design System Implementation Snippets

**Philosophy:** Dignified, ceremonial, evidence-led.  
Every visual choice supports: *"Do not trust the claim. Inspect the evidence."*

---

## 1. Color Tokens

### CSS variables (globals.css)

```css
:root {
  /* Rasta Trinity */
  --rasta-red: #e01e1e;
  --rasta-gold: #ffcc00;
  --rasta-green: #107e3e;
  --deep-earth: #0a0a0a;

  /* Royal derivatives */
  --royal-ink: #070807;
  --royal-gold: #f2d675;
  --royal-gold-deep: #b88718;
  --royal-green: #1e8a4b;
  --royal-red: #a92d2d;
  --royal-line: rgba(242, 214, 117, 0.24);
  --royal-panel: rgba(15, 18, 13, 0.82);
  --royal-panel-strong: rgba(19, 23, 16, 0.94);
  --royal-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
}
```

### TypeScript tokens (`theme/tokens/color.ts`)

```ts
import { color } from "@/theme/tokens/color";

// Usage
const border = color.royal.line;
const verifiedGlow = color.status.verified.border;
```

### Tailwind utilities

```tsx
<div className="bg-royal-ink text-royal-gold border-rasta-green">
  Sovereign panel
</div>
```

---

## 2. Typography

```tsx
{/* Mythic / ceremonial headings */}
<h1 className="font-cinzel text-4xl tracking-tight text-zinc-50">
  Do not trust the claim.
</h1>

{/* Operational body */}
<p className="font-raleway text-base leading-7 text-zinc-300">
  Inspect the evidence.
</p>

{/* Evidence / hashes / telemetry */}
<code className="font-courier text-xs text-zinc-400">
  ART-L7-REPLAY-001
</code>
```

CSS equivalent:

```css
h1, h2, h3, h4 { font-family: 'Cinzel', Georgia, serif; }
p, a, li, button { font-family: 'Raleway', Calibri, sans-serif; }
code, pre { font-family: 'Courier New', monospace; }
```

---

## 3. Signature Gradient Text

```tsx
<span className="text-gold-gradient">
  Inspect the evidence.
</span>
```

```css
.text-gold-gradient {
  background: linear-gradient(
    to right,
    var(--rasta-green),
    var(--rasta-gold),
    var(--rasta-red)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 4. Royal Panel (Glass-morphism)

```tsx
<div className="royal-panel rounded-xl border p-5">
  {/* content */}
</div>
```

```css
.royal-panel {
  border-color: var(--royal-line);
  background: linear-gradient(
    145deg,
    var(--royal-panel-strong),
    var(--royal-panel)
  );
  box-shadow: var(--royal-shadow), inset 0 1px 0 rgba(242, 214, 117, 0.08);
  backdrop-filter: blur(12px);
}

.royal-panel:hover {
  border-color: rgba(242, 214, 117, 0.48);
  box-shadow:
    0 28px 80px rgba(0, 0, 0, 0.48),
    0 0 24px rgba(242, 214, 117, 0.07),
    inset 0 1px 0 rgba(242, 214, 117, 0.1);
}
```

---

## 5. Royal Seal Wrap

```tsx
<div className="royal-seal-wrap">
  <ProvenanceBadge kind="HISTORICAL" />
</div>
```

```css
.royal-seal-wrap {
  position: relative;
  width: fit-content;
  padding: 0.65rem;
  border: 1px solid rgba(242, 214, 117, 0.45);
  border-radius: 1.25rem;
  background: linear-gradient(
    145deg,
    rgba(242, 214, 117, 0.12),
    rgba(30, 138, 75, 0.09) 48%,
    rgba(169, 45, 45, 0.12)
  );
  box-shadow:
    0 0 0 0.35rem rgba(242, 214, 117, 0.03),
    0 0 48px rgba(242, 214, 117, 0.14);
}
```

---

## 6. Buttons with Shimmer Sweep

```tsx
{/* Primary */}
<Link
  href="/institutional-pilots/"
  className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
>
  Pilot with us
</Link>

{/* Ghost */}
<Link
  href="/limitations/"
  className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
>
  Read Limitations first
</Link>
```

```css
.royal-button {
  position: relative;
  overflow: hidden;
}

.royal-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 18%,
    rgba(255, 255, 255, 0.22) 48%,
    transparent 78%
  );
  transform: translateX(-125%);
  transition: transform 0.65s ease;
  pointer-events: none;
}

.royal-button:hover::before,
.royal-button:focus-visible::before {
  transform: translateX(125%);
}
```

---

## 7. Evidence Badges

```tsx
import { ProvenanceBadge, VerificationBadge } from "@/components/evidence/ProvenanceBadge";

<VerificationBadge status="VERIFIED" />
<ProvenanceBadge kind="HISTORICAL" />
<ProvenanceBadge kind="DEMONSTRATION" />
<ProvenanceBadge kind="UNAVAILABLE" />
```

Status vocabulary:

| Status         | Meaning                              |
|----------------|--------------------------------------|
| VERIFIED       | Independently reproducible           |
| DEMONSTRATION  | Synthetic / illustrative             |
| HISTORICAL     | Past artifact, not current LIVE      |
| TARGET         | Aspiration / roadmap                 |
| UNAVAILABLE    | Explicitly unproven                  |

---

## 8. Trust Status Component

```tsx
import { TrustStatus } from "@/components/evidence/TrustStatus";

{/* Compact — homepage */}
<TrustStatus compact />

{/* Full — /trust page */}
<TrustStatus />
```

---

## 9. Claim Evidence Card

```tsx
import { ClaimEvidence } from "@/components/evidence/ClaimEvidence";

<ClaimEvidence claimId="CLAIM-REPLAY-001" />
<ClaimEvidence claimId="CLAIM-LIFECYCLE-001" />
```

---

## 10. Architecture Layer Card

```tsx
import { ArchitectureLayerCard } from "@/components/evidence/ArchitectureLayerCard";
import { architectureLayers } from "@/data/evidence/architecture";

{architectureLayers.map((layer) => (
  <ArchitectureLayerCard
    key={layer.layerId}
    layer={layer}
    defaultOpen={layer.layerId === "L7"}
  />
))}
```

---

## 11. Sacred Geometry Background

Already applied globally via `body::before` + `body::after` in `globals.css`.

```css
/* Seed of Life — 180s rotation */
body::before {
  /* ... SVG Seed of Life at 4% gold opacity */
  animation: sacredRotate 180s linear infinite;
}

/* Ambient glow pulse — 8s */
body::after {
  background: radial-gradient(circle, rgba(184, 134, 11, 0.04) 0%, transparent 70%);
  animation: glowPulse 8s ease-in-out infinite;
}
```

Respects `prefers-reduced-motion`.

---

## 12. Hero Split Layout

```tsx
<section className="royal-hero">
  <div className="container-page hero-split">
    {/* Left — mythic headline + CTAs */}
    <div>
      <h1 className="royal-title">
        Do not trust the claim.
        <span className="text-gold-gradient block">Inspect the evidence.</span>
      </h1>
      {/* ... */}
    </div>

    {/* Right — telemetry / status panel */}
    <aside className="hero-status-panel">
      {/* DEMONSTRATION badge + monospace stats */}
    </aside>
  </div>
</section>
```

Responsive behaviour is defined in `globals.css` under the breakpoint media queries.

---

## 13. Accessibility Notes

```css
:focus-visible {
  outline: 2px solid var(--royal-gold);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Always prefer semantic HTML + ARIA labels on evidence regions.

---

## Quick Reference — Class Cheatsheet

| Class                  | Purpose                              |
|------------------------|--------------------------------------|
| `.royal-page`          | Page isolation + subtle gradient     |
| `.royal-hero`          | Hero with ceremonial halo            |
| `.royal-panel`         | Glass panel with gold border         |
| `.royal-seal-wrap`     | Nested glowing seal                  |
| `.royal-button`        | Shimmer sweep on hover               |
| `.royal-button-primary`| Gold filled CTA                      |
| `.royal-button-ghost`  | Outline CTA                          |
| `.text-gold-gradient`  | Green → Gold → Red text              |
| `.royal-title`         | Cinzel + text shadow                 |
| `.royal-lede`          | Body lede styling                    |
| `.royal-kicker`        | Gold micro-label                     |
| `.hero-split`          | Responsive 1.15 / 0.85 grid          |
| `.hero-status-panel`   | Telemetry / status glass card        |

---

*Rasta Imperium — Public constitutional & verification surface for EVO-V.*
