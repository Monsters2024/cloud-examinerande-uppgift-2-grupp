-- Create entries table
CREATE TABLE IF NOT EXISTS public.entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own entries
CREATE POLICY "Users can view their own entries"
    ON public.entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own entries
CREATE POLICY "Users can insert their own entries"
    ON public.entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

    -- Create policy too delete their own entries
CREATE POLICY "Users can delete their own entries"
ON public.entries
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS entries_user_id_idx ON public.entries(user_id);
CREATE INDEX IF NOT EXISTS entries_created_at_idx ON public.entries(created_at DESC);

-- Add tags column to entries (TEXT array)
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}'::text[];

-- Create GIN index for fast tag filtering/search
CREATE INDEX IF NOT EXISTS entries_tags_gin_idx
  ON public.entries USING GIN (tags);

-- Add updated_at column if missing
ALTER TABLE public.entries
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Allow users to update their own entries
-- (CREATE POLICY does NOT support IF NOT EXISTS)
CREATE POLICY "Users can update their own entries"
  ON public.entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Automatically set updated_at on every update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_entries_updated_at ON public.entries;
CREATE TRIGGER trg_entries_updated_at
BEFORE UPDATE ON public.entries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();