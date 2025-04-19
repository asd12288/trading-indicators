-- Notification preferences table for storing user notification settings
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Trading notifications
  trading_signals BOOLEAN NOT NULL DEFAULT TRUE,
  price_breakouts BOOLEAN NOT NULL DEFAULT TRUE,
  volatility_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  pattern_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Other notifications
  economic_events BOOLEAN NOT NULL DEFAULT TRUE,
  subscription_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  performance_milestones BOOLEAN NOT NULL DEFAULT TRUE,
  risk_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT notification_preferences_user_id_unique UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS notification_preferences_user_id_idx ON notification_preferences(user_id);

-- Add RLS policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read their own preferences
CREATE POLICY notification_preferences_select
  ON notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);
  
-- Users can only insert their own preferences
CREATE POLICY notification_preferences_insert
  ON notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
-- Users can only update their own preferences
CREATE POLICY notification_preferences_update
  ON notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments for clarity
COMMENT ON TABLE notification_preferences IS 'Stores user notification preferences for different types of notifications';
COMMENT ON COLUMN notification_preferences.user_id IS 'The user who owns these notification preferences';
COMMENT ON COLUMN notification_preferences.trading_signals IS 'Whether to receive notifications about new trading signals';
COMMENT ON COLUMN notification_preferences.price_breakouts IS 'Whether to receive notifications about price breakouts';
COMMENT ON COLUMN notification_preferences.volatility_alerts IS 'Whether to receive notifications about volatility changes';
COMMENT ON COLUMN notification_preferences.pattern_alerts IS 'Whether to receive notifications about chart pattern detections';
COMMENT ON COLUMN notification_preferences.economic_events IS 'Whether to receive notifications about economic calendar events';
COMMENT ON COLUMN notification_preferences.subscription_reminders IS 'Whether to receive subscription reminder notifications';
COMMENT ON COLUMN notification_preferences.performance_milestones IS 'Whether to receive trading performance milestone notifications';
COMMENT ON COLUMN notification_preferences.risk_alerts IS 'Whether to receive risk level change notifications';