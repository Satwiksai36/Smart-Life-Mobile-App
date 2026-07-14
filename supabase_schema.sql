-- ============================================================
-- SmartLife Database Schema for Supabase / PostgreSQL
-- VERSION 2 — includes explicit GRANT permissions
-- ============================================================
-- HOW TO RUN:
--   1. Open https://supabase.com/dashboard
--   2. Select your project: ehtzxlwpkxdovldhrcwp
--   3. Go to SQL Editor (left sidebar)
--   4. Paste this entire file and click "Run"
-- ============================================================

-- ─── REMINDERS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reminders (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  title         TEXT NOT NULL,
  category      TEXT DEFAULT 'General',
  due_date      TEXT,
  due_time      TEXT,
  priority      TEXT DEFAULT 'medium',
  recurrence    TEXT DEFAULT 'none',
  notification  BOOLEAN DEFAULT true,
  notes         TEXT DEFAULT '',
  completed     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reminders_user_id_idx ON public.reminders(user_id);

-- ─── TASKS ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tasks (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  title         TEXT NOT NULL,
  due_date      TEXT,
  due_time      TEXT,
  priority      TEXT DEFAULT 'medium',
  status        TEXT DEFAULT 'todo',
  notes         TEXT DEFAULT '',
  subtasks      JSONB DEFAULT '[]',
  attachments   JSONB DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);

-- ─── EXPENSES ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.expenses (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL,
  merchant       TEXT NOT NULL,
  date           TEXT,
  amount         NUMERIC DEFAULT 0,
  gst            NUMERIC DEFAULT 0,
  tax            NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'Cash',
  category       TEXT DEFAULT 'Other',
  items          JSONB DEFAULT '[]',
  notes          TEXT DEFAULT '',
  ocr_processed  BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON public.expenses(user_id);

-- ─── BUDGETS ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.budgets (
  id        SERIAL,
  user_id   TEXT NOT NULL,
  category  TEXT NOT NULL,
  amount    NUMERIC DEFAULT 0,
  PRIMARY KEY (user_id, category)
);
CREATE INDEX IF NOT EXISTS budgets_user_id_idx ON public.budgets(user_id);

-- ─── HABITS ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.habits (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL,
  name            TEXT NOT NULL,
  icon            TEXT DEFAULT 'star',
  frequency       TEXT DEFAULT 'daily',
  priority        TEXT DEFAULT 'medium',
  target_goal     INTEGER DEFAULT 7,
  history         JSONB DEFAULT '{}',
  streak          INTEGER DEFAULT 0,
  longest_streak  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON public.habits(user_id);

-- ─── NOTES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notes (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL,
  title        TEXT NOT NULL,
  content      TEXT DEFAULT '',
  color        TEXT DEFAULT '',
  pinned       BOOLEAN DEFAULT false,
  voice_notes  JSONB DEFAULT '[]',
  images       JSONB DEFAULT '[]',
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes(user_id);

-- ─── NOTIFICATIONS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.notifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT DEFAULT '',
  timestamp  TEXT,
  read       BOOLEAN DEFAULT false,
  category   TEXT DEFAULT 'system'
);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);

-- ─── GRANT FULL ACCESS TO anon AND authenticated ROLES ──────
-- This is REQUIRED for the Supabase client (using anon key) to read/write

GRANT ALL ON public.reminders      TO anon, authenticated;
GRANT ALL ON public.tasks          TO anon, authenticated;
GRANT ALL ON public.expenses       TO anon, authenticated;
GRANT ALL ON public.budgets        TO anon, authenticated;
GRANT ALL ON public.habits         TO anon, authenticated;
GRANT ALL ON public.notes          TO anon, authenticated;
GRANT ALL ON public.notifications  TO anon, authenticated;

-- Also grant usage on the budgets id sequence
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ─── CONNECTION TEST TABLE ───────────────────────────────────
-- Used to verify Supabase is connected (app pings this on startup)

CREATE TABLE IF NOT EXISTS public.connection_test (
  id    SERIAL PRIMARY KEY,
  ping  TEXT DEFAULT 'pong',
  ts    TIMESTAMPTZ DEFAULT NOW()
);
GRANT ALL ON public.connection_test TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.connection_test_id_seq TO anon, authenticated;

-- Insert a test row so SELECT always returns data
INSERT INTO public.connection_test (ping) VALUES ('pong') ON CONFLICT DO NOTHING;

-- ─── DONE ────────────────────────────────────────────────────
-- Run this script once. All 8 tables created with correct permissions.
-- Then restart your app — tasks will sync to Supabase automatically.
