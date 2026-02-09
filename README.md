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
When running `docker-compose-divine.yml`, set the following environment variables (Docker Compose reads them from `.env.divine` by default) and provide a Redis password secret file:

```
POSTGRES_PASSWORD=change-me
REDIS_PASSWORD=change-me
```

You can copy `.env.divine.example` to `.env.divine` and update the values before starting the stack. Create `.secrets/redis_password` with the same Redis password so the Redis container can load it via Docker secrets.

## Author
Laszlo Mazsar — Sovereign Architect of Constitutional AI
