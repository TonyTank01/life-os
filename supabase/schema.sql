-- LIFE OS initial schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'My LIFE OS',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, domain text not null, target numeric, current numeric not null default 0, unit text,
  start_date date, due_date date, status text not null default 'active' check (status in ('active','paused','completed','archived')),
  is_primary boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, domain text not null default 'personal', planned_date date not null default current_date,
  priority smallint not null default 2 check(priority between 1 and 3), completed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null default current_date, sleep_hours numeric, energy_score smallint check(energy_score between 1 and 10), mood_score smallint check(mood_score between 1 and 10),
  training_done boolean not null default false, cardio_done boolean not null default false, alcohol_free boolean, nutrition_score smallint check(nutrition_score between 1 and 10), notes text,
  created_at timestamptz not null default now(), unique(user_id, log_date)
);
create table if not exists public.life_scores (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  score_date date not null default current_date, domain text not null, score smallint not null check(score between 1 and 10), note text,
  created_at timestamptz not null default now(), unique(user_id, score_date, domain)
);
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, status text not null default 'lead' check(status in ('lead','contacted','consultation','active','paused','former')),
  monthly_value numeric not null default 0, package_name text, start_date date, renewal_date date, lead_source text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric not null, transaction_type text not null check(transaction_type in ('income','expense')), category text not null,
  occurred_on date not null default current_date, client_id uuid references public.clients(id) on delete set null, notes text,
  created_at timestamptz not null default now()
);
create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null, wins text, obstacles text, lessons text, next_priorities jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), unique(user_id, week_start)
);

do $$ declare t text; begin
  foreach t in array array['goals','tasks','daily_logs','life_scores','clients','transactions','weekly_reviews'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Users manage own %I" on public.%I', t, t);
    execute format('create policy "Users manage own %I" on public.%I for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)', t, t);
  end loop;
end $$;
drop policy if exists "Users manage own profiles" on public.profiles;
create policy "Users manage own profile" on public.profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create index if not exists tasks_user_date_idx on public.tasks(user_id, planned_date);
create index if not exists transactions_user_date_idx on public.transactions(user_id, occurred_on);
create index if not exists clients_user_status_idx on public.clients(user_id, status);
create index if not exists goals_user_status_idx on public.goals(user_id, status);
