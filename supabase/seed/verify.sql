-- verify.sql: Run these in Supabase SQL Editor to confirm schema is correct.

-- 1. List all tables in public schema
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

-- Expected: attempts, item_choices, item_tags, items, profiles, tags

-- 2. Confirm RLS is enabled on all tables
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;

-- Expected: rowsecurity = true for all rows

-- 3. List all RLS policies
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- 4. Confirm item_kind enum values
select enum_range(null::public.item_kind);
-- Expected: {qcm,bac}

-- 5. Confirm seed data loaded (run after seed.sql)
select kind, subject, exam, year, prompt from public.items;
select label, body, is_correct from public.item_choices order by label;
select slug, label from public.tags;

-- 6. Check indexes exist
select indexname, tablename
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

-- 7. Simulate attempt insert (replace UUIDs with real values after seeding)
-- insert into public.attempts (user_id, item_id, chosen_choice_id, is_correct)
-- values ('<auth.uid()>', '<item_id>', '<choice_id>', true);

-- 8. Confirm a user cannot read another user's attempts
-- (Run as user A, user B's rows should not appear)
select * from public.attempts;
-- Should return only rows where user_id = auth.uid()
