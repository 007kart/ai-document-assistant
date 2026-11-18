"""API contract tests require installed dependencies; no external services."""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_liveness():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_reject_unsupported_upload():
    response = client.post("/documents/upload", files={"file": ("code.js", b"console.log(1)", "text/plain")})
    assert response.status_code == 415


def test_reject_missing_document_id():
    response = client.post("/chat", json={"question": "What is the main finding?"})
    assert response.status_code == 422


def test_reject_invalid_document_id():
    response = client.post("/chat", json={"question": "What is the main finding?", "document_id": "not-uuid"})
    assert response.status_code == 422
