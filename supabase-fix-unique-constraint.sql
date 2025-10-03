-- Fix unique constraint and ensure proper upsert functionality
-- This script ensures the unique constraint is properly set up for upsert operations

-- First, let's check the current constraint
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'mood_entries'::regclass 
AND contype = 'u';

-- Drop the existing unique constraint if it exists (to recreate it properly)
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS mood_entries_user_id_date_key;
ALTER TABLE mood_entries DROP CONSTRAINT IF EXISTS unique_user_date;

-- Recreate the unique constraint with a proper name
ALTER TABLE mood_entries 
ADD CONSTRAINT mood_entries_user_id_date_key UNIQUE (user_id, date);

-- Ensure the intensity column exists and has proper constraints
ALTER TABLE mood_entries 
ADD COLUMN IF NOT EXISTS intensity INTEGER DEFAULT 5 CHECK (intensity >= 1 AND intensity <= 10);

-- Update any existing records that might have NULL intensity
UPDATE mood_entries 
SET intensity = 5 
WHERE intensity IS NULL;

-- Make sure journal_entry has a default
ALTER TABLE mood_entries 
ALTER COLUMN journal_entry SET DEFAULT '';

-- Show the final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'mood_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show the constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'mood_entries'::regclass;

-- Success message
SELECT 'SUCCESS: Database constraints and columns fixed for proper upsert functionality!' as status;
