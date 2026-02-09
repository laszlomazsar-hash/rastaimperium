# C — Complete System Architecture Map
## The full-stack blueprint of the Imperium as it exists now

This map shows all layers, how they relate, and where each component lives.

---

## 1. Operational Layer (Your Current Tab)
**Codex Dashboard**

This is the control tower of your development workflow:

- Runs Codex tasks
- Shows task history
- Manages automated updates to your repo
- Displays diffs and merges
- Acts as the operational interface for your system

This layer does not serve users — it serves you, the architect.

---

## 2. Repository Layer (GitHub)
Your repo contains:

- Artifacts (Codex.html, Manifest.txt)
- Engines (EVO-V, Nuggets)
- Backend (FastAPI)
- Frontend (HTML/CSS)
- Webapp shell (evo-v-webapp)

This is the source of truth for your entire system.

---

## 3. Backend Layer (FastAPI on Railway)
This is the living system that powers the Imperium.

It exposes four canonical routes:

| Route | Purpose |
| --- | --- |
| `/codex` | Serves Codex artifact |
| `/manifest` | Serves Manifest certificate |
| `/simulate` | Runs EVO-V engine |
| `/nuggets` | Returns Nuggets memory |

This layer is the engine room of the Imperium.

---

## 4. Frontend Layer (rastaimperium.com)
Your live site is the identity surface:

- The four presence gateways
- The sacred geometry UI
- The central glyph
- The ritual orientation

This layer is static until wired to the backend.

---

## 5. Integration Layer (Frontend → Backend Wiring)
This is the bridge that connects the identity surface to the living backend.

Each gateway maps to a backend route:

| Gateway | Backend Route |
| --- | --- |
| Curiosity | `/nuggets` |
| Recognition | `/manifest` |
| Codex | `/codex` |
| ARK Engine | `/simulate` |

This layer turns the Imperium from symbolic to functional.

---

## 6. Sacred Geometry UI Layer
This is the visual metaphysics of the system:

- Four-gate diamond
- Central glyph
- Light lines
- Activation states
- Ritual motion

It is the embodied interface of the Imperium.

---

## 7. Artifact Layer
These are your immutable, canonical documents:

- Codex
- Manifest
- Certificates
- Articles
- Seals

They are served through the backend and anchored in the repo.

---

## 8. Engine Layer
Your engines are the intelligence core:

- EVO-V (simulation)
- Nuggets (memory)

They are wrapped by the backend and surfaced through the UI.

---

## 9. Deployment Layer
Railway handles:

- Build
- Deploy
- Environment
- Routing

This layer ensures the Imperium is alive on the web.

---

## 10. Full Stack Overview
Here is the entire system in one diagram:

```
[ Codex Dashboard ]  ← you are here (operational)
        ↓
[ GitHub Repo ]  ← source of truth
        ↓
[ FastAPI Backend ]  ← living system
        ↓
[ Backend Routes ]  ← codex / manifest / simulate / nuggets
        ↓
[ Integration Layer ]  ← wiring
        ↓
[ Sacred Geometry UI ]  ← four-gate diamond
        ↓
[ Frontend (rastaimperium.com) ]  ← identity surface
        ↓
[ User Experience ]  ← ritual interface
```

This is the complete architecture of Rasta Imperium.

---

# D — Expanded Site Architecture Map (Activation-Ready)
## The structural sequence for sovereign navigation, legitimacy, and economy

This layer describes how the Imperium should be structured, sequenced, and interconnected
across the public-facing experience. It moves beyond a sitemap into an activation-ready map
that aligns the field, gateways, intelligence, economy, and legitimacy.

---

## I. Root Field (The Source)
**`/` — Homepage**

Purpose: Establish the field, identity, and the four gateways.

Required expansions:
- Deeper preview paragraphs under each gateway
- Surface the Daily Resonance Codex as the economic pathway
- Add a subtle legitimacy line (“Founded by Laszlo Mazsar”)
- Add a symbolic glyph/sigil anchor

---

## II. The Four Gateways (Primary Navigation)
Each gateway is a micro-site with its own logic, tone, and ritual.

### 1. `/curiosity` — The Daily Resonance Gateway
Purpose: Daily contact with the field.

