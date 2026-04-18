-- 🔹 user_profiles (basic info)
CREATE TABLE public.user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔹 academic_details (education)
CREATE TABLE public.academic_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    college_name TEXT,
    degree TEXT,
    branch TEXT,
    year_of_study INT,
    cgpa NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔹 technical_profiles (links)
CREATE TABLE public.technical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔹 skills (master list)
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL
);

-- 🔹 user_skills (mapping)
CREATE TABLE public.user_skills (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, skill_id)
);

-- ⚡ INDEXES
CREATE INDEX idx_academic_user ON public.academic_details(user_id);
CREATE INDEX idx_technical_user ON public.technical_profiles(user_id);
CREATE INDEX idx_user_skills_user ON public.user_skills(user_id);
