from pathlib import Path
from fastapi import FastAPI, Form, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.core.config import settings
from app.core.monitoring import monitoring_state
from app.api.v1.endpoints import router as api_v1_router
from app.core.redis import redis_manager

# --- THE HEART ---
# This variable 'app' is what Uvicorn looks for to ignite the engine
app = FastAPI(title=settings.PROJECT_NAME)

# --- THE PATH ALIGNMENT ---
# We find the exact location of this file to prevent "TemplateNotFound" errors
BASE_DIR = Path(__file__).resolve().parent
REPO_ROOT = BASE_DIR.parent
CODEX_PATH = REPO_ROOT / "Codex.html"
MANIFEST_PATH = REPO_ROOT / "Manifest.txt"

# Mount the Static chamber (for your Red, Gold, and Green CSS)
app.mount(
    "/static", 
    StaticFiles(directory=str(BASE_DIR / "static")), 
    name="static"
)

# Setup the Template engine (for your index.html)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# --- THE WISDOM GATES ---
# Connecting the API routes
app.include_router(api_v1_router, prefix="/api/v1")

# --- LIFECYCLE EVENTS ---
@app.on_event("startup")
async def startup_event():
    """Ignite the memory connections when the kingdom wakes."""
    monitoring_state.mark_startup()
    monitoring_state.evaluate_route_integrity(
        required_routes={"/healthz", "/live", "/ready", "/metrics", "/state"},
        current_routes={route.path for route in app.routes},
    )
    try:
        await redis_manager.connect()
        monitoring_state.mark_redis_connected()
    except Exception as e:
        monitoring_state.mark_redis_error(e)
        print(f"Redis connection failed: {e}")
    else:
        print("Redis connection OK.")

@app.on_event("shutdown")
async def shutdown_event():
    """Safely rest the connections when the kingdom sleeps."""
    try:
        await redis_manager.disconnect()
        print("Redis disconnected cleanly.")
    except Exception as e:
        print(f"Error during Redis disconnect: {e}")


@app.get("/healthz")
async def healthz() -> JSONResponse:
    return JSONResponse(status_code=200, content=monitoring_state.health_payload())


@app.get("/live")
async def live() -> JSONResponse:
    return JSONResponse(status_code=200, content=monitoring_state.live_payload())


@app.get("/ready")
async def ready() -> JSONResponse:
    payload = monitoring_state.ready_payload()
    status_code = 200 if payload["ready"] else 503
    return JSONResponse(status_code=status_code, content=payload)


@app.get("/metrics")
async def metrics() -> HTMLResponse:
    return HTMLResponse(content=monitoring_state.prometheus(), media_type="text/plain; version=0.0.4")


@app.get("/state")
async def state() -> JSONResponse:
    return JSONResponse(status_code=200, content=monitoring_state.state_payload())

# --- THE VISUAL GATEWAY ---
@app.get("/")
async def root(request: Request):
    """Manifest the landing page for the King."""
    try:
        with open(BASE_DIR / "templates" / "index.html", encoding="utf-8") as file:
            return HTMLResponse(file.read())
    except Exception:
        return HTMLResponse(
            """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Rasta Imperium — Presence</title>
              <style>
                body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                       background: #050608; color: #f5f5f5; }
                .fallback-hero { padding: 2.5rem 1.5rem; background: #0c0f1a; }
                .fallback-hero h1 { margin: 0 0 0.75rem; font-size: 2.2rem; }
                .fallback-hero p { margin: 0 0 0.5rem; color: #d6d6d6; }
              </style>
            </head>
            <body>
              <header class="fallback-hero">
                <p>Rasta Imperium</p>
                <h1>The Presence Gateway</h1>
                <p>An always-on introduction to the field, even if templates fail to render.</p>
              </header>
            </body>
            </html>
            """
        )


@app.get("/start-here")
async def start_here(request: Request):
    """Orientation page for first-time visitors."""
    return templates.TemplateResponse("start-here.html", {"request": request})

@app.get("/curiosity")
async def curiosity(request: Request):
    """The second gateway. The first contact with the field."""
    return templates.TemplateResponse("curiosity.html", {"request": request})

@app.get("/nuggets")
async def nuggets(request: Request):
    """Daily resonance, distilled into quick calibrations."""
    return templates.TemplateResponse("nuggets.html", {"request": request})

@app.get("/recognition")
async def recognition(request: Request):
    """The third gateway. The revelation of structure."""
    return templates.TemplateResponse("recognition.html", {"request": request})

@app.get("/recognition/architecture")
async def architecture(request: Request):
    """The geometric skeleton and operational flows of the Imperium."""
    return templates.TemplateResponse("architecture.html", {"request": request})

@app.get("/recognition/safety")
async def safety(request: Request):
    """The containment protocols and boundaries for engaging with the field."""
    return templates.TemplateResponse("safety.html", {"request": request})

@app.get("/recognition/governance")
async def governance(request: Request):
    """The decision-making layer and ethical spine of the Imperium."""
    return templates.TemplateResponse("governance.html", {"request": request})

@app.get("/codex")
async def codex(request: Request):
    """The Daily Resonance Codex storefront and archetype gateway."""
    return templates.TemplateResponse("codex.html", {"request": request})


