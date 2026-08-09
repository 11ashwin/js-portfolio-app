-- Run via `npm run migrate` (see migrate.js) or manually with psql.

CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  company         TEXT NOT NULL,
  email           TEXT NOT NULL,
  role            TEXT NOT NULL,
  location        TEXT,
  employment_type TEXT,
  description     TEXT NOT NULL,
  salary_range    TEXT,
  job_url         TEXT,
  interests       TEXT[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_status     ON inquiries (status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at DESC);
