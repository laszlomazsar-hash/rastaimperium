FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install the backend package so top-level `src` package is available
COPY backend /app/backend
WORKDIR /app/backend
RUN pip install --no-cache-dir .

# optional sanity check to fail build early if `src` is not importable
RUN python -c "import importlib; assert importlib.util.find_spec('src') is not None, 'src not importable'"

# copy the rest of the repository
WORKDIR /app
COPY . .

# keep PYTHONPATH if you still need it (should be unnecessary after install)
ENV PYTHONPATH=/app/backend:/app

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000

# Use shell form for proper environment variable expansion
CMD uvicorn src.ark_safety.main:app --host 0.0.0.0 --port ${PORT:-8000} --no-access-log
