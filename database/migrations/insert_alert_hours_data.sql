-- Clear existing data (optional)
-- TRUNCATE TABLE public.alert_hours RESTART IDENTITY;

-- US Bonds
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('10YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('2YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('30YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true),
  ('5YR', 'US Bonds', 1, '13:30:00', '16:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- European Bonds
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('FGBL', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true),
  ('FGBM', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true),
  ('FGBS', 'European Bonds', 1, '08:16:00', '11:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- European Indices
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('FDAX', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FDAX', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FDXS', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FDXS', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FESX', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FESX', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FDXM', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FDXM', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FESXM', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FESXM', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true),
  ('FSXE', 'European Indices', 1, '08:16:00', '10:00:00', '{1,2,3,4,5}', true),
  ('FSXE', 'European Indices', 2, '14:00:00', '16:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- US Indices
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('ES', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('ES', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('NQ', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('NQ', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('RTY', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('RTY', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('YM', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('YM', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('MYM', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('MYM', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('M2K', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('M2K', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('MES', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('MES', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('MNQ', 'US Indices', 1, '15:46:00', '17:01:00', '{1,2,3,4,5}', true),
  ('MNQ', 'US Indices', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- Forex Majors
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('6E', 'Forex Major', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('6E', 'Forex Major', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6B', 'Forex Major', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('6B', 'Forex Major', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6S', 'Forex Major', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('6S', 'Forex Major', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6J', 'Forex Major', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('6J', 'Forex Major', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6A', 'Forex Major', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('6A', 'Forex Major', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6N', 'Forex Major', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('6N', 'Forex Major', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6C', 'Forex Major', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('6M', 'Forex Major', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- Micro Forex Futures
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('M6E', 'Forex Minor', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('M6E', 'Forex Minor', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6B', 'Forex Minor', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('M6B', 'Forex Minor', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6S', 'Forex Minor', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('M6S', 'Forex Minor', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6J', 'Forex Minor', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('M6J', 'Forex Minor', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6A', 'Forex Minor', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('M6A', 'Forex Minor', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6N', 'Forex Minor', 1, '01:02:00', '04:00:00', '{1,2,3,4,5}', true),
  ('M6N', 'Forex Minor', 2, '15:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6C', 'Forex Minor', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('M6L', 'Forex Minor', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- Energy & Metals
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('CL', 'Energy & Metals', 1, '13:02:00', '16:30:00', '{1,2,3,4,5}', true),
  ('CL', 'Energy & Metals', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('MCL', 'Energy & Metals', 1, '13:02:00', '16:30:00', '{1,2,3,4,5}', true),
  ('MCL', 'Energy & Metals', 2, '19:00:00', '21:00:00', '{1,2,3,4,5}', true),
  ('GC', 'Energy & Metals', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('GC', 'Energy & Metals', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('SI', 'Energy & Metals', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('SI', 'Energy & Metals', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('MGC', 'Energy & Metals', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('MGC', 'Energy & Metals', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('QO', 'Energy & Metals', 1, '08:02:00', '10:00:00', '{1,2,3,4,5}', true),
  ('QO', 'Energy & Metals', 2, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('NG', 'Energy & Metals', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('HO', 'Energy & Metals', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('RB', 'Energy & Metals', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('HG', 'Energy & Metals', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true),
  ('QG', 'Energy & Metals', 1, '14:00:00', '17:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;

-- Agriculture & Livestock
INSERT INTO public.alert_hours 
  (instrument, instrument_group, session_number, start_time_utc, end_time_utc, days_active, is_active)
VALUES
  ('ZC', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('ZW', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('ZS', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('LE', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('HE', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true),
  ('GF', 'Agriculture & Livestock', 1, '14:30:00', '17:00:00', '{1,2,3,4,5}', true)
ON CONFLICT (instrument, session_number) DO UPDATE 
SET 
  instrument_group = EXCLUDED.instrument_group,
  start_time_utc = EXCLUDED.start_time_utc,
  end_time_utc = EXCLUDED.end_time_utc,
  days_active = EXCLUDED.days_active,
  is_active = EXCLUDED.is_active;
