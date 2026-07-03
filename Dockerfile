FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app/backend:/app

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# Use shell form for proper environment variable expansion
CMD uvicorn src.ark_safety.main:app --host 0.0.0.0 --port ${PORT:-8000} --no-access-log