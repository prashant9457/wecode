-- Migration to add LeetCode support to technical_profiles
ALTER TABLE public.technical_profiles 
ADD COLUMN IF NOT EXISTS leetcode_username TEXT;

-- Verify the table exists as per user request
CREATE TABLE IF NOT EXISTS public.technical_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  github_url text null,
  linkedin_url text null,
  portfolio_url text null,
  leetcode_username text null,
  created_at timestamp with time zone null default now(),
  constraint technical_profiles_pkey primary key (id),
  constraint technical_profiles_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
);

CREATE INDEX IF NOT EXISTS idx_technical_user on public.technical_profiles using btree (user_id);
