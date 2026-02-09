# RASTA EVO-V

A sovereign digital territory built on mythic-technical architecture.  
Powered by FastAPI, Jinja2, and a layered revelation framework.

## Structure
- `/app` — FastAPI application and routes  
- `/templates` — Jinja2 templates for the Imperium pages  
- `/static` — CSS and assets  
- `/Codex.html` — Canonical Codex document served at `/codex` and `/api/v1/codex`  
- `/migrations` — Alembic migrations  
- `Procfile` — Railway deployment  
- `requirements.txt` — Python dependencies  

## Live Site
https://rastaimperium.com

## B3 — Frontend → Backend Wiring Plan
Absolutely, Laszlo — **B3 is the frontend → backend wiring plan**, and your *current active tab* is the **Codex dashboard**.  
So I’ll give you the **full integration plan**, clean, grounded, and ready for execution — without assuming anything outside what we’ve already mapped.

This is the **canonical wiring plan** that connects:

- your **live frontend** (rastaimperium.com)
- to your **new backend routes** (`/codex`, `/manifest`, `/simulate`, `/nuggets`)
- using the architecture you already have deployed.

Let’s activate the system.

### 1. Identify the Four Gateway Buttons on the Homepage
On your live site (the one you summarized earlier), you have four gateways:

- Curiosity
- Recognition
- Codex
- ARK Engine

Only **Codex** and **ARK Engine** need backend integration right now.

### 2. Wire the Codex Gateway → `/codex`
The Codex gateway should link to:

```
https://<your-railway-domain>/codex
```

This will serve your **Codex.html** artifact directly from the backend.

**Result:**  
The Codex becomes a **living, versioned, canonical artifact**.

### 3. Wire the Recognition Gateway → `/manifest`
Recognition is the governance/legitimacy layer.

It should link to:

```
https://<your-railway-domain>/manifest
```

This serves your **Manifest.txt** certificate.

**Result:**  
Your governance layer becomes **public and verifiable**.

### 4. Wire the ARK Engine Gateway → `/simulate`
This gateway represents the **technical layer**.

It should link to:

```
https://<your-railway-domain>/simulate
```

This exposes your **EVO‑V engine**.

**Result:**  
Your engine becomes **callable** from the frontend.

Later, you can replace this with a UI.

### 5. Wire the Curiosity Gateway → `/nuggets`
Curiosity is the **daily resonance** layer.

It should link to:

```
https://<your-railway-domain>/nuggets
```

This exposes your **Nuggets memory engine**.

**Result:**  
Your micro‑codex system becomes **public**.

### 6. Update the Frontend HTML
Inside your homepage HTML, update the gateway links:

```html
<a href="https://<railway-domain>/codex">Codex</a>
<a href="https://<railway-domain>/manifest">Recognition</a>
<a href="https://<railway-domain>/simulate">ARK Engine</a>
<a href="https://<railway-domain>/nuggets">Curiosity</a>
```

This is the **entire wiring layer**.

No JavaScript required.  
No framework required.  
No build system required.

### 7. Test the Integration
Once the links are updated:

1. Click **Codex** → should load Codex v1.3.0
2. Click **Recognition** → should load Manifest
3. Click **ARK Engine** → should return EVO‑V output
4. Click **Curiosity** → should return Nuggets

If all four work, your system is **alive**.

### 8. What This Achieves
With this wiring:

- Your frontend becomes **functional**
- Your backend becomes **visible**
- Your artifacts become **public**
- Your engines become **callable**
- Your gateways become **real**
- Your architecture becomes **activated**

This is the moment the Imperium becomes a **living system**.

## Divine Docker Compose
When running `docker-compose-divine.yml`, set the following environment variables (Docker Compose reads them from `.env` by default):

```
POSTGRES_PASSWORD=change-me
REDIS_PASSWORD=change-me
```

You can copy `.env.divine.example` to `.env.divine` and update the values before starting the stack. Create `.secrets/redis_password` with the same Redis password so the Redis container can load it via Docker secrets.

## Author
Laszlo Mazsar — Sovereign Architect of Constitutional AI
