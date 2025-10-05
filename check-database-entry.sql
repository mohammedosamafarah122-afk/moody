-- Check specific mood entry by ID
SELECT 
    id,
    date,
    mood_score,
    journal_entry,
    intensity,
    created_at,
    updated_at
FROM mood_entries 
WHERE id = '463fe9d6-b79d-4e56-9994-40e0725f0a3f';

-- Check if this entry has hashtags
SELECT 
    id,
    journal_entry,
    CASE 
        WHEN journal_entry LIKE '%#%' THEN 'HAS HASHTAGS'
        ELSE 'NO HASHTAGS'
    END as hashtag_status
FROM mood_entries 
WHERE id = '463fe9d6-b79d-4e56-9994-40e0725f0a3f';

-- Check recent entries with hashtags
SELECT 
    id,
    date,
    mood_score,
    journal_entry,
    created_at
FROM mood_entries 
WHERE journal_entry LIKE '%#%'
ORDER BY created_at DESC
LIMIT 5;
