'use client';

import { FormEvent, useState } from 'react';

type Source = { filename: string; chunk_index: number; snippet: string };
type UploadResult = { id: string; filename: string; chunks: number };
const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<UploadResult | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be 5 MB or smaller.'); return; }
    setDocument(null);
    setLoading(true); setError(''); setAnswer(''); setSources([]);
    try {
      const body = new FormData(); body.append('file', file);
      const response = await fetch(BASE + '/documents/upload', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? 'Upload failed');
      setDocument(data as UploadResult);
    } catch (err) { setError(err instanceof Error ? err.message : 'Upload failed'); }
    finally { setLoading(false); }
  }

  async function ask(e: FormEvent) {
    e.preventDefault();
    if (!question.trim() || !document) return;
    setLoading(true); setError(''); setSources([]);
    try {
      const response = await fetch(BASE + '/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, document_id: document.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail ?? 'Answer generation failed');
      setAnswer(data.answer ?? 'No answer'); setSources(data.sources ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : 'Question failed'); }
    finally { setLoading(false); }
  }

  return <main className="container">
    <div className="eyebrow">FULL STACK + AI • PORTFOLIO PROJECT</div>
    <h1>AI Document Assistant</h1>
    <p className="intro">Upload a PDF or TXT file, then ask questions. The assistant searches embedded chunks stored in PostgreSQL with pgvector and cites the most relevant passages.</p>
    <section className="panel"><h2>1. Upload document</h2>
      <form onSubmit={upload}>
        <input aria-label="Choose PDF or TXT file" type="file" accept=".pdf,.txt" onChange={e => { setFile(e.currentTarget.files?.[0] ?? null); setDocument(null); setAnswer(''); setSources([]); setError(''); }} />
        <button type="submit" disabled={!file || loading}>{loading ? 'Working…' : 'Upload & index'}</button>
      </form>
      {document && <p className="success">Indexed {document.filename} — {document.chunks} searchable chunks</p>}
    </section>
    <section className="panel"><h2>2. Ask a question</h2>
      <form onSubmit={ask}>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What are the main findings in this document?" rows={3} aria-label="Question" />
        <button type="submit" disabled={!document || !question.trim() || loading}>{loading ? 'Working…' : 'Ask document'}</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {answer && <div className="answer"><h3>Answer</h3><p>{answer}</p></div>}
      {sources.length > 0 && <div className="sources"><h3>Source excerpts</h3>{sources.map((s, i) => <article key={s.filename + '-' + s.chunk_index + '-' + i}><strong>[{i + 1}] {s.filename}, chunk {s.chunk_index}</strong><p>{s.snippet}…</p></article>)}</div>}
    </section>
    <footer>Portfolio demo • Not designed for confidential documents or public deployment without authentication.</footer>
  </main>;
}
