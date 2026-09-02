// Seeds patients.db from the canonical seed data in ../db.json.
// Creates the table from schema.sql first if it does not exist.
// Idempotent: run as many times as you like via `npm run seed`.

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'patients.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, '..', 'db.json');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// 1. Create the table if it is not there yet.
db.exec(fs.readFileSync(SCHEMA_PATH, 'utf8'));

// 2. Load the five seed patients.
const { patients } = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));

// 3. Upsert each row, mapping the JSON shape to the SQL column shape:
//    lastUpdated -> last_updated, rescued true/false -> 1/0.
const upsert = db.prepare(`
  INSERT INTO patients (id, name, latitude, longitude, last_updated, status, rescued)
  VALUES (@id, @name, @latitude, @longitude, @last_updated, @status, @rescued)
  ON CONFLICT(id) DO UPDATE SET
    name         = excluded.name,
    latitude     = excluded.latitude,
    longitude    = excluded.longitude,
    last_updated = excluded.last_updated,
    status       = excluded.status,
    rescued      = excluded.rescued
`);

const seedAll = db.transaction((rows) => {
  for (const p of rows) {
    upsert.run({
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
      last_updated: p.lastUpdated,
      status: p.status,
      rescued: p.rescued ? 1 : 0,
    });
  }
});

seedAll(patients);

const count = db.prepare('SELECT COUNT(*) AS n FROM patients').get().n;
console.log(`Seeded ${patients.length} patients. patients table now has ${count} rows.`);
console.log(`Database: ${DB_PATH}`);

db.close();
