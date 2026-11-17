# AI Document Assistant — Next.js + FastAPI + PostgreSQL + RAG

A portfolio starter project demonstrating a full-stack **LLM-powered document question-answering application**. The frontend uses Next.js + TypeScript. The backend uses FastAPI, Python, OpenAI embeddings/chat APIs, and PostgreSQL with **pgvector** for retrieval.

> **Status:** local starter/prototype, not a production deployment. Requires an OpenAI API key (usage costs apply). Do not upload sensitive or confidential documents. No authentication or rate limiting is implemented.

## Features
- Upload a text-based PDF or UTF-8 TXT document (up to 5 MB)
- Extract text, chunk it and create embeddings
- Store text and embeddings in PostgreSQL/pgvector
- Ask natural-language questions about uploaded documents
- Retrieve relevant chunks, generate document-grounded answers and display source excerpts
- Next.js upload and Q&A interface
- Unit tests for text cleaning and chunking

## Run locally

**Requirements:** Docker Desktop, Node.js 20+ and an OpenAI API key.

1. `cp backend/.env.example backend/.env` and set `OPENAI_API_KEY` in `backend/.env`.
2. Start database and backend: `docker compose up --build`. API docs: http://localhost:8000/docs
3. In another terminal: `cd frontend && cp .env.example .env.local && npm install && npm run dev`.
4. Open http://localhost:3000; upload a PDF/TXT and ask a question.
5. Optional: use **DBeaver** to connect to localhost:5432, database `assistant`, username/password `assistant` (**local development only**).

Scanned/image-only PDFs require OCR and are **not** supported in this prototype.

## Architecture

```text
Next.js UI -> FastAPI REST API -> text extraction/chunking -> OpenAI embeddings
                                      |
                                      v
                             PostgreSQL + pgvector
                                      |
                                      v
                       nearest chunks -> OpenAI chat -> answer + sources
```

## API endpoints

- `GET /health`
- `GET /documents`
- `POST /documents/upload` (multipart file; returns ID and chunk count)
- `POST /chat` (JSON: `{ "question": "...", "document_id": "..." }`)

## Unit tests

```bash
cd backend
python -m pytest -q tests
```

## Security / production checklist

Before deploying publicly, implement authentication, authorization, tenant isolation, file scanning, secrets management, stronger prompt-injection defenses, logging, rate limits, cost controls, retention policies, data encryption, and monitoring. Development database credentials in this demo are not suitable for production.

## Portfolio and resume note

This code is a **starter project**, not evidence of production AI work. Run the entire stack, verify the document upload/Q&A flow, and make your own contributions before listing it as completed professional experience.
