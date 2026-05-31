-- Add language column to profiles table
ALTER TABLE public.profiles ADD COLUMN language VARCHAR(2) NOT NULL DEFAULT 'pt';

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