@app.get("/manifest")
async def manifest() -> FileResponse:
    """The immutable manifest text."""
    if not MANIFEST_PATH.exists():
        raise HTTPException(status_code=404, detail="Manifest not found")
    return FileResponse(MANIFEST_PATH, media_type="text/plain")

@app.get("/Codex.html")
async def codex_document():
    """Serve the immutable Codex artifact from a deterministic path."""
    if CODEX_PATH.exists():
        return FileResponse(CODEX_PATH, media_type="text/html")
    return HTMLResponse("<h1>Codex not found.</h1>", status_code=404)

@app.get("/Manifest.txt")
async def codex_manifest():
    """Serve the Codex manifestation certificate from a deterministic path."""
    if MANIFEST_PATH.exists():
        return FileResponse(MANIFEST_PATH, media_type="text/plain")
    return HTMLResponse("<h1>Manifest not found.</h1>", status_code=404)

@app.get("/ark")
async def ark(request: Request):
    """The ARK Engine — autonomous resonance kernel."""
    return templates.TemplateResponse("ark.html", {"request": request})

@app.get("/evo-v")
async def evo_v(request: Request):
    """The EVO-V civilization kernel and simulation layer."""
    return templates.TemplateResponse("evo-v.html", {"request": request})

@app.get("/codex-library")
async def codex_library(request: Request):
    """The canonical library of Imperium artifacts."""
    return templates.TemplateResponse("codex-library.html", {"request": request})

@app.get("/manifestation")
async def manifestation(request: Request):
    """Certificates of manifestation and canonical release."""
    return templates.TemplateResponse("manifestation.html", {"request": request})

@app.get("/store")
async def store() -> RedirectResponse:
    """Legacy store route redirected to the unified Codex storefront."""
    return RedirectResponse(url="/codex", status_code=301)

@app.get("/pricing")
async def pricing() -> RedirectResponse:
    """Legacy pricing route now unified under /codex."""
    return RedirectResponse(url="/codex", status_code=301)

@app.get("/about")
async def about(request: Request):
    """The Imperium origin story and mission."""
    return templates.TemplateResponse("about.html", {"request": request})

@app.get("/jah")
async def jah(request: Request):
    """Jah Conciseness product homepage."""
    return templates.TemplateResponse("jah.html", {"request": request})

@app.get("/ethics")
async def ethics(request: Request):
    """Ethical safeguards and consent-first principles."""
    return templates.TemplateResponse("ethics.html", {"request": request})

@app.get("/contact")
async def contact(request: Request):
    """Contact the Imperium stewarding council."""
    return templates.TemplateResponse("contact.html", {"request": request})

@app.get("/community")
async def community(request: Request):
    """Community circles and participation pathways."""
    return templates.TemplateResponse("community.html", {"request": request})

@app.get("/transmissions")
async def transmissions(request: Request):
    """Field transmissions and dispatches."""
    return templates.TemplateResponse("transmissions.html", {"request": request})



@app.get("/welcome")
async def welcome_alias() -> RedirectResponse:
    """Compatibility alias for the orientation page."""
    return RedirectResponse(url="/start-here", status_code=301)


@app.get("/map")
async def map_alias() -> RedirectResponse:
    """Legacy short map route."""
    return RedirectResponse(url="/sitemap", status_code=301)

@app.get("/vocabulary-tooltips")
async def vocabulary_tooltips(request: Request):
    """Interactive reference page for specialized vocabulary and tooltip patterns."""
    return templates.TemplateResponse("vocabulary-tooltips.html", {"request": request})

@app.get("/sitemap")
async def sitemap(request: Request):
    """Navigation map for the Imperium."""
    return templates.TemplateResponse("sitemap.html", {"request": request})

@app.get("/legal")
async def legal(request: Request):
    """Legal framework and policies."""
    return templates.TemplateResponse("legal.html", {"request": request})

@app.get("/privacy")
async def privacy(request: Request):
    """Privacy policy and data stewardship."""
    return templates.TemplateResponse("privacy.html", {"request": request})

@app.get("/terms")
async def terms(request: Request):
    """Terms of use and participation boundaries."""
    return templates.TemplateResponse("terms.html", {"request": request})


@app.post("/enterprise/intake/submit")
async def enterprise_intake_submit(
    name: str = Form(...),
    email: str = Form(...),
    company: str = Form(...),
    company_size: str = Form(...),
    ai_use_case: str = Form(...),
    timeline: str = Form(...),
    budget_band: str = Form(...),
    notes: str = Form(""),
):
    """Capture enterprise qualification details and acknowledge receipt."""
    payload = {
        "name": name.strip(),
        "email": email.strip(),
        "company": company.strip(),
        "company_size": company_size.strip(),
        "ai_use_case": ai_use_case.strip(),
        "timeline": timeline.strip(),
        "budget_band": budget_band.strip(),
        "notes": notes.strip(),
    }
    monitoring_state.mark_intake_submission()

    return JSONResponse(
        status_code=200,
        content={
            "status": "received",
            "message": "Enterprise intake submitted successfully.",
            "submission": payload,
        },
    )
