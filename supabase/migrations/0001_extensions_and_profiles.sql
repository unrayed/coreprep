-- =============================================================
-- 0001 â€“ Extensions & Profiles
-- =============================================================

-- pgcrypto is already available in Supabase; gen_random_uuid() is
-- from pg 13+ core, but enable the extension defensively.
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- profiles
-- One row per authenticated user, id mirrors auth.users.id.
-- Trigger keeps it in sync on sign-up.
-- ---------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
