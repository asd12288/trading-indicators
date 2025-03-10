-- Create the latest_signals_per_instrument table with the same structure as all_signals
CREATE TABLE latest_signals_per_instrument (
    LIKE all_signals INCLUDING ALL
);

-- Add primary key constraint on instrument_name since we only want one row per instrument
ALTER TABLE latest_signals_per_instrument 
    DROP CONSTRAINT latest_signals_per_instrument_pkey,
    ADD CONSTRAINT latest_signals_per_instrument_pkey PRIMARY KEY (instrument_name);

-- Create indexes for better performance
CREATE INDEX idx_latest_signals_entry_time ON latest_signals_per_instrument(entry_time);
CREATE INDEX idx_latest_signals_account_name ON latest_signals_per_instrument(account_name);

-- Add table comment
COMMENT ON TABLE latest_signals_per_instrument IS 'Stores only the most recent signal for each instrument';

-- Create function to update the latest_signals_per_instrument table
CREATE OR REPLACE FUNCTION update_latest_signals_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update the record in the latest_signals table
    INSERT INTO latest_signals_per_instrument
    SELECT * FROM all_signals
    WHERE instrument_name = NEW.instrument_name
    ORDER BY entry_time DESC
    LIMIT 1
    ON CONFLICT (instrument_name) 
    DO UPDATE SET
        client_trade_id = EXCLUDED.client_trade_id,
        trade_side = EXCLUDED.trade_side,
        entry_price = EXCLUDED.entry_price,
        entry_time = EXCLUDED.entry_time,
        exit_price = EXCLUDED.exit_price, 
        exit_time = EXCLUDED.exit_time,
        mae = EXCLUDED.mae,
        mfe = EXCLUDED.mfe,
        result_ticks = EXCLUDED.result_ticks,
        trade_duration = EXCLUDED.trade_duration,
        take_profit_price = EXCLUDED.take_profit_price,
        stop_loss_price = EXCLUDED.stop_loss_price,
        signal = EXCLUDED.signal,
        account_name = EXCLUDED.account_name,
        daily_pnl = EXCLUDED.daily_pnl;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update latest_signals_per_instrument when all_signals changes
CREATE TRIGGER trigger_update_latest_signals
AFTER INSERT OR UPDATE ON all_signals
FOR EACH ROW
EXECUTE FUNCTION update_latest_signals_trigger();

-- Initial population of the latest_signals_per_instrument table
TRUNCATE TABLE latest_signals_per_instrument;

WITH latest_per_instrument AS (
  SELECT DISTINCT ON (instrument_name) *
  FROM all_signals
  ORDER BY instrument_name, entry_time DESC
)
INSERT INTO latest_signals_per_instrument
SELECT * FROM latest_per_instrument;
