-- First, drop all versions of the function
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT, BOOLEAN);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB);
DROP FUNCTION IF EXISTS create_manual_notifications(TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TIMESTAMPTZ);

-- Create improved version with better timestamp handling
CREATE OR REPLACE FUNCTION create_manual_notifications(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'system',
  p_link TEXT DEFAULT NULL,
  p_link_text TEXT DEFAULT NULL,
  p_additional_data JSONB DEFAULT '{}'::jsonb,
  p_created_at TIMESTAMPTZ DEFAULT now()
) RETURNS INTEGER AS $$
DECLARE
  notification_count INTEGER := 0;
  has_link_text BOOLEAN;
BEGIN
  -- Check if link_text column exists
  SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'notifications' AND column_name = 'link_text'
  ) INTO has_link_text;

  -- Handle cases with or without link_text column
  IF has_link_text THEN
    -- Insert with link_text column
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
        additional_data,
        created_at,
        timestamp
      )
      SELECT 
        users.id, 
        p_title, 
        p_message, 
        p_type,
        FALSE,
        p_link,
        p_link_text,
        CASE 
          WHEN p_link_text IS NOT NULL AND p_additional_data IS NOT NULL 
            THEN jsonb_set(p_additional_data, '{link_text}', to_jsonb(p_link_text))
          WHEN p_link_text IS NOT NULL
            THEN jsonb_build_object('link_text', p_link_text)
          ELSE p_additional_data
        END,
        p_created_at,  -- Set created_at directly from parameter
        p_created_at   -- Also set timestamp field for compatibility
      FROM users
      RETURNING 1
    )
    SELECT COUNT(*) INTO notification_count FROM inserted;
  ELSE
    -- Insert without link_text column (store it in additional_data instead)
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
        additional_data,
        created_at,
        timestamp
      )
      SELECT 
        users.id, 
        p_title, 
        p_message, 
        p_type,
        FALSE,
        p_link,
        CASE 
          WHEN p_link_text IS NOT NULL AND p_additional_data IS NOT NULL 
            THEN jsonb_set(p_additional_data, '{link_text}', to_jsonb(p_link_text))
          WHEN p_link_text IS NOT NULL
            THEN jsonb_build_object('link_text', p_link_text)
          ELSE p_additional_data
        END,
        p_created_at,  -- Set created_at directly from parameter
        p_created_at   -- Also set timestamp field for compatibility
      FROM users
      RETURNING 1
    )
    SELECT COUNT(*) INTO notification_count FROM inserted;
  END IF;

  RETURN notification_count;
END;
$$ LANGUAGE plpgsql;
