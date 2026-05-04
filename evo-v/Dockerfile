FROM python:3.11-slim

WORKDIR /app



COPY ./app ./app
COPY ./scripts ./scripts
COPY ./bootstrap.sh ./bootstrap.sh

EXPOSE 7860

CMD ["sh", "bootstrap.sh"]
