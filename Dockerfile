FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src ./src

EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "src.rastaimperium.app:app", "--host", "0.0.0.0", "--port", "8000"]
