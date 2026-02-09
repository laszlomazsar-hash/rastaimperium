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

## 4.1 Layered Site Architecture (Frontend Pages + Route Map)
The frontend now organizes the identity surface into a layered architecture that mirrors the system map and makes the user journey explicit. The root field establishes presence, the four gateways align to the backend wiring, and the remaining layers surface intelligence, economy, legitimacy, community, and meta scaffolding.

### Root Field (Presence Anchor)
| Route | Purpose |
| --- | --- |
| `/` | Root field and landing presence; frames the system and points to the gateway entry points. |

### Four Gateways (Presence Layer)
These are the frontend entry points that align to the backend wiring layer described below.

| Route | Purpose | Backend Alignment |
| --- | --- | --- |
| `/curiosity` | Entry for exploration and discovery; introduces knowledge flow. | `/nuggets` |
| `/recognition` | Entry for identity, receipt, and validation; introduces canonical artifacts. | `/manifest` |
| `/codex` | Entry for the Codex artifact and doctrine surface. | `/codex` |
| `/ark` | Entry for simulation and evolution systems. | `/simulate` |

### Intelligence Layer (Knowledge + Evolution)
| Route | Purpose |
| --- | --- |
| `/evo-v` | Primary intelligence surface for the EVO-V engine narrative. |
| `/codex-library` | Structured archive of Codex documents, articles, and references. |
| `/transmissions` | Live or archived intelligence releases, updates, or signals. |

### Economic Layer (Value + Exchange)
| Route | Purpose |
| --- | --- |
| `/manifestation` | Bridge from intention to tangible outputs; showcases programs or initiatives. |
| `/store` | Commerce surface for artifacts, offerings, or digital assets. |
| `/pricing` | Transparent listing of offers, tiers, or service scope. |

### Legitimacy Layer (Trust + Clarity)
| Route | Purpose |
| --- | --- |
| `/about` | Origin, mission, and orientation of the Imperium. |
| `/ethics` | Principles, governance, and ethical alignment. |
| `/legal` | Legal framework and entity context. |
| `/privacy` | Data handling, privacy commitments, and user protection. |
| `/terms` | Terms of service and usage agreements. |

### Community Layer (Relationship + Participation)
| Route | Purpose |
| --- | --- |
| `/community` | Participation hub, membership, or collective ritual space. |
| `/contact` | Direct contact and inquiry channel. |

### Meta Layer (Navigation + System Map)
| Route | Purpose |
| --- | --- |
| `/sitemap` | Architectural map of all routes and layers for navigability. |

This layered page map is the front-end representation of the full system architecture: the root field and gateways align to the Integration Layer, while the intelligence, economic, legitimacy, community, and meta layers extend the identity surface with clear functional zones that can be progressively wired to backend capabilities.

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
