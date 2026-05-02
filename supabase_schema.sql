-- ============================================
-- SUPABASE SCHEMA - WORKER MARKETPLACE
-- Run this ENTIRE file in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing tables (clean slate)
drop table if exists public.workers cascade;
drop table if exists public.worker_applications cascade;
drop table if exists public.profiles cascade;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- ============================================
-- PROFILES TABLE - User roles
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text default 'customer' check (role in ('customer', 'worker', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS but with permissive policies (auth handled in app)
alter table public.profiles enable row level security;
create policy "Allow all selects" on public.profiles for select using (true);
create policy "Allow all updates" on public.profiles for update with check (true);

-- Auto-create profile on signup
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Trigger auto-profile creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- WORKER APPLICATIONS TABLE - Pending applications
-- ============================================
create table public.worker_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text not null,
  phone text not null,
  category text not null,
  area text not null,
  experience_years integer not null,
  bio text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS with permissive policies
alter table public.worker_applications enable row level security;
create policy "Allow all selects" on public.worker_applications for select using (true);
create policy "Allow all inserts" on public.worker_applications for insert with check (true);
create policy "Allow all updates" on public.worker_applications for update with check (true);

-- ============================================
-- WORKERS TABLE - Approved workers in marketplace
-- ============================================
create table public.workers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text not null,
  phone text not null,
  category text not null,
  area text not null,
  experience_years integer not null,
  bio text,
  avatar_tone text default 'neutral',
  rating numeric default 4.5,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS with permissive policies
alter table public.workers enable row level security;
create policy "Allow all selects" on public.workers for select using (true);
create policy "Allow all inserts" on public.workers for insert with check (true);
create policy "Allow all updates" on public.workers for update with check (true);

-- ============================================
-- SETUP COMPLETE
-- All authorization is handled in app code
-- First user at /auth gets auto role='customer'
-- Set your role to 'admin' via SQL: UPDATE public.profiles SET role='admin' WHERE email='your@email.com';
-- ============================================
