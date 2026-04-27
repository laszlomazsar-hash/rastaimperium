FROM python:3.11-slim

WORKDIR /app

COPY evo-v/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY evo-v/app ./app
COPY evo-v/scripts ./scripts
COPY evo-v/bootstrap.sh ./bootstrap.sh

ENV PYTHONPATH=/app/app

RUN chmod +x /app/bootstrap.sh

CMD ["/app/bootstrap.sh"]
