-- verify.sql: Run these in Supabase SQL Editor to confirm schema is correct.
-- Covers migrations 0001-0006.

-- ── 1. All tables in public schema ───────────────────────────
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
-- Expected: attempts, item_choices, item_tags, items,
--           profiles, qcm_answer_keys, tags

-- ── 2. RLS enabled on every table ────────────────────────────
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
-- Expected: rowsecurity = true for ALL rows

-- ── 3. All RLS policies ───────────────────────────────────────
select tablename, policyname, roles, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
-- Expected: NO policy with cmd='SELECT' on qcm_answer_keys
--           (that table has RLS enabled but zero select policies)

-- ── 4. Confirm qcm_answer_keys has no SELECT policy ──────────
select count(*) as select_policies_on_answer_keys
from pg_policies
where schemaname = 'public'
  and tablename  = 'qcm_answer_keys'
  and cmd        = 'SELECT';
-- Expected: 0

-- ── 5. Confirm duration_ms column exists on attempts ─────────
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'attempts'
  and column_name  = 'duration_ms';
-- Expected: 1 row, data_type = 'integer', is_nullable = 'YES'

-- ── 6. Confirm submit_qcm_attempt function exists ────────────
select routine_name, security_type
from information_schema.routines
where routine_schema = 'public'
  and routine_name   = 'submit_qcm_attempt';
-- Expected: 1 row, security_type = 'DEFINER'

-- ── 7. item_kind enum values ──────────────────────────────────
select enum_range(null::public.item_kind);
-- Expected: {qcm,bac}

-- ── 8. Seed data checks (run after seed.sql) ─────────────────
select kind, subject, exam, year, prompt from public.items;
select label, body, is_correct from public.item_choices order by label;
select slug, label from public.tags;

-- Confirm qcm_answer_keys was backfilled (one row per item)
select
  ak.item_id,
  ic.label  as correct_label,
  ic.body   as correct_body
from public.qcm_answer_keys ak
join public.item_choices ic on ic.id = ak.correct_choice_id;
-- Expected: 2 rows (one per seeded item), matching is_correct=true choices

-- ── 9. Indexes ────────────────────────────────────────────────
select indexname, tablename
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

-- ── 10. Smoke-test submit_qcm_attempt (authenticated session) ─
-- Replace the UUIDs with real values from your seeded data.
-- Run this as a signed-in user (e.g. via Supabase Dashboard SQL
-- editor with "Run as role: authenticated" or from the client SDK).
--
-- select public.submit_qcm_attempt(
--   '<item_id_uuid>',
--   '<chosen_choice_id_uuid>',
--   1500          -- duration_ms
-- );
--
-- Expected return (correct answer chosen):
--   {"is_correct": true,  "correct_choice_id": "<uuid>"}
-- Expected return (wrong answer chosen):
--   {"is_correct": false, "correct_choice_id": "<uuid>"}

-- ── 11. Confirm users cannot SELECT from qcm_answer_keys ──────
-- Run as an authenticated (non-service-role) user:
-- select * from public.qcm_answer_keys;
-- Expected: 0 rows returned (RLS denies all reads — not an error,
--           just empty result set, same behaviour as a hidden table).

-- ── 12. Confirm attempts are user-scoped ──────────────────────
select * from public.attempts;
-- Expected: only rows where user_id = auth.uid()
