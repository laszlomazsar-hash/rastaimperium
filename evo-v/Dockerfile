FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for caching
COPY evo-v/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy application files
COPY evo-v/app /app/app
COPY evo-v/bootstrap.sh /app/bootstrap.sh

RUN chmod +x /app/bootstrap.sh

# Railway provides PORT env var
ENV PORT=8000

CMD ["/app/bootstrap.sh"]
