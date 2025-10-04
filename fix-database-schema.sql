-- Fix database schema for emotional and activity patterns
-- Run this in Supabase SQL Editor

-- First, check if the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'mood_entries' 
AND column_name IN ('emotions', 'activities');

-- If the columns don't exist, add them:
-- ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS emotions TEXT[] DEFAULT '{}';
-- ALTER TABLE mood_entries ADD COLUMN IF NOT EXISTS activities TEXT[] DEFAULT '{}';

-- Check current table structure
\d mood_entries;

-- Test insert with patterns
INSERT INTO mood_entries (user_id, date, mood_score, emotions, activities, journal_entry)
VALUES (
    (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user_id
    CURRENT_DATE,
    4,
    ARRAY['Happy', 'Excited'],
    ARRAY['Exercise', 'Music'],
    'Test entry with patterns'
);

-- Test retrieval
SELECT id, date, mood_score, emotions, activities, journal_entry
FROM mood_entries 
WHERE emotions IS NOT NULL OR activities IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'mood_entries';
