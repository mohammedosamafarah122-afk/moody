-- Fix missing columns in mood_entries table
-- This script adds the missing intensity and notes columns

-- Add intensity column if it doesn't exist
ALTER TABLE mood_entries 
ADD COLUMN IF NOT EXISTS intensity INTEGER DEFAULT 5 CHECK (intensity >= 1 AND intensity <= 10);

-- Add notes column if it doesn't exist (we'll use journal_entry for notes)
-- The journal_entry column already exists, so we just need to ensure it's properly set up
ALTER TABLE mood_entries 
ALTER COLUMN journal_entry SET DEFAULT '';

-- Update existing records to have default values
UPDATE mood_entries 
SET intensity = 5 
WHERE intensity IS NULL;

UPDATE mood_entries 
SET journal_entry = '' 
WHERE journal_entry IS NULL;

-- Show current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'mood_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show success message
SELECT 'SUCCESS: Missing columns added to mood_entries table!' as status;
