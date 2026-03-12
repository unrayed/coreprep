-- seed.sql: Sample data for local dev (Phase 1 – Concours QCM)
-- Run AFTER migrations. Assumes no real users exist.

-- Tags (chapters / concepts)
insert into public.tags (slug, label) values
  ('algebre',           'Algèbre'),
  ('analyse',           'Analyse'),
  ('probabilites',      'Probabilités'),
  ('culture-generale',  'Culture Générale'),
  ('logique',           'Logique')
on conflict (slug) do nothing;

-- Sample QCM items
with inserted_items as (
  insert into public.items (kind, subject, exam, year, prompt, explanation)
  values
    (
      'qcm',
      'Mathématiques',
      'Concours Commun',
      2023,
      'Soit f(x) = x² − 3x + 2. Quelles sont les racines de f ?',
      'On factorise : f(x) = (x−1)(x−2), donc les racines sont 1 et 2.'
    ),
    (
      'qcm',
      'Culture Générale',
      'Concours Commun',
      2023,
      'Quelle est la capitale du Maroc ?',
      'Rabat est la capitale administrative du Maroc.'
    )
  returning id, subject
)
-- Choices for item 1 (Mathématiques)
insert into public.item_choices (item_id, label, body, is_correct)
select
  i.id,
  c.label,
  c.body,
  c.is_correct
from inserted_items i
cross join (
  values
    ('A', 'x = 1 et x = 2',  true),
    ('B', 'x = −1 et x = −2', false),
    ('C', 'x = 0 et x = 3',  false),
    ('D', 'x = 1 et x = −2', false)
) as c(label, body, is_correct)
where i.subject = 'Mathématiques';

-- Choices for item 2 (Culture Générale)
insert into public.item_choices (item_id, label, body, is_correct)
select
  i.id,
  c.label,
  c.body,
  c.is_correct
from (
  select id from public.items where subject = 'Culture Générale' limit 1
) i
cross join (
  values
    ('A', 'Casablanca', false),
    ('B', 'Marrakech',  false),
    ('C', 'Rabat',      true),
    ('D', 'Fès',        false)
) as c(label, body, is_correct);

-- Tag items
insert into public.item_tags (item_id, tag_id)
select i.id, t.id
from public.items i
join public.tags t on t.slug = 'algebre'
where i.subject = 'Mathématiques'
on conflict do nothing;

insert into public.item_tags (item_id, tag_id)
select i.id, t.id
from public.items i
join public.tags t on t.slug = 'culture-generale'
where i.subject = 'Culture Générale'
on conflict do nothing;

-- ── Populate qcm_answer_keys from item_choices ───────────────
-- Must run AFTER item_choices rows are inserted.
-- One row per item pointing to the correct choice.
insert into public.qcm_answer_keys (item_id, correct_choice_id)
select item_id, id
from   public.item_choices
where  is_correct = true
on conflict (item_id) do nothing;
