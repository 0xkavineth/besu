-- ---------------------------------------------------------------
-- Obfice Base / LexCase — Supabase schema + Row Level Security
--
-- Run this once in: Supabase Dashboard -> SQL Editor -> New query
-- Safe to re-run: every statement is guarded with IF NOT EXISTS /
-- DROP POLICY IF EXISTS so re-running it won't duplicate anything.
-- ---------------------------------------------------------------

-- ============================================================
-- 1. profiles — one row per signed-up user, extends auth.users
--    with the extra fields the app needs (name, avatar, plan...)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  avatar text,
  phone text not null default '',
  notifications boolean not null default true,
  line_linked boolean not null default false,
  plan text not null default 'free',
  provider text not null default 'email',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Auto-creates a profiles row right after someone signs up, using
-- the display name passed in supabase.auth.signUp({ options: { data } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. team_members — the "office / team" roster inside LexCase
-- ============================================================
create table if not exists public.team_members (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  position text not null default '',
  photo text,
  created_at timestamptz not null default now()
);

alter table public.team_members enable row level security;

drop policy if exists "team_members_select_own" on public.team_members;
create policy "team_members_select_own" on public.team_members
  for select using (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.lexcase_sub_accounts sub
      WHERE sub.user_id = team_members.user_id
        AND sub.auth_user_id = auth.uid()
    )
  );

drop policy if exists "team_members_insert_own" on public.team_members;
create policy "team_members_insert_own" on public.team_members
  for insert with check (auth.uid() = user_id);

drop policy if exists "team_members_update_own" on public.team_members;
create policy "team_members_update_own" on public.team_members
  for update using (auth.uid() = user_id);

drop policy if exists "team_members_delete_own" on public.team_members;
create policy "team_members_delete_own" on public.team_members
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 3. lexcase_sub_accounts — owner-managed sub-accounts inside
--    LexCase, each carrying a role and granular permissions payload.
-- ============================================================
create table if not exists public.lexcase_sub_accounts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  auth_user_id uuid,
  email text not null,
  display_name text not null default '',
  role text not null default 'viewer',
  permissions jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create index if not exists lexcase_sub_accounts_user_id_idx on public.lexcase_sub_accounts (user_id);
create index if not exists lexcase_sub_accounts_email_idx on public.lexcase_sub_accounts (email);

alter table public.lexcase_sub_accounts enable row level security;

drop policy if exists "lexcase_sub_accounts_select_own" on public.lexcase_sub_accounts;
create policy "lexcase_sub_accounts_select_own" on public.lexcase_sub_accounts
  for select using (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.lexcase_sub_accounts sub
      WHERE sub.user_id = lexcase_sub_accounts.user_id
        AND sub.auth_user_id = auth.uid()
    )
  );

drop policy if exists "lexcase_sub_accounts_insert_own" on public.lexcase_sub_accounts;
create policy "lexcase_sub_accounts_insert_own" on public.lexcase_sub_accounts
  for insert with check (auth.uid() = user_id);

drop policy if exists "lexcase_sub_accounts_update_own" on public.lexcase_sub_accounts;
create policy "lexcase_sub_accounts_update_own" on public.lexcase_sub_accounts
  for update using (auth.uid() = user_id);

drop policy if exists "lexcase_sub_accounts_delete_own" on public.lexcase_sub_accounts;
create policy "lexcase_sub_accounts_delete_own" on public.lexcase_sub_accounts
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 4. cases — one row per case; the whole case record (charges,
--    owners, appointments, documents, etc.) is stored as jsonb so
--    the shape can keep evolving without further migrations.
-- ============================================================
create table if not exists public.cases (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cases_user_id_idx on public.cases (user_id);

alter table public.cases enable row level security;

drop policy if exists "cases_select_own" on public.cases;
create policy "cases_select_own" on public.cases
  for select using (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.lexcase_sub_accounts sub
      WHERE sub.user_id = cases.user_id
        AND sub.auth_user_id = auth.uid()
    )
  );

drop policy if exists "cases_insert_own" on public.cases;
create policy "cases_insert_own" on public.cases
  for insert with check (auth.uid() = user_id);

drop policy if exists "cases_update_own" on public.cases;
create policy "cases_update_own" on public.cases
  for update using (auth.uid() = user_id);

drop policy if exists "cases_delete_own" on public.cases;
create policy "cases_delete_own" on public.cases
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 5. charges — the list of "ข้อหา/ฐานความผิด" tags a user has
--    typed in before, so they show up as quick-pick suggestions.
-- ============================================================
create table if not exists public.charges (
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  primary key (user_id, label)
);

alter table public.charges enable row level security;

drop policy if exists "charges_select_own" on public.charges;
create policy "charges_select_own" on public.charges
  for select using (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.lexcase_sub_accounts sub
      WHERE sub.user_id = charges.user_id
        AND sub.auth_user_id = auth.uid()
    )
  );

drop policy if exists "charges_insert_own" on public.charges;
create policy "charges_insert_own" on public.charges
  for insert with check (auth.uid() = user_id);

drop policy if exists "charges_delete_own" on public.charges;
create policy "charges_delete_own" on public.charges
  for delete using (auth.uid() = user_id);
