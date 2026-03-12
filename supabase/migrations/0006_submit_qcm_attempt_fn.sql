-- =============================================================
-- 0006 – submit_qcm_attempt  (SECURITY DEFINER RPC)
-- =============================================================
-- Callable by authenticated users via:
--   supabase.rpc('submit_qcm_attempt', { item_id, chosen_choice_id, duration_ms })
--
-- Security model:
--   • SECURITY DEFINER → runs as the function owner (postgres),
--     which bypasses RLS and can read qcm_answer_keys.
--   • search_path = public, pg_temp is pinned to prevent
--     search-path-injection attacks.
--   • auth.uid() is captured inside the function so callers
--     cannot spoof another user's user_id.
--   • Returns jsonb: { "is_correct": bool, "correct_choice_id": uuid }
--     so clients learn the right answer only after submitting.
-- =============================================================

create or replace function public.submit_qcm_attempt(
  p_item_id          uuid,
  p_chosen_choice_id uuid,
  p_duration_ms      integer default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id          uuid;
  v_correct_choice_id uuid;
  v_is_correct       boolean;
begin
  -- ── 1. Identify the caller ─────────────────────────────────
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = 'PGRST';
  end if;

  -- ── 2. Look up the correct answer from the protected table ──
  select correct_choice_id
  into   v_correct_choice_id
  from   public.qcm_answer_keys
  where  item_id = p_item_id;

  if not found then
    raise exception 'Item not found or has no answer key: %', p_item_id
      using errcode = 'P0002';
  end if;

  -- ── 3. Evaluate correctness ────────────────────────────────
  v_is_correct := (p_chosen_choice_id = v_correct_choice_id);

  -- ── 4. Record the attempt ──────────────────────────────────
  insert into public.attempts (
    user_id,
    item_id,
    chosen_choice_id,
    is_correct,
    duration_ms
  ) values (
    v_user_id,
    p_item_id,
    p_chosen_choice_id,
    v_is_correct,
    p_duration_ms
  );

  -- ── 5. Return result to caller ─────────────────────────────
  return jsonb_build_object(
    'is_correct',        v_is_correct,
    'correct_choice_id', v_correct_choice_id
  );
end;
$$;

-- Grant execute to authenticated users only (not anon).
revoke execute on function public.submit_qcm_attempt(uuid, uuid, integer)
  from public, anon;

grant execute on function public.submit_qcm_attempt(uuid, uuid, integer)
  to authenticated;

comment on function public.submit_qcm_attempt(uuid, uuid, integer) is
  'Submit a QCM answer. Checks correctness via qcm_answer_keys (SECURITY DEFINER), '
  'records the attempt, and returns {is_correct, correct_choice_id}.';
