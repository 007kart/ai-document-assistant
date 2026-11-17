import pytest
from app.text_utils import chunk_text, clean_text


def test_clean_text():
    assert clean_text(' hello\n  world ') == 'hello world'


def test_chunks_preserve_start_end():
    text = ' '.join(f'word{i}' for i in range(100))
    chunks = chunk_text(text, chunk_size=100, overlap=20)
    assert len(chunks) > 2
    assert chunks[0].startswith('word0')
    assert chunks[-1].endswith('word99')


def test_empty_and_invalid():
    assert chunk_text(' \n\t') == []
    with pytest.raises(ValueError):
        chunk_text('text', 10, 10)
