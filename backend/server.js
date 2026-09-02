// Minimal Express + SQLite REST API for the Kapok dashboard.
// Exposes the same routes JSON Server did, on the same port (3000), so the
// Angular PatientService and the Flutter app need no changes.
//
// Plain SQL via better-sqlite3 prepared statements — no ORM.

const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const PORT = 3000;
const DB_PATH = path.join(__dirname, 'patients.db');

const db = new Database(DB_PATH, { fileMustExist: true });
db.pragma('journal_mode = WAL');

const app = express();
app.use(cors());
app.use(express.json());

// --- helpers -------------------------------------------------------------

// SQL row (snake_case, rescued as 0/1) -> JSON the frontend expects
// (camelCase lastUpdated, rescued as boolean).
function toApi(row) {
  if (!row) return row;
  return {
    id: row.id,
    name: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
    lastUpdated: row.last_updated,
    status: row.status,
    rescued: Boolean(row.rescued),
  };
}

// Which request-body fields we allow through, and how each maps to a column.
const WRITABLE = {
  name: (v) => ({ col: 'name', val: v }),
  latitude: (v) => ({ col: 'latitude', val: v }),
  longitude: (v) => ({ col: 'longitude', val: v }),
  lastUpdated: (v) => ({ col: 'last_updated', val: v }),
  status: (v) => ({ col: 'status', val: v }),
  rescued: (v) => ({ col: 'rescued', val: v ? 1 : 0 }),
};

// --- prepared statements ------------------------------------------------

const selectAll = db.prepare('SELECT * FROM patients');
const selectById = db.prepare('SELECT * FROM patients WHERE id = ?');

// --- routes ------------------------------------------------------------

app.get('/patients', (_req, res) => {
  res.json(selectAll.all().map(toApi));
});

app.get('/patients/:id', (req, res) => {
  const row = selectById.get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Patient not found' });
  res.json(toApi(row));
});

app.patch('/patients/:id', (req, res) => {
  const existing = selectById.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Patient not found' });

  const sets = [];
  const values = [];
  for (const [key, raw] of Object.entries(req.body ?? {})) {
    const mapper = WRITABLE[key];
    if (!mapper) continue; // ignore unknown / non-writable fields (e.g. id)
    const { col, val } = mapper(raw);
    sets.push(`${col} = ?`);
    values.push(val);
  }

  if (sets.length === 0) {
    return res.status(400).json({ error: 'No updatable fields in request body' });
  }

  values.push(req.params.id);
  db.prepare(`UPDATE patients SET ${sets.join(', ')} WHERE id = ?`).run(...values);

  res.json(toApi(selectById.get(req.params.id)));
});

app.listen(PORT, () => {
  console.log(`Kapok SQLite API listening on http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
