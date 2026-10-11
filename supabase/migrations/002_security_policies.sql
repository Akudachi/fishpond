-- Migration 002: Row Level Security & Access Control Policies

-- 1. Enable RLS on all tables
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;

-- 2. Security helper function: Check if authenticated user is registered admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =========================================================================
-- CHALLENGES POLICIES
-- =========================================================================

-- Public can submit challenges, but MUST be status 'pending'
CREATE POLICY "Public can submit pending challenges"
    ON public.challenges
    FOR INSERT
    TO public
    WITH CHECK (
        status = 'pending'
        AND char_length(trim(challenge_text)) > 0
        AND char_length(challenge_text) <= 250
    );

-- Public can ONLY view approved challenges for the game
CREATE POLICY "Public can view approved challenges"
    ON public.challenges
    FOR SELECT
    TO public
    USING (status = 'approved');

-- Admins have full access to view, update, approve, reject, or delete challenges
CREATE POLICY "Admins full access to challenges"
    ON public.challenges
    FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =========================================================================
-- ADMIN USERS POLICIES
-- =========================================================================

-- Authenticated admins can view the admin roster, and users can check their own role
CREATE POLICY "Admins can view admin roster"
    ON public.admin_users
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR public.is_admin());

-- =========================================================================
-- EVENT SETTINGS POLICIES
-- =========================================================================

-- Public visitors can read event settings (title, subtitle, categories, game_enabled)
CREATE POLICY "Public can read event settings"
    ON public.event_settings
    FOR SELECT
    TO public
    USING (true);

-- Only admins can update event settings
CREATE POLICY "Admins can update event settings"
    ON public.event_settings
    FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- =========================================================================
-- SECURE RANDOM CHALLENGE RPC FUNCTION
-- =========================================================================

CREATE OR REPLACE FUNCTION public.get_random_approved_challenge(last_challenge_id UUID DEFAULT NULL)
RETURNS TABLE (
    id UUID,
    student_name TEXT,
    challenge_text TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    approved_count INT;
BEGIN
    -- Check how many approved challenges exist
    SELECT count(*) INTO approved_count
    FROM public.challenges
    WHERE status = 'approved';

    IF approved_count = 0 THEN
        RETURN;
    END IF;

    -- If more than 1 challenge exists and last_challenge_id is provided, exclude last challenge
    IF approved_count > 1 AND last_challenge_id IS NOT NULL THEN
        RETURN QUERY
        SELECT c.id, c.student_name, c.challenge_text, c.category, c.created_at
        FROM public.challenges c
        WHERE c.status = 'approved' AND c.id <> last_challenge_id
        ORDER BY random()
        LIMIT 1;
    ELSE
        RETURN QUERY
        SELECT c.id, c.student_name, c.challenge_text, c.category, c.created_at
        FROM public.challenges c
        WHERE c.status = 'approved'
        ORDER BY random()
        LIMIT 1;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to public and authenticated
GRANT EXECUTE ON FUNCTION public.get_random_approved_challenge(UUID) TO anon, authenticated;

-- =========================================================================
-- REMOVE CHALLENGE FROM POND ONCE CAUGHT
-- =========================================================================

CREATE OR REPLACE FUNCTION public.mark_challenge_caught(challenge_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.challenges
    SET status = 'completed',
        updated_at = timezone('utc'::text, now())
    WHERE id = challenge_id AND status = 'approved';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution to public and authenticated
GRANT EXECUTE ON FUNCTION public.mark_challenge_caught(UUID) TO anon, authenticated;

