-- Notification tracking table for preventing duplicate notifications
-- This helps us keep track of which users have already received certain notifications
CREATE TABLE IF NOT EXISTS notification_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add indexes for faster lookups
  CONSTRAINT notification_tracking_key_unique UNIQUE (key)
);

-- Add an index on created_at for efficient pruning of old records
CREATE INDEX IF NOT EXISTS notification_tracking_created_at_idx ON notification_tracking(created_at);

-- Create function to automatically clean up old notification tracking records
CREATE OR REPLACE FUNCTION clean_old_notification_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete tracking records older than 30 days
  DELETE FROM notification_tracking
  WHERE created_at < NOW() - INTERVAL '30 days';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run cleanup function daily
DROP TRIGGER IF EXISTS trigger_clean_notification_tracking ON notification_tracking;
CREATE TRIGGER trigger_clean_notification_tracking
AFTER INSERT ON notification_tracking
EXECUTE PROCEDURE clean_old_notification_tracking();

-- Comments for clarity
COMMENT ON TABLE notification_tracking IS 'Tracks which notifications have been sent to prevent duplicates';
COMMENT ON COLUMN notification_tracking.key IS 'Unique key identifying the notification (e.g., userId_notificationType_entityId)';
COMMENT ON COLUMN notification_tracking.created_at IS 'When the notification was sent';