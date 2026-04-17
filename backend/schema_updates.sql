-- 1. Fix coding_profiles.platform
ALTER TABLE public.coding_profiles
ALTER COLUMN platform SET NOT NULL;

-- 2. Add updated_at to users
ALTER TABLE public.users
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Improve activity_feed
ALTER TABLE public.activity_feed
ADD COLUMN platform VARCHAR(50);

-- 4. Add Indexes (Performance Critical)
CREATE INDEX IF NOT EXISTS idx_submissions_user 
ON public.submissions(user_id);

CREATE INDEX IF NOT EXISTS idx_submissions_problem 
ON public.submissions(problem_id);

CREATE INDEX IF NOT EXISTS idx_friends_user 
ON public.friends(user_id);

CREATE INDEX IF NOT EXISTS idx_friends_friend 
ON public.friends(friend_id);

CREATE INDEX IF NOT EXISTS idx_feed_user 
ON public.activity_feed(user_id);

CREATE INDEX IF NOT EXISTS idx_feed_time 
ON public.activity_feed(created_at DESC);
