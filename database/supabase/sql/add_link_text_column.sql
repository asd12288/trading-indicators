-- Add link_text column to notifications table if it doesn't exist
DO $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_name = 'notifications' AND column_name = 'link_text'
  ) THEN
      -- Add the missing column
      ALTER TABLE notifications ADD COLUMN link_text TEXT;
  END IF;
END $$;
