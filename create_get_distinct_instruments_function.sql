-- Function to get distinct instrument names from all_signals table
CREATE OR REPLACE FUNCTION get_distinct_instruments()
RETURNS TABLE (instrument_name text) AS $$
BEGIN
    RETURN QUERY 
    SELECT DISTINCT a.instrument_name 
    FROM all_signals a
    ORDER BY a.instrument_name;
END;
$$ LANGUAGE plpgsql;
