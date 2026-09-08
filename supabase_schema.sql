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
