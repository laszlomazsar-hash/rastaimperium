from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="Rasta Imperium",
    description="Deterministic Governance for Civilization-Scale AI",
    version="1.0"
)

# Mount static files if they exist (Next.js build)
static_dir = "non-kernel/frontend/out"
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Rasta Imperium</title>
        <meta charset="utf-8">
        <style>
            body { 
                font-family: system-ui, -apple-system, sans-serif; 
                background: #0a0a0a; 
                color: #e0e0e0; 
                text-align: center; 
                padding: 80px 20px;
                margin: 0;
            }
            h1 { font-size: 3.5rem; margin-bottom: 20px; color: #00cc66; }
            p { font-size: 1.3rem; max-width: 600px; margin: 0 auto 40px; }
            a { color: #00ff88; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
            .logo { font-size: 5rem; margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <div class="logo">🌿</div>
        <h1>Rasta Imperium</h1>
        <p>Deterministic Governance for Civilization-Scale AI</p>
        <p>
            <a href="/docs">→ API Documentation</a><br><br>
            <a href="/applications">→ Applications</a>
        </p>
    </body>
    </html>
    """

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "rastaimperium"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