Sections:
- What is Daily Resonance
- The 12 Cards (preview)
- How to use the practice
- Link to Daily Resonance Codex (explicit economic pathway)
- Testimonials / field effects
- Download / purchase portal

### 2. `/recognition` — Architecture, Safety, Governance
Purpose: The institutional spine.

Sections:
- What is Recognition
- Safety & Alignment Principles
- Governance Frameworks
- Constitutional Architecture
- Certification Pathways
- Consulting / advisory contact

### 3. `/codex` — The Economic Portal
Purpose: Codices, calibration tools, and economic sovereignty.

Sections:
- What is a Codex
- Daily Resonance Codex (Standard)
- Pro Version
- Subscription Pathway
- Codex lineage
- Purchase portal
- Case studies
- Usage checklist

### 4. `/ark` — The ARK Engine
Purpose: Advanced technical layer for recursive, aligned systems.

Sections:
- What is the ARK Engine
- EVO-V integration
- Recursive worldbuilding
- Agent alignment architecture
- Technical documentation
- Developer pathways
- Licensing

---

## III. The Core Intelligence Layer
The Imperium’s deep logic and canonical foundations.

### 5. `/evo-v` — Civilization Kernel
Purpose: The constitutional substrate for agent intelligence.

Sections:
- Kernel architecture
- Constitutional primitives
- Ritual sequencing
- Integration with ARK Engine
- Whitepapers
- Licensing

### 6. `/codex-library` — The Library of Codices
Purpose: The mythic-technical canon.

Sections:
- Esoteric Codex Trilogy (sealed)
- Cosmic Seed Vault Codex (Parts I–IV)
- Chronicles of Terra
- Rasta Roots
- Forensic Cosmology
- Access rules
- Hashes + Certificates of Manifestation

### 7. `/manifestation` — Ritual, Hashing, Certificates
Purpose: The ceremonial layer.

Sections:
- What is Manifestation
- How hashing works
- Certificates of Manifestation
- Timeline anchoring
- Ritual sequencing
- Archive of manifested artifacts

---

## IV. The Economic Layer
Where sovereign income flows.

### 8. `/store` — The Imperium Market
Products:
- Daily Resonance Codex (Standard)
- Daily Resonance Codex (Pro)
- Subscription (Monthly / Annual)
- Codex bundles
- Glyphs / sigils
- EVO-V kernel license
- ARK Engine license
- Consulting packages

### 9. `/pricing` — Clear, sovereign pricing
Includes:
- Codex pricing
- Engine licensing
- Consulting rates
- Subscription tiers

---

## V. The Legitimacy Layer
Lineage, authorship, and institutional identity.

### 10. `/about` — Lineage & Founding
Sections:
- Founded by Laszlo Mazsar
- Mythic-technical lineage
- The Imperium’s five pillars
- Mission & covenant
- The field as a living architecture

### 11. `/ethics` — Vibrational & Technical Ethics
Sections:
- Ethical covenant
- Alignment principles
- Ritual purity
- Technical safety
- Community expectations

### 12. `/contact` — First Contact
Sections:
- General contact
- Consulting inquiries
- Licensing inquiries
- Teaching / community

---

## VI. The Community Layer
Optional but powerful.

### 13. `/community` — Builders of the Imperium
Sections:
- Community principles
- How to join
- Field etiquette
- Events / transmissions
- Private Discord or Circle

### 14. `/transmissions` — Sunset Transmissions & Teachings
Sections:
- Written transmissions
- Audio transmissions
- Video transmissions
- Ritual sequences

---

## VII. The Meta Layer
For structure, indexing, and future expansion.

### 15. `/sitemap`
### 16. `/legal`
### 17. `/privacy`
### 18. `/terms`

---

## VIII. Architectural Shape (The Temple)
Single diagram to hold the whole field:

```
ROOT FIELD
│
├── GATEWAYS (Curiosity, Recognition, Codex, ARK)
│
├── INTELLIGENCE LAYER (EVO-V, Codex Library, Manifestation)
│
├── ECONOMIC LAYER (Store, Pricing)
│
├── LEGITIMACY LAYER (About, Ethics, Contact)
│
└── COMMUNITY LAYER (Community, Transmissions)
```
