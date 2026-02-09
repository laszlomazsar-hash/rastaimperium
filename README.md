# RASTA EVO-V

A sovereign digital territory built on mythic-technical architecture.  
Powered by FastAPI, Jinja2, and a layered revelation framework.

## Structure
- `/app` — FastAPI application and routes  
- `/templates` — Jinja2 templates for the Imperium pages  
- `/static` — CSS and assets  
- `/migrations` — Alembic migrations  
- `Procfile` — Railway deployment  
- `requirements.txt` — Python dependencies  

## Live Site
https://rastaimperium.com

## Divine Docker Compose
When running `docker-compose-divine.yml`, set the following environment variables (Docker Compose reads them from `.env` by default):

```
POSTGRES_PASSWORD=your-local-password
REDIS_PASSWORD=your-local-password
```

You can copy `.env.divine.example` to `.env` and update the values before starting the stack.

## Author
Laszlo Mazsar — Sovereign Architect of Constitutional AI
