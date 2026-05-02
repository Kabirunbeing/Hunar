-- SUPABASE SCHEMA - Run this in your Supabase SQL Editor
-- This is a fixed version without circular RLS dependencies

-- ============================================
-- 1. WORKER APPLICATIONS TABLE
-- ============================================
create table if not exists public.worker_applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  category text not null,
  area text not null,
  experience_years integer not null,
  bio text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.worker_applications enable row level security;

create policy "Users can insert their own application" 
  on public.worker_applications for insert 
  to authenticated 
  with check (auth.uid() = user_id);

create policy "Users can view their own applications" 
  on public.worker_applications for select 
  to authenticated 
  using (auth.uid() = user_id);

create policy "Allow admin updates" 
  on public.worker_applications for update 
  to authenticated 
  using (true);

-- ============================================
-- 2. PROFILES TABLE (Role management)
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text default 'customer' check (role in ('customer', 'worker', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Simple policy: users can always read their own profile
create policy "Users can view own profile" 
  on public.profiles for select 
  to authenticated 
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile" 
  on public.profiles for update 
  to authenticated 
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Drop and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 3. WORKERS TABLE (Approved workers)
-- ============================================
create table if not exists public.workers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
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

alter table public.workers enable row level security;

-- Public can view all workers (marketplace)
create policy "Workers are publicly viewable" 
  on public.workers for select 
  to public 
  using (true);

-- Workers can update their own profile
create policy "Workers can update own profile" 
  on public.workers for update 
  to authenticated 
  using (auth.uid() = user_id);

-- Allow authenticated inserts (admin check in app)
create policy "Allow worker inserts" 
  on public.workers for insert 
  to authenticated 
  with check (true);
