-- Auto-confirm all existing and new users
-- This script enables immediate access without email verification

-- Auto-confirm all existing users who haven't confirmed their email
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- Create function to auto-confirm new users
CREATE OR REPLACE FUNCTION auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-confirm new users on registration
CREATE TRIGGER auto_confirm_user_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_confirm_user();

-- Verify the changes
SELECT 
  COUNT(*) as total_users,
  COUNT(email_confirmed_at) as confirmed_users
FROM auth.users;

-- Show success message
SELECT 'SUCCESS: Auto-confirmation enabled for all users!' as status;
