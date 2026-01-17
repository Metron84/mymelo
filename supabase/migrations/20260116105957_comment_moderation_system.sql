-- Location: supabase/migrations/20260116105957_comment_moderation_system.sql
-- Schema Analysis: Existing content tables (writings, roundtable_sessions, rankings, media_items)
-- Integration Type: Addition (NEW_MODULE)
-- Dependencies: writings, roundtable_sessions, rankings, media_items, auth.users

-- 1. Create ENUM types for comment system
CREATE TYPE public.comment_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.content_type AS ENUM ('writing', 'roundtable', 'ranking', 'media');
CREATE TYPE public.moderation_action AS ENUM ('approve', 'reject', 'edit');

-- 2. Create comments table with polymorphic relationship
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type public.content_type NOT NULL,
    content_id UUID NOT NULL,
    commenter_name TEXT NOT NULL,
    commenter_email TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    status public.comment_status DEFAULT 'pending'::public.comment_status,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create comment moderation actions table
CREATE TABLE public.comment_moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action public.moderation_action NOT NULL,
    reason TEXT,
    previous_status public.comment_status,
    new_status public.comment_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create indexes for performance
CREATE INDEX idx_comments_content_type ON public.comments(content_type);
CREATE INDEX idx_comments_content_id ON public.comments(content_id);
CREATE INDEX idx_comments_status ON public.comments(status);
CREATE INDEX idx_comments_created_at ON public.comments(created_at);
CREATE INDEX idx_comment_moderation_actions_comment_id ON public.comment_moderation_actions(comment_id);
CREATE INDEX idx_comment_moderation_actions_moderator_id ON public.comment_moderation_actions(moderator_id);

-- 5. Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_moderation_actions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for comments

-- Public can read approved comments
CREATE POLICY "public_read_approved_comments"
ON public.comments
FOR SELECT
TO public
USING (status = 'approved'::public.comment_status);

-- Public can create new comments (will be pending)
CREATE POLICY "public_create_comments"
ON public.comments
FOR INSERT
TO public
WITH CHECK (status = 'pending'::public.comment_status);

-- Admins can view all comments
CREATE POLICY "admin_view_all_comments"
ON public.comments
FOR SELECT
TO authenticated
USING (public.is_admin_from_auth());

-- Admins can update comments
CREATE POLICY "admin_update_comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- Admins can delete comments
CREATE POLICY "admin_delete_comments"
ON public.comments
FOR DELETE
TO authenticated
USING (public.is_admin_from_auth());

-- 7. RLS Policies for comment_moderation_actions

-- Only admins can view moderation actions
CREATE POLICY "admin_view_moderation_actions"
ON public.comment_moderation_actions
FOR SELECT
TO authenticated
USING (public.is_admin_from_auth());

-- Only admins can create moderation actions
CREATE POLICY "admin_create_moderation_actions"
ON public.comment_moderation_actions
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_from_auth());

-- 8. Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION public.update_comments_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 9. Create trigger
CREATE TRIGGER trigger_update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_comments_updated_at();

-- 10. Mock data for testing
DO $$
DECLARE
    writing_id UUID;
    roundtable_id UUID;
    ranking_id UUID;
BEGIN
    -- Get existing content IDs
    SELECT id INTO writing_id FROM public.writings LIMIT 1;
    SELECT id INTO roundtable_id FROM public.roundtable_sessions LIMIT 1;
    SELECT id INTO ranking_id FROM public.rankings LIMIT 1;

    -- Create sample pending comments
    INSERT INTO public.comments (content_type, content_id, commenter_name, commenter_email, comment_text, status)
    VALUES
        ('writing'::public.content_type, writing_id, 'Jane Reader', 'jane@example.com', 'This is an insightful piece! I would love to see more exploration of the philosophical implications discussed here.', 'pending'::public.comment_status),
        ('writing'::public.content_type, writing_id, 'Mike Thinker', 'mike@example.com', 'Excellent analysis. Have you considered the connection to contemporary political discourse?', 'pending'::public.comment_status),
        ('roundtable'::public.content_type, roundtable_id, 'Sarah Listener', 'sarah@example.com', 'The debate on this topic was fascinating. I disagree with some points but appreciate the nuanced discussion.', 'pending'::public.comment_status),
        ('ranking'::public.content_type, ranking_id, 'Alex Critic', 'alex@example.com', 'Interesting ranking system! I would place this slightly differently based on historical context.', 'pending'::public.comment_status),
        ('writing'::public.content_type, writing_id, 'Tom Scholar', 'tom@example.com', 'As someone who studies this field, I find your perspective refreshing and well-researched.', 'approved'::public.comment_status);

    RAISE NOTICE 'Sample comments created successfully';
END $$;