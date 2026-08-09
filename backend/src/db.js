const { Pool } = require('pg');

// pg reads PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD from process.env automatically,
// but we pass them explicitly so a missing .env fails loudly instead of silently
// falling back to local Postgres defaults.
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  // Errors on idle clients (e.g. connection dropped) shouldn't crash the process.
  console.error('Unexpected error on idle Postgres client', err);
});

module.exports = {
  // Always prefer this over pool.query for anything user-input-derived — it's
  // the same underlying call, but centralizing it makes it easy to add
  // query logging/metrics in one place later.
  query: (text, params) => pool.query(text, params),
  pool,
};
