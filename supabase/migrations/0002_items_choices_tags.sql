-- 0002: Items, Choices, Tags, Item-Tags

create type public.item_kind as enum ('qcm', 'bac');

create table public.items (
  id          uuid primary key default gen_random_uuid(),
  kind        public.item_kind not null default 'qcm',
  subject     text not null,
  exam        text not null,
  year        smallint,
  prompt      text not null,
  explanation text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger items_updated_at
  before update on public.items
  for each row execute procedure public.touch_updated_at();

create table public.item_choices (
  id          uuid primary key default gen_random_uuid(),
  item_id     uuid not null references public.items (id) on delete cascade,
  label       char(1) not null check (label in ('A','B','C','D')),
  body        text not null,
  is_correct  boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (item_id, label)
);

create table public.tags (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  label       text not null,
  created_at  timestamptz not null default now()
);

create table public.item_tags (
  item_id     uuid not null references public.items (id) on delete cascade,
  tag_id      uuid not null references public.tags (id) on delete cascade,
  primary key (item_id, tag_id)
);

create index on public.items (kind, subject, exam, year);
create index on public.item_choices (item_id);
create index on public.item_tags (tag_id);