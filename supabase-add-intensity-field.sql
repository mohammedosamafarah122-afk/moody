-- Add intensity field to mood_entries table
-- This script adds an intensity field to track mood intensity (1-10 scale)

-- Add intensity column to mood_entries table
ALTER TABLE mood_entries 
ADD COLUMN intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10);

-- Add comment to explain the field
COMMENT ON COLUMN mood_entries.intensity IS 'Mood intensity on a scale of 1-10';

-- Update existing records to have a default intensity of 5
UPDATE mood_entries 
SET intensity = 5 
WHERE intensity IS NULL;

-- Make intensity NOT NULL with default value
ALTER TABLE mood_entries 
ALTER COLUMN intensity SET NOT NULL,
ALTER COLUMN intensity SET DEFAULT 5;

-- Create index for intensity queries
CREATE INDEX idx_mood_entries_intensity ON mood_entries(intensity);

-- Show success message
SELECT 'SUCCESS: Intensity field added to mood_entries table!' as status;
