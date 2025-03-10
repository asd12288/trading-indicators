-- Create a view as an alternative option if you prefer not to use a separate table with triggers
CREATE OR REPLACE VIEW latest_signals_view AS
SELECT DISTINCT ON (instrument_name) *
FROM all_signals
ORDER BY instrument_name, entry_time DESC;

-- This view can be used as an alternative to the table approach
-- It will always show the latest data without needing triggers
-- But might be slightly slower for very large datasets
-- Usage: SELECT * FROM latest_signals_view;
