import { useState, type FormEvent } from 'react';
import './App.css';

const API_BASE = 'http://localhost:3000';

interface Patient {
  id: string;
  name: string;
  // Intentionally not displaying coordinates — this is a public-facing view;
  // exact location is responder-only. latitude/longitude are received but never rendered.
  latitude: number;
  longitude: number;
  lastUpdated: string;
  status: string;
  rescued: boolean;
}

type Result =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; patient: Patient }
  | { kind: 'not-found' }
  | { kind: 'error' };

function formatLastUpdated(raw: string): string {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function App() {
  const [id, setId] = useState('');
  const [result, setResult] = useState<Result>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) return;

    setResult({ kind: 'loading' });
    try {
      const response = await fetch(`${API_BASE}/patients/${encodeURIComponent(trimmed)}`);
      if (response.status === 404) {
        setResult({ kind: 'not-found' });
        return;
      }
      if (!response.ok) {
        setResult({ kind: 'error' });
        return;
      }
      const patient: Patient = await response.json();
      setResult({ kind: 'found', patient });
    } catch {
      // Network failure, server down, CORS, etc.
      setResult({ kind: 'error' });
    }
  }

  return (
    <main className="portal">
      <h1 className="portal-title">Family Status Portal</h1>
      <p className="portal-subtitle">
        Enter a patient ID to check whether they have been marked as rescued.
      </p>

      <form className="lookup-card" onSubmit={handleSubmit}>
        <label className="lookup-label" htmlFor="patient-id">
          Patient ID
        </label>
        <div className="lookup-row">
          <input
            id="patient-id"
            className="lookup-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 003"
            value={id}
            onChange={(event) => setId(event.target.value)}
          />
          <button
            className="lookup-button"
            type="submit"
            disabled={result.kind === 'loading' || !id.trim()}
          >
            {result.kind === 'loading' ? 'Checking…' : 'Check Status'}
          </button>
        </div>
      </form>

      {result.kind === 'not-found' && (
        <p className="message">No patient found with that ID.</p>
      )}

      {result.kind === 'error' && (
        <p className="message message-error">Unable to reach the server.</p>
      )}

      {result.kind === 'found' && (
        <section
          className={`result-card ${result.patient.rescued ? 'rescued' : 'not-rescued'}`}
        >
          <h2 className="result-name">{result.patient.name}</h2>
          <span
            className={`status-badge ${result.patient.rescued ? 'rescued' : 'not-rescued'}`}
          >
            {result.patient.rescued ? 'Rescued' : 'Not Yet Rescued'}
          </span>
          <p className="result-updated">
            Last updated: {formatLastUpdated(result.patient.lastUpdated)}
          </p>
        </section>
      )}
    </main>
  );
}
