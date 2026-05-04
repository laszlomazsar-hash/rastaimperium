FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/app

WORKDIR /app

COPY evo-v/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY evo-v/app /app/app
COPY evo-v/bootstrap.sh /app/bootstrap.sh
RUN chmod +x /app/bootstrap.sh

EXPOSE 7860

CMD ["/app/bootstrap.sh"]
