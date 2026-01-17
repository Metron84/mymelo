-- Location: supabase/migrations/20260116120146_admin_password_reset.sql
-- Module: Admin Password Reset System
-- Dependencies: None (admin auth uses NextAuth, not Supabase auth tables)

-- Create admin password reset tokens table
CREATE TABLE IF NOT EXISTS public.admin_password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_admin_password_reset_tokens_token ON public.admin_password_reset_tokens(token);
CREATE INDEX idx_admin_password_reset_tokens_email ON public.admin_password_reset_tokens(email);
CREATE INDEX idx_admin_password_reset_tokens_expires_at ON public.admin_password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.admin_password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Public access for password reset operations (no auth required for forgotten passwords)
CREATE POLICY "allow_public_token_validation"
ON public.admin_password_reset_tokens
FOR SELECT
TO public
USING (NOT used AND expires_at > CURRENT_TIMESTAMP);

CREATE POLICY "allow_public_token_creation"
ON public.admin_password_reset_tokens
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "allow_public_token_update"
ON public.admin_password_reset_tokens
FOR UPDATE
TO public
USING (NOT used AND expires_at > CURRENT_TIMESTAMP);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_reset_tokens()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.admin_password_reset_tokens
    WHERE expires_at < CURRENT_TIMESTAMP OR used = true;
END;
$$;

-- Function to generate secure random token
CREATE OR REPLACE FUNCTION public.generate_admin_reset_token(admin_email TEXT)
RETURNS TABLE(token TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_token TEXT;
    token_expiry TIMESTAMPTZ;
BEGIN
    -- Generate cryptographically secure token
    new_token := encode(gen_random_bytes(32), 'hex');
    token_expiry := CURRENT_TIMESTAMP + INTERVAL '1 hour';
    
    -- Insert token
    INSERT INTO public.admin_password_reset_tokens (email, token, expires_at)
    VALUES (admin_email, new_token, token_expiry);
    
    RETURN QUERY SELECT new_token, token_expiry;
END;
$$;

-- Function to validate and mark token as used
CREATE OR REPLACE FUNCTION public.validate_admin_reset_token(reset_token TEXT)
RETURNS TABLE(email TEXT, is_valid BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token_email TEXT;
    token_valid BOOLEAN := false;
BEGIN
    -- Check if token exists, is not used, and not expired
    SELECT art.email INTO token_email
    FROM public.admin_password_reset_tokens art
    WHERE art.token = reset_token
      AND art.used = false
      AND art.expires_at > CURRENT_TIMESTAMP;
    
    IF token_email IS NOT NULL THEN
        token_valid := true;
        -- Mark token as used
        UPDATE public.admin_password_reset_tokens
        SET used = true
        WHERE token = reset_token;
    END IF;
    
    RETURN QUERY SELECT token_email, token_valid;
END;
$$;