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
When running `docker-compose-divine.yml`, set the following environment variables. For local development, copy the template and pass it to Docker Compose:

```bash
cp .env.divine.example .env.divine
docker compose --env-file .env.divine -f docker-compose-divine.yml up
```

Required environment variables (set non-empty values):

```
POSTGRES_PASSWORD=
REDIS_PASSWORD=
```

Keep `.env.divine` out of version control (it's ignored in `.gitignore`).

## Author
Laszlo Mazsar — Sovereign Architect of Constitutional AI
