-- Enable UUID
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS (extended from NextAuth)
-- =============================================
create table public.profiles (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  name          text,
  avatar_url    text,
  country       text,
  company       text,
  phone         text,
  role          text not null default 'client', -- 'client' | 'admin'
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- =============================================
-- TASKS (freelance marketplace)
-- =============================================
create type task_status as enum (
  'pending',      -- created, awaiting payment
  'paid',         -- payment confirmed
  'in_progress',  -- work started
  'review',       -- submitted for review
  'completed',    -- done
  'cancelled'     -- cancelled / refunded
);

create table public.tasks (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references public.profiles(id) on delete cascade,
  service_id      text not null,          -- etl-pipeline | rag-agent | dbt-modeling | dashboard
  title           text not null,
  description     text not null,
  requirements    text,
  budget_inr      integer,
  budget_usd      integer,
  currency        text not null default 'INR', -- 'INR' | 'USD'
  status          task_status default 'pending',
  delivery_days   integer not null,
  deadline        date,
  deliverable_url text,                   -- link to final output
  notes           text,                   -- admin notes
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- =============================================
-- PAYMENTS
-- =============================================
create type payment_status as enum (
  'created', 'captured', 'failed', 'refunded'
);

create type payment_provider as enum ('razorpay', 'stripe');

create table public.payments (
  id                  uuid primary key default uuid_generate_v4(),
  task_id             uuid references public.tasks(id) on delete cascade,
  client_id           uuid references public.profiles(id) on delete cascade,
  provider            payment_provider not null,
  provider_payment_id text unique,        -- razorpay/stripe payment id
  provider_order_id   text,
  amount              integer not null,   -- in smallest unit (paise / cents)
  currency            text not null,
  status              payment_status default 'created',
  captured_at         timestamptz,
  metadata            jsonb,
  created_at          timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.tasks     enable row level security;
alter table public.payments  enable row level security;

-- profiles: users see only their own
create policy "profiles_self" on public.profiles
  for all using (auth.uid()::text = id::text);

-- tasks: clients see their own; service role sees all
create policy "tasks_client_self" on public.tasks
  for all using (auth.uid()::text = client_id::text);

-- payments: clients see their own
create policy "payments_client_self" on public.payments
  for all using (auth.uid()::text = client_id::text);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();
create trigger tasks_updated_at before update on public.tasks
  for each row execute function update_updated_at();

-- =============================================
-- INDEXES
-- =============================================
create index tasks_client_id_idx  on public.tasks(client_id);
create index tasks_status_idx     on public.tasks(status);
create index payments_task_id_idx on public.payments(task_id);
