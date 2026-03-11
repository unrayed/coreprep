-- 0003: Attempts

create table public.attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  item_id           uuid not null references public.items (id) on delete cascade,
  chosen_choice_id  uuid references public.item_choices (id) on delete set null,
  is_correct        boolean not null,
  created_at        timestamptz not null default now()
);

create index on public.attempts (user_id, created_at desc);
create index on public.attempts (item_id);