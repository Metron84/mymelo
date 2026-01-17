-- Location: supabase/migrations/20260116103341_content_management_system.sql
-- Schema Analysis: Only historical_figures table exists, no content management system
-- Integration Type: New module - Content Management System
-- Dependencies: None (standalone content system)

-- 1. Custom Types for Content Management
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE public.content_category AS ENUM ('philosophy', 'culture', 'politics', 'society', 'technology', 'general');
CREATE TYPE public.media_type AS ENUM ('podcast', 'video', 'article', 'interview');
CREATE TYPE public.ranking_tier AS ENUM ('s_tier', 'a_tier', 'b_tier', 'c_tier', 'd_tier', 'f_tier');

-- 2. Core Content Tables

-- Writings table
CREATE TABLE public.writings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT NOT NULL DEFAULT 'Admin',
    category public.content_category NOT NULL DEFAULT 'general'::public.content_category,
    status public.content_status NOT NULL DEFAULT 'draft'::public.content_status,
    tags TEXT[] DEFAULT '{}',
    read_time INTEGER, -- in minutes
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Rankings table
CREATE TABLE public.rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category public.content_category NOT NULL DEFAULT 'general'::public.content_category,
    methodology TEXT,
    tier public.ranking_tier NOT NULL,
    ranking_position INTEGER NOT NULL,
    subject_name TEXT NOT NULL,
    subject_description TEXT,
    rationale TEXT NOT NULL,
    status public.content_status NOT NULL DEFAULT 'draft'::public.content_status,
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Roundtable Sessions table
CREATE TABLE public.roundtable_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    topic TEXT NOT NULL,
    participants TEXT[] NOT NULL,
    moderator TEXT,
    duration INTEGER, -- in minutes
    key_points TEXT[],
    debate_summary TEXT,
    category public.content_category NOT NULL DEFAULT 'general'::public.content_category,
    status public.content_status NOT NULL DEFAULT 'draft'::public.content_status,
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    session_date TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Media Library table
CREATE TABLE public.media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    media_type public.media_type NOT NULL,
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    series_name TEXT,
    episode_number INTEGER,
    duration INTEGER, -- in seconds
    guest_name TEXT,
    category public.content_category NOT NULL DEFAULT 'general'::public.content_category,
    status public.content_status NOT NULL DEFAULT 'draft'::public.content_status,
    tags TEXT[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    play_count INTEGER DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes for Performance
CREATE INDEX idx_writings_status ON public.writings(status);
CREATE INDEX idx_writings_category ON public.writings(category);
CREATE INDEX idx_writings_published_at ON public.writings(published_at DESC);
CREATE INDEX idx_writings_tags ON public.writings USING GIN(tags);

CREATE INDEX idx_rankings_status ON public.rankings(status);
CREATE INDEX idx_rankings_category ON public.rankings(category);
CREATE INDEX idx_rankings_tier ON public.rankings(tier);
CREATE INDEX idx_rankings_tags ON public.rankings USING GIN(tags);

CREATE INDEX idx_roundtable_status ON public.roundtable_sessions(status);
CREATE INDEX idx_roundtable_category ON public.roundtable_sessions(category);
CREATE INDEX idx_roundtable_session_date ON public.roundtable_sessions(session_date DESC);
CREATE INDEX idx_roundtable_tags ON public.roundtable_sessions USING GIN(tags);

CREATE INDEX idx_media_status ON public.media_items(status);
CREATE INDEX idx_media_type ON public.media_items(media_type);
CREATE INDEX idx_media_category ON public.media_items(category);
CREATE INDEX idx_media_tags ON public.media_items USING GIN(tags);

-- 4. Updated_at Trigger Functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$;

CREATE TRIGGER update_writings_updated_at
    BEFORE UPDATE ON public.writings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rankings_updated_at
    BEFORE UPDATE ON public.rankings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roundtable_updated_at
    BEFORE UPDATE ON public.roundtable_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON public.media_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enable Row Level Security
ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roundtable_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Public read, admin write (using Pattern 6A - auth.users metadata)

-- Function to check admin role from auth.users metadata
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- Public read access for published content
CREATE POLICY "public_read_published_writings"
ON public.writings
FOR SELECT
TO public
USING (status = 'published'::public.content_status);

CREATE POLICY "public_read_published_rankings"
ON public.rankings
FOR SELECT
TO public
USING (status = 'published'::public.content_status);

CREATE POLICY "public_read_published_roundtables"
ON public.roundtable_sessions
FOR SELECT
TO public
USING (status = 'published'::public.content_status);

CREATE POLICY "public_read_published_media"
ON public.media_items
FOR SELECT
TO public
USING (status = 'published'::public.content_status);

-- Admin full access (using auth metadata check - safe for all tables)
CREATE POLICY "admin_full_access_writings"
ON public.writings
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_rankings"
ON public.rankings
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_roundtables"
ON public.roundtable_sessions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

CREATE POLICY "admin_full_access_media"
ON public.media_items
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 7. Sample Data for Testing
DO $$
DECLARE
    writing_id UUID := gen_random_uuid();
    ranking_id UUID := gen_random_uuid();
    roundtable_id UUID := gen_random_uuid();
    media_id UUID := gen_random_uuid();
BEGIN
    -- Sample Writing
    INSERT INTO public.writings (
        id, title, subtitle, content, excerpt, author, category, status, 
        tags, read_time, featured, published_at
    ) VALUES (
        writing_id,
        'The Philosophy of Coffee Culture',
        'How coffee shops became modern agoras',
        'In the heart of every thriving city, there exists a space where ideas percolate as richly as the coffee brewing behind the counter...',
        'Exploring how coffee shops have become modern spaces for philosophical discourse and cultural exchange.',
        'Admin',
        'philosophy'::public.content_category,
        'published'::public.content_status,
        ARRAY['philosophy', 'culture', 'society'],
        8,
        true,
        CURRENT_TIMESTAMP
    );

    -- Sample Ranking
    INSERT INTO public.rankings (
        id, title, description, category, methodology, tier, ranking_position,
        subject_name, subject_description, rationale, status, tags, published_at
    ) VALUES (
        ranking_id,
        'Greatest Philosophers of Modern Era',
        'Ranking influential thinkers who shaped contemporary thought',
        'philosophy'::public.content_category,
        'Based on cultural impact, originality of ideas, and lasting influence on modern discourse',
        's_tier'::public.ranking_tier,
        1,
        'Michel Foucault',
        'French philosopher and social theorist',
        'Revolutionary analysis of power structures and social institutions that fundamentally changed how we understand society',
        'published'::public.content_status,
        ARRAY['philosophy', 'theory', 'influence'],
        CURRENT_TIMESTAMP
    );

    -- Sample Roundtable Session
    INSERT INTO public.roundtable_sessions (
        id, title, description, topic, participants, moderator, duration,
        key_points, debate_summary, category, status, tags, session_date, published_at
    ) VALUES (
        roundtable_id,
        'The Future of Democratic Discourse',
        'A lively debate on how digital platforms are reshaping political conversations',
        'Democracy and Digital Media',
        ARRAY['Dr. Sarah Chen', 'Prof. James Morrison', 'Maya Patel'],
        'Alex Thompson',
        90,
        ARRAY[
            'Social media amplification effects on political polarization',
            'The role of fact-checking in modern journalism',
            'Balancing free speech with platform responsibility'
        ],
        'The panel concluded that while digital platforms have democratized access to information, they have also created echo chambers that challenge traditional democratic discourse.',
        'politics'::public.content_category,
        'published'::public.content_status,
        ARRAY['politics', 'media', 'democracy'],
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Sample Media Item
    INSERT INTO public.media_items (
        id, title, description, media_type, media_url, thumbnail_url,
        series_name, episode_number, duration, guest_name, category,
        status, tags, published_at
    ) VALUES (
        media_id,
        'Coffee & Philosophy: Season 1, Episode 1',
        'Join us for an intimate conversation about existentialism over espresso',
        'podcast'::public.media_type,
        'https://example.com/podcast/s1e1.mp3',
        'https://example.com/thumbnails/s1e1.jpg',
        'Coffee & Philosophy',
        1,
        3600,
        'Dr. Emily Rhodes',
        'philosophy'::public.content_category,
        'published'::public.content_status,
        ARRAY['podcast', 'philosophy', 'interview'],
        CURRENT_TIMESTAMP
    );
END $$;

-- 8. Helper Functions for Content Statistics
CREATE OR REPLACE FUNCTION public.get_content_stats()
RETURNS TABLE(
    total_writings BIGINT,
    total_rankings BIGINT,
    total_roundtables BIGINT,
    total_media BIGINT,
    published_content BIGINT,
    draft_content BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT
        (SELECT COUNT(*) FROM public.writings) as total_writings,
        (SELECT COUNT(*) FROM public.rankings) as total_rankings,
        (SELECT COUNT(*) FROM public.roundtable_sessions) as total_roundtables,
        (SELECT COUNT(*) FROM public.media_items) as total_media,
        (SELECT COUNT(*) FROM (
            SELECT id FROM public.writings WHERE status = 'published'
            UNION ALL
            SELECT id FROM public.rankings WHERE status = 'published'
            UNION ALL
            SELECT id FROM public.roundtable_sessions WHERE status = 'published'
            UNION ALL
            SELECT id FROM public.media_items WHERE status = 'published'
        ) as published) as published_content,
        (SELECT COUNT(*) FROM (
            SELECT id FROM public.writings WHERE status = 'draft'
            UNION ALL
            SELECT id FROM public.rankings WHERE status = 'draft'
            UNION ALL
            SELECT id FROM public.roundtable_sessions WHERE status = 'draft'
            UNION ALL
            SELECT id FROM public.media_items WHERE status = 'draft'
        ) as drafts) as draft_content
$$;