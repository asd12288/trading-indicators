-- Create alert_hours table
CREATE TABLE IF NOT EXISTS public.alert_hours (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  instrument TEXT NOT NULL,
  instrument_group TEXT NOT NULL,
  session_number INTEGER NOT NULL DEFAULT 1,
  start_time_utc TIME NOT NULL,
  end_time_utc TIME NOT NULL,
  days_active INTEGER[] NOT NULL DEFAULT '{1,2,3,4,5}'::INTEGER[], -- Default to weekdays
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_alert_hours_instrument ON public.alert_hours(instrument);
CREATE INDEX IF NOT EXISTS idx_alert_hours_group ON public.alert_hours(instrument_group);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_alert_hours_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_alert_hours_timestamp ON public.alert_hours;
CREATE TRIGGER set_alert_hours_timestamp
BEFORE UPDATE ON public.alert_hours
FOR EACH ROW
EXECUTE FUNCTION update_alert_hours_modified_column();

-- Add initial data for common instruments
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  -- US Bonds
  ('10YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('2YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('30YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('5YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  
  -- European Bonds
  ('FGBL', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true),
  ('FGBM', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true),
  ('FGBS', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true),
  
  -- European Indices
  ('FDAX', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FDAX', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FDXS', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FDXS', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FESX', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FESX', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  
  -- US Indices
  ('ES', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('ES', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('NQ', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('NQ', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('RTY', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('RTY', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  
  -- Forex Major
  ('6E', 'Forex Major', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('6E', 'Forex Major', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6B', 'Forex Major', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('6B', 'Forex Major', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  
  -- Energy & Metals
  ('CL', 'Energy & Metals', 1, '13:02:00', '16:30:00', '{1,2,3,4,5}', true),
  ('CL', 'Energy & Metals', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('GC', 'Energy & Metals', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('GC', 'Energy & Metals', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  
  -- Agriculture
  ('ZC', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('ZW', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true)
ON CONFLICT DO NOTHING;
