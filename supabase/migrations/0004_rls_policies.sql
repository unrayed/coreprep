-- 0004: Row Level Security

alter table public.profiles enable row level security;

create policy "profiles: user reads own row"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: user updates own row"
  on public.profiles for update
  using (auth.uid() = id);

alter table public.items enable row level security;

create policy "items: authenticated read"
  on public.items for select
  to authenticated
  using (true);

alter table public.item_choices enable row level security;

create policy "item_choices: authenticated read"
  on public.item_choices for select
  to authenticated
  using (true);

alter table public.tags enable row level security;

create policy "tags: authenticated read"
  on public.tags for select
  to authenticated
  using (true);

alter table public.item_tags enable row level security;

create policy "item_tags: authenticated read"
  on public.item_tags for select
  to authenticated
  using (true);

alter table public.attempts enable row level security;

create policy "attempts: user reads own"
  on public.attempts for select
  using (auth.uid() = user_id);

create policy "attempts: user inserts own"
  on public.attempts for insert
  with check (auth.uid() = user_id);

create policy "attempts: user updates own"
  on public.attempts for update
  using (auth.uid() = user_id);

create policy "attempts: user deletes own"
  on public.attempts for delete
  using (auth.uid() = user_id);