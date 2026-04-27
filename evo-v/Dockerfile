FROM python:3.11-slim

WORKDIR /app

COPY evo-v/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY evo-v/app /app/app
COPY evo-v/bootstrap.sh /app/bootstrap.sh

RUN chmod +x /app/bootstrap.sh

CMD ["/app/bootstrap.sh"]
