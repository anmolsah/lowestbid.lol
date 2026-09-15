-- ==============================================================================
-- lowestbid.lol - Supabase Database Schema
-- Copy and paste this into your Supabase Dashboard -> SQL Editor and click Run.
-- ==============================================================================

create table if not exists bids (
  id text primary key,
  amount numeric(10, 2) not null,
  amount_cents integer not null,
  title text not null,
  url text not null,
  message text default '',
  twitter text,
  status text not null default 'pending',
  payment_id text,
  clicks integer default 0,
  created_at timestamptz default now()
);

-- Performance indices
create index if not exists idx_bids_status on bids(status);
create index if not exists idx_bids_amount on bids(amount);
create index if not exists idx_bids_payment_id on bids(payment_id);

-- Enable Row Level Security (RLS)
alter table bids enable row level security;

-- Public can read bids
drop policy if exists "Public can view bids" on bids;
create policy "Public can view bids" on bids for select using (true);

-- Service role / backend has full read & write access
drop policy if exists "Service role full access" on bids;
create policy "Service role full access" on bids for all using (true);

-- ==============================================================================
-- Site Stats Table (Visitor Counts & Platform Metrics)
-- ==============================================================================

create table if not exists site_stats (
  key text primary key,
  value bigint not null default 0,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table site_stats enable row level security;

-- Public can view site_stats
drop policy if exists "Public can view site_stats" on site_stats;
create policy "Public can view site_stats" on site_stats for select using (true);

-- Service role / backend has full read & write access
drop policy if exists "Service role full access on site_stats" on site_stats;
create policy "Service role full access on site_stats" on site_stats for all using (true);

-- Seed initial visitor count if not already present
insert into site_stats (key, value)
values ('visitors', 1290)
on conflict (key) do nothing;

-- Function for atomic increment (prevents race conditions)
create or replace function increment_stat(stat_key text, amount int default 1)
returns bigint
language plpgsql
security definer
as $$
declare
  new_val bigint;
begin
  insert into site_stats (key, value, updated_at)
  values (stat_key, amount, now())
  on conflict (key)
  do update set
    value = site_stats.value + amount,
    updated_at = now()
  returning value into new_val;
  return new_val;
end;
$$;
