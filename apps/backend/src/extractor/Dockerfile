FROM python:3.11-slim
WORKDIR /app
COPY extractor .
RUN pip install fastapi uvicorn spacy && \
    python -m spacy download en_core_web_sm
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]