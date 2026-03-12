-- =============================================================
-- 0005 – QCM Answer Keys & duration_ms on attempts
-- =============================================================
-- This migration:
--   1. Creates qcm_answer_keys (one row per item, stores correct choice).
--   2. Enables RLS on qcm_answer_keys with NO select policy for any
--      role → normal authenticated users can never read it directly.
--   3. Adds duration_ms to attempts.
--   4. Backfills qcm_answer_keys from item_choices.is_correct.
-- =============================================================

-- -------------------------------------------------------------
-- 1. qcm_answer_keys
--    item_id     – PK and FK to items (one answer key per item)
--    correct_choice_id – FK to item_choices
-- -------------------------------------------------------------
create table public.qcm_answer_keys (
  item_id           uuid primary key
                    references public.items (id) on delete cascade,
  correct_choice_id uuid not null
                    references public.item_choices (id) on delete cascade,
  created_at        timestamptz not null default now()
);

-- Only service-role / SECURITY DEFINER functions can touch this table.
-- Enabling RLS with no permissive SELECT policy means authenticated
-- users get zero rows (denied by default).
alter table public.qcm_answer_keys enable row level security;

-- Intentionally NO "select" policy for authenticated / anon roles.
-- The submit_qcm_attempt() function is SECURITY DEFINER so it runs
-- as the function owner (postgres) and bypasses RLS.

-- -------------------------------------------------------------
-- 2. Add duration_ms to attempts
--    Nullable so existing rows (pre-migration) remain valid.
-- -------------------------------------------------------------
alter table public.attempts
  add column if not exists duration_ms integer check (duration_ms >= 0);

-- -------------------------------------------------------------
-- 3. Backfill qcm_answer_keys from existing item_choices data.
--    item_choices.is_correct was used in Phase-0 schema; we now
--    promote that data into the secure answer-key table.
-- -------------------------------------------------------------
insert into public.qcm_answer_keys (item_id, correct_choice_id)
select item_id, id
from   public.item_choices
where  is_correct = true
on conflict (item_id) do nothing;
