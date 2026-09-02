CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  last_updated TEXT,
  status TEXT,
  rescued INTEGER DEFAULT 0
);
