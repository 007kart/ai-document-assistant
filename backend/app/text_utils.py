"""Pure text utilities shared by upload and retrieval; independently testable."""
import re


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def chunk_text(value: str, chunk_size: int = 1000, overlap: int = 160) -> list[str]:
    """Create overlapping character chunks without losing end-of-document text."""
    if chunk_size < 1 or not 0 <= overlap < chunk_size:
        raise ValueError("chunk_size must be positive; overlap must be smaller")
    text = clean_text(value)
    if not text:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        if end < len(text):
            boundary = text.rfind(" ", start + int(chunk_size * .70), end)
            if boundary > start:
                end = boundary
        part = text[start:end].strip()
        if part:
            chunks.append(part)
        if end >= len(text):
            break
        start = max(start + 1, end - overlap)
    return chunks
