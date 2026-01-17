-- Location: supabase/migrations/20260116110348_reader_notification_system.sql
-- Schema Analysis: Existing comments, content tables, no reader authentication
-- Integration Type: Addition - New reader profiles and notification system
-- Dependencies: auth.users, existing comments table

-- 1. Types
CREATE TYPE public.notification_frequency AS ENUM ('instant', 'daily', 'weekly', 'never');
CREATE TYPE public.content_preference AS ENUM ('all', 'writings', 'roundtables', 'rankings', 'media');

-- 2. Reader Profiles Table (intermediary for auth.users)
CREATE TABLE public.reader_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- 3. Notification Preferences Table
CREATE TABLE public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reader_id UUID REFERENCES public.reader_profiles(id) ON DELETE CASCADE,
    new_content_frequency public.notification_frequency DEFAULT 'instant'::public.notification_frequency,
    comment_reply_frequency public.notification_frequency DEFAULT 'instant'::public.notification_frequency,
    content_types public.content_preference[] DEFAULT ARRAY['all']::public.content_preference[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(reader_id)
);

-- 4. Email Notification Log Table
CREATE TABLE public.email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reader_id UUID REFERENCES public.reader_profiles(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    content_id UUID,
    content_type public.content_type,
    email_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes
CREATE INDEX idx_reader_profiles_email ON public.reader_profiles(email);
CREATE INDEX idx_notification_preferences_reader_id ON public.notification_preferences(reader_id);
CREATE INDEX idx_email_notifications_reader_id ON public.email_notifications(reader_id);
CREATE INDEX idx_email_notifications_sent ON public.email_notifications(email_sent, created_at);

-- 6. Enable RLS
ALTER TABLE public.reader_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies

-- Pattern 1: Core user table (reader_profiles) - Simple ownership only
CREATE POLICY "readers_manage_own_profiles"
ON public.reader_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for notification preferences
CREATE POLICY "readers_manage_own_preferences"
ON public.notification_preferences
FOR ALL
TO authenticated
USING (reader_id = auth.uid())
WITH CHECK (reader_id = auth.uid());

-- Pattern 2: Simple user ownership for email notifications
CREATE POLICY "readers_view_own_notifications"
ON public.email_notifications
FOR SELECT
TO authenticated
USING (reader_id = auth.uid());

-- Admin access for email notifications (using auth metadata)
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

CREATE POLICY "admin_full_access_email_notifications"
ON public.email_notifications
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

-- 8. Triggers

-- Auto-create reader profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_reader()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.reader_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_reader
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_reader();

-- Auto-create notification preferences on reader profile creation
CREATE OR REPLACE FUNCTION public.handle_new_reader_profile()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.notification_preferences (reader_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_reader_profile_created
    AFTER INSERT ON public.reader_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_reader_profile();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_notification_preferences_updated_at();

-- 9. Helper Functions

-- Function to get readers who want notifications for new content
CREATE OR REPLACE FUNCTION public.get_readers_for_new_content_notification(
    content_type_param public.content_type
)
RETURNS TABLE(
    reader_id UUID,
    reader_email TEXT,
    reader_name TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT 
        rp.id,
        rp.email,
        rp.full_name
    FROM public.reader_profiles rp
    JOIN public.notification_preferences np ON rp.id = np.reader_id
    WHERE rp.is_active = true
    AND np.new_content_frequency = 'instant'::public.notification_frequency
    AND (
        'all'::public.content_preference = ANY(np.content_types)
        OR content_type_param::TEXT::public.content_preference = ANY(np.content_types)
    );
$$;

-- Function to log email notification
CREATE OR REPLACE FUNCTION public.log_email_notification(
    reader_id_param UUID,
    notification_type_param TEXT,
    content_id_param UUID,
    content_type_param public.content_type,
    email_sent_param BOOLEAN,
    error_message_param TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.email_notifications (
        reader_id,
        notification_type,
        content_id,
        content_type,
        email_sent,
        sent_at,
        error_message
    )
    VALUES (
        reader_id_param,
        notification_type_param,
        content_id_param,
        content_type_param,
        email_sent_param,
        CASE WHEN email_sent_param THEN CURRENT_TIMESTAMP ELSE NULL END,
        error_message_param
    )
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$;

-- 10. Mock Data
DO $$
DECLARE
    reader1_uuid UUID := gen_random_uuid();
    reader2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users for readers
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (reader1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'reader1@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (reader2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'reader2@example.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Note: reader_profiles and notification_preferences are created automatically by triggers
    
    -- Log some sample notifications
    INSERT INTO public.email_notifications (reader_id, notification_type, content_id, content_type, email_sent, sent_at)
    VALUES
        (reader1_uuid, 'new_content', (SELECT id FROM public.writings LIMIT 1), 'writing'::public.content_type, true, now()),
        (reader2_uuid, 'new_content', (SELECT id FROM public.roundtable_sessions LIMIT 1), 'roundtable'::public.content_type, true, now());
END $$;

-- 11. Comments
COMMENT ON TABLE public.reader_profiles IS 'Authenticated readers who can receive email notifications';
COMMENT ON TABLE public.notification_preferences IS 'Email notification preferences for each reader';
COMMENT ON TABLE public.email_notifications IS 'Log of all email notifications sent to readers';
COMMENT ON FUNCTION public.get_readers_for_new_content_notification IS 'Returns list of readers who want instant notifications for new content';
COMMENT ON FUNCTION public.log_email_notification IS 'Logs an email notification attempt with success/failure status';