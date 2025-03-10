-- Function to create notifications for all users with enhanced features
CREATE OR REPLACE FUNCTION create_manual_notifications(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'system',
  p_link TEXT DEFAULT NULL,
  p_link_text TEXT DEFAULT NULL,
  p_additional_data JSONB DEFAULT '{}'::jsonb
) RETURNS INTEGER AS $$
DECLARE
  notification_count INTEGER := 0;
BEGIN
  -- Insert a notification for each user
  WITH users AS (
    SELECT id FROM profiles
    WHERE id IS NOT NULL
  ),
  inserted AS (
    INSERT INTO notifications (
      user_id, 
      title, 
      message, 
      type, 
      read,
      link,
      link_text,
      additional_data
    )
    SELECT 
      users.id, 
      p_title, 
      p_message, 
      p_type,
      FALSE,
      p_link,
      p_link_text,
      p_additional_data
    FROM users
    RETURNING 1
  )
  SELECT COUNT(*) INTO notification_count FROM inserted;
  
  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;
