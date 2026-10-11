-- Migration 001: Initial Schema for Freshers Fish Pond
-- Created for Freshers Fish Pond Interactive College Game

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL CHECK (char_length(trim(student_name)) > 0 AND char_length(student_name) <= 60),
    challenge_text TEXT NOT NULL CHECK (char_length(trim(challenge_text)) > 0 AND char_length(challenge_text) <= 250),
    category TEXT DEFAULT 'General Dare',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON public.challenges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_challenges_approved ON public.challenges(status) WHERE status = 'approved';

-- 2. Admin Users Table (Explicit Authorization)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Event Settings Table
CREATE TABLE IF NOT EXISTS public.event_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    event_title TEXT NOT NULL DEFAULT 'Freshers Fish Pond',
    college_name TEXT NOT NULL DEFAULT 'College Freshers 2026',
    subtitle TEXT NOT NULL DEFAULT 'One Pond. Endless Surprises. Your Challenge Awaits!',
    game_enabled BOOLEAN NOT NULL DEFAULT true,
    sound_enabled_default BOOLEAN NOT NULL DEFAULT true,
    min_approved_required INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default event settings record
INSERT INTO public.event_settings (id, event_title, college_name, subtitle, game_enabled, sound_enabled_default, min_approved_required)
VALUES (
    'default',
    'Freshers Fish Pond',
    'College Freshers 2026',
    'One Pond. Endless Surprises. Your Challenge Awaits!',
    true,
    true,
    1
)
ON CONFLICT (id) DO NOTHING;

-- 4. Helper function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_challenges_updated_at
    BEFORE UPDATE ON public.challenges
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_event_settings_updated_at
    BEFORE UPDATE ON public.event_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
