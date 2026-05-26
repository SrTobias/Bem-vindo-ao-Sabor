-- Add diet column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN diet TEXT NOT NULL DEFAULT 'omnivore';

-- Add check constraint for valid diet values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_diet_check 
CHECK (diet IN ('omnivore', 'vegetarian', 'vegan'));