#region Using declarations
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using NinjaTrader.Cbi;
using NinjaTrader.Gui;
using NinjaTrader.Data;
using NinjaTrader.NinjaScript;
using NinjaTrader.NinjaScript.Indicators;
#endregion

namespace NinjaTrader.NinjaScript
{
    /// <summary>
    /// Converter class to provide a drop-down list of TimeZoneId.
    /// </summary>
    public class TimeZoneIdConverterSCALPERSNASDAQ : TypeConverter
    {
        public override bool GetStandardValuesSupported(ITypeDescriptorContext context) => true;
        public override bool GetStandardValuesExclusive(ITypeDescriptorContext context) => true;
        public override StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
        {
            var timeZones = new List<string>
            {
                "Israel Standard Time",
                "Eastern Standard Time",
                "Central Europe Standard Time",
                "Pacific Standard Time",
                "Tokyo Standard Time",
                "China Standard Time",
                "UTC",
                "India Standard Time"
            };
            return new StandardValuesCollection(timeZones);
        }
    }
}

#region StrategyNamespace
namespace NinjaTrader.NinjaScript.Strategies
{
    public class SCALPERSNASDAQ : Strategy
    {
        // ---------------------------------------------------------
        // Indicators & Variables
        // ---------------------------------------------------------
        private EMA EMA1;
        private EMA EMA2;
        private EMA EMA3;
        private EMA EMA4;
        private EMA EMA5;
        private CurrentDayOHL currentDayOHL;

        // ---------------------------------------------------------
        // SUPABASE INTEGRATION
        // ---------------------------------------------------------
        private HttpClient supabaseHttpClient;
        private string supabaseUrl    = "https://lcwpenbtlqwuxtlrdzbq.supabase.co";   // <--- Replace with your own
        private string supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjd3BlbmJ0bHF3dXh0bHJkemJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzOTYzNjUsImV4cCI6MjA1Mzk3MjM2NX0.o5AUKOFLfTC4WxUpen3SGne6gi_1XX1XDEzs7na5pe8"; // REPLACE WITH YOUR KEY
        private string supabaseTableName = "scalpersnasdaq_trades";                  // Our single table

        // We'll store the GUID of the *current* trade. If you do multiple
        // concurrent trades, use a dictionary keyed by the position.
        private Guid currentTradeId = Guid.Empty;

        // ---------------------------------------------------------
        // Trade Variables
        // ---------------------------------------------------------
        private int    lastClosedTradeCount = 0;
        private double entryPrice           = 0.0;  
        private double maxFavorable         = 0.0;  
        private double maxAdverse           = 0.0;  
        private DateTime entryTime;
        private bool   stopTrading          = false;
        private double ticksFromEntry       = 0;
        private string dernierTrade         = "Aucun Trade Proposé";

        // Flags for break-even (1..9)
        private bool breakEvenThreshold1Triggered = false;
        private bool breakEvenThreshold2Triggered = false;
        private bool breakEvenThreshold3Triggered = false;
        private bool breakEvenThreshold4Triggered = false;
        private bool breakEvenThreshold5Triggered = false;
        private bool breakEvenThreshold6Triggered = false;
        private bool breakEvenThreshold7Triggered = false;
        private bool breakEvenThreshold8Triggered = false;
        private bool breakEvenThreshold9Triggered = false;

        private bool oldTradingAllowed = false;

        // Pause management
        private enum PositionClosedType { None, Long, Short }
        private PositionClosedType lastClosedPosition = PositionClosedType.None;
        private int barsWaited  = 0;
        private bool isWaiting  = false;

        // ---------------------------------------------------------
        // Return adjusted TickSize depending on instrument
        // ---------------------------------------------------------
        private double GetAdjustedTickSize()
        {
            string instName = Instrument.MasterInstrument.Name.ToUpperInvariant();
            switch (instName)
            {
                case "FDAX": return 0.5;
                case "FGBL": return 0.01;
                case "FGBM": return 0.01;
                case "FGBS": return 0.005;
                case "FESX": return 1.0;
                case "ES":   return 0.25;
                case "NQ":   return 0.25;
                case "GC":   return 0.1;
                case "CL":   return 0.01;
                case "MNQ":  return 0.25;
                case "MGC":  return 0.1;
                case "MES":  return 0.25;
                case "FDXS": return 0.5;
                default:     return Instrument.MasterInstrument.TickSize;
            }
        }

        // ---------------------------------------------------------
        // Adjust stops by the selected TimeZone
        // ---------------------------------------------------------
        private void AdjustStopsByTimeZone()
        {
            TimeZoneInfo selectedTimeZone = TimeZoneInfo.FindSystemTimeZoneById(TimeZoneId);
            DateTime nowLocal = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, selectedTimeZone);

            TimeSpan nightStart  = new TimeSpan(22, 00, 25);
            TimeSpan nightEnd    = new TimeSpan(9, 00, 0);
            TimeSpan europeStart = new TimeSpan(9, 00, 25);
            TimeSpan europeEnd   = new TimeSpan(16, 25, 0);
            TimeSpan usStart     = new TimeSpan(16, 25, 59);
            TimeSpan usEnd       = new TimeSpan(22, 00, 20);

            Print($"[DEBUG] AdjustStopsByTimeZone() => local time: {nowLocal:HH:mm:ss}");

            if ((nowLocal.TimeOfDay >= nightStart) || (nowLocal.TimeOfDay < nightEnd))
            {
                Print("[DEBUG] => Night session factor applied.");
                AdjustStops(NightFactor);
                BarsToWaitAfterShortClose = 1;
                BarsToWaitAfterLongClose  = 1;
            }
            else if (nowLocal.TimeOfDay >= europeStart && nowLocal.TimeOfDay < europeEnd)
            {
                Print("[DEBUG] => Europe session factor applied.");
                AdjustStops(EuropeFactor);
                BarsToWaitAfterShortClose = 2;
                BarsToWaitAfterLongClose  = 2;
            }
            else if (nowLocal.TimeOfDay >= usStart && nowLocal.TimeOfDay <= usEnd)
            {
                Print("[DEBUG] => US session factor applied.");
                AdjustStops(UsFactor);
                BarsToWaitAfterShortClose = 3;
                BarsToWaitAfterLongClose  = 3;
            }
            else
            {
                Print("[DEBUG] => Outside known session times, no adjustments made.");
            }
        }

        private void AdjustStops(double factor)
        {
            Print($"[DEBUG] AdjustStops() => factor={factor}");
             BreakEvenThreshold1 = (int)(20 * factor);
            BreakEvenOffset1    = (int)(5  * factor);

            BreakEvenThreshold2 = (int)(30 * factor);
            BreakEvenOffset2    = (int)(18 * factor);

            BreakEvenThreshold3 = (int)(40 * factor);
            BreakEvenOffset3    = (int)(28 * factor);

            BreakEvenThreshold4 = (int)(50 * factor);
            BreakEvenOffset4    = (int)(35 * factor);

            BreakEvenThreshold5 = (int)(60 * factor);
            BreakEvenOffset5    = (int)(50 * factor);

            BreakEvenThreshold6 = (int)(70 * factor);
            BreakEvenOffset6    = (int)(60 * factor);

            BreakEvenThreshold7 = (int)(80 * factor);
            BreakEvenOffset7    = (int)(70 * factor);

            BreakEvenThreshold8 = (int)(90 * factor);
            BreakEvenOffset8    = (int)(80 * factor);

            BreakEvenThreshold9 = (int)(100 * factor);
            BreakEvenOffset9    = (int)(95 * factor);
        }

        // ---------------------------------------------------------
        // Check daily PnL for stopping
        // ---------------------------------------------------------
        private void CheckDailyStop()
        {
            double realizedPnL = SystemPerformance.AllTrades.TradesPerformance.Currency.CumProfit;
            Print($"[DEBUG] CheckDailyStop() => Current realizedPnL: {realizedPnL}, stopTrading={stopTrading}");

            if (stopTrading)
            {
                // If we are already stopping, flatten any open position if not flat
                if (Position.MarketPosition != MarketPosition.Flat)
                {
                    Print("[DEBUG] Already stopping => flatten open positions");
                    if (Position.MarketPosition == MarketPosition.Long)
                        ExitLong("ForceExit", "BuySignal");
                    else if (Position.MarketPosition == MarketPosition.Short)
                        ExitShort("ForceExit", "ShortSignal");
                }
                return;
            }

            // Stop if daily loss limit is hit
            if (realizedPnL <= -MaxDailyLoss)
            {
                stopTrading = true;
                Print($"[STOP TRADING] Daily loss reached: {realizedPnL:F2} <= -{MaxDailyLoss:F2}.");
            }
            // Stop if daily profit limit is hit
            else if (realizedPnL >= MaxDailyProfit)
            {
                stopTrading = true;
                Print($"[STOP TRADING] Daily profit reached: {realizedPnL:F2} >= {MaxDailyProfit:F2}.");
            }

            if (stopTrading && Position.MarketPosition != MarketPosition.Flat)
            {
                Print("[DEBUG] Flattening open position after daily stop triggered.");
                if (Position.MarketPosition == MarketPosition.Long)
                    ExitLong("ForceExit", "BuySignal");
                else if (Position.MarketPosition == MarketPosition.Short)
                    ExitShort("ForceExit", "ShortSignal");
            }
        }

        // ---------------------------------------------------------------------
        // OnPositionUpdate: detect Entry/Exit => call Supabase insertion/updates
        // ---------------------------------------------------------------------
        protected override void OnPositionUpdate(Position position, double averagePrice, int quantity, MarketPosition marketPosition)
        {
            base.OnPositionUpdate(position, averagePrice, quantity, marketPosition);

            // Debugging
            Print($"[OnPositionUpdate] marketPosition={marketPosition}, qty={quantity}, avgPrice={averagePrice}, entryPrice={entryPrice}");

            // ---------------------
            // 1. Detect new Entry
            // ---------------------
            if (position.Quantity > 0 && position.AveragePrice > 0 && entryPrice <= 0)
            {
                Print("[OnPositionUpdate] => Detected new entry (flat -> position).");
                entryPrice   = position.AveragePrice;
                maxFavorable = 0.0;
                maxAdverse   = 0.0;
                entryTime    = Time[0];

                // Generate a new client_trade_id for this trade
                currentTradeId = Guid.NewGuid();
                Print($"[OnPositionUpdate] => New trade GUID: {currentTradeId}");

                string sideString = (marketPosition == MarketPosition.Long) ? "Long" : "Short";

                // Kick off an async insert with partial data
                Task.Run(() => InsertTradeOpenToSupabase(
                    currentTradeId,
                    sideString,
                    position.Quantity,
                    entryPrice,
                    entryTime,
                    Name,
                    Account.Name,
                    Instrument.MasterInstrument.Name
                ));
            }

            // ---------------------
            // 2. Detect close
            // ---------------------
            if (position.MarketPosition == MarketPosition.Flat && SystemPerformance.AllTrades.Count > 0)
            {
                Print("[OnPositionUpdate] => position is flat, checking if a new trade was closed...");
                if (SystemPerformance.AllTrades.Count > lastClosedTradeCount)
                {
                    lastClosedTradeCount = SystemPerformance.AllTrades.Count;
                    Trade lastTrade = SystemPerformance.AllTrades[SystemPerformance.AllTrades.Count - 1];

                    if (lastTrade == null || lastTrade.Exit == null)
                    {
                        Print("[OnPositionUpdate] => lastTrade or lastTrade.Exit is null => skipping update.");
                        // Reset variables
                        entryPrice    = 0.0;
                        maxFavorable  = 0.0;
                        maxAdverse    = 0.0;
                        currentTradeId = Guid.Empty;
                        return;
                    }

                    // Some final trade details
                    MarketPosition side   = lastTrade.Entry.MarketPosition;
                    double totalTicks     = lastTrade.ProfitTicks;
                    DateTime exitTime     = lastTrade.Exit.Time;
                    TimeSpan tradeLength  = exitTime - entryTime;
                    string tradeDuration  = $"{tradeLength.Minutes}m {tradeLength.Seconds}s";

                    double mae = maxAdverse;
                    double mfe = maxFavorable;

                    // If you want the daily PnL up to this close:
                    double dailyPnL = SystemPerformance.AllTrades.TradesPerformance.Currency.CumProfit;

                    // Debug logging
                    Print($"[OnPositionUpdate] => DETECT EXIT => side={side}, totalTicks={totalTicks}, mae={mae}, mfe={mfe}");
                    Print($"[OnPositionUpdate] => About to update Supabase with tradeId={currentTradeId}.");

                    // ------------------------------------------
                    // KEY CHANGE: Ensure currentTradeId != Guid.Empty
                    // before attempting the PATCH
                    // ------------------------------------------
                      Guid localTradeId = currentTradeId;  // <--- Copy field
                    if (localTradeId != Guid.Empty)
                    {
                        Task.Run(() => UpdateTradeCloseToSupabase(
                            localTradeId,                // <--- Pass copy
                            lastTrade.Exit.Price,
                            exitTime,
                            mae,
                            mfe,
                            (int)totalTicks,
                            tradeDuration,
                            dailyPnL
                        ));
                    }
                    else
                    {
                        Print("[OnPositionUpdate] => currentTradeId is Guid.Empty, skipping Supabase update.");
                    }

                    // housekeeping
                     lastClosedPosition = (side == MarketPosition.Short) ? PositionClosedType.Short : PositionClosedType.Long;
                    isWaiting          = true;
                    barsWaited         = 0;
                    entryPrice         = 0.0;
                    maxFavorable       = 0.0;
                    maxAdverse         = 0.0;
                    currentTradeId     = Guid.Empty;  // <--- Now it's safe
                }
            }
        }

        // ---------------------------------------------------------
        // OnBarUpdate: main strategy logic
        // ---------------------------------------------------------
        protected override void OnBarUpdate()
        {
            // Log on each bar for debugging
            Print($"[OnBarUpdate] CurrentBar={CurrentBar}, Position={Position.MarketPosition}, isWaiting={isWaiting}, stopTrading={stopTrading}");

            if (BarsInProgress != 0 || CurrentBars[0] < 1)
                return;

            AdjustStopsByTimeZone();
            CheckDailyStop();

            if (stopTrading)
            {
                Print("[TRADING BLOCKED] Daily limit has been reached. No further trades.");
                return;
            }

            TimeZoneInfo selectedTimeZone = TimeZoneInfo.FindSystemTimeZoneById(TimeZoneId);
            DateTime nowLocal = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, selectedTimeZone);

            bool inFirstTimeRange  = (nowLocal.TimeOfDay >= HeureDebut && nowLocal.TimeOfDay <= HeureFin);
            bool inSecondTimeRange = (nowLocal.TimeOfDay >= HeureDebut2 && nowLocal.TimeOfDay <= HeureFin2);
            bool isTradingAllowed  = inFirstTimeRange || inSecondTimeRange;

            if (isTradingAllowed && !oldTradingAllowed)
            {
                oldTradingAllowed = true;
                Print("[DEBUG] => Trading window just opened.");
            }
            else if (!isTradingAllowed && oldTradingAllowed)
            {
                oldTradingAllowed = false;
                Print("[DEBUG] => Trading window just closed.");
            }

            // If not in trading window, return early
            if (!isTradingAllowed)
            {
                Print("[DEBUG] => Not in trading window => skip signals.");
                return;
            }

            // ----------------------------------------------------
            // Pause management
            // ----------------------------------------------------
            if (isWaiting)
            {
                bool conditionMet = false;
                if (lastClosedPosition == PositionClosedType.Short)
                {
                    // Example condition: Wait for close to be rising
                    if (Close[0] > Close[1])
                        conditionMet = true;
                }
                else if (lastClosedPosition == PositionClosedType.Long)
                {
                    // Example condition: Wait for close to be falling
                    if (Close[0] < Close[1])
                        conditionMet = true;
                }

                if (conditionMet)
                {
                    barsWaited++;
                    Print($"[PAUSE] => conditionMet. Bar {barsWaited}/{GetBarsToWait()}");
                    if (barsWaited >= GetBarsToWait())
                    {
                        isWaiting          = false;
                        lastClosedPosition = PositionClosedType.None;
                        barsWaited         = 0;
                        Print("[PAUSE] => End of waiting period. Trades allowed again.");
                        // Fall through to normal logic
                    }
                    else
                    {
                        return; // still waiting
                    }
                }
                else
                {
                    barsWaited = 0;
                    Print("[PAUSE] => condition not met => reset bar count to 0, keep waiting.");
                    return;
                }
            }

            // ----------------------------------------------------
            // Track ticks from entry
            // ----------------------------------------------------
            double myTickSize = GetAdjustedTickSize();
            if (Position.MarketPosition == MarketPosition.Long && Position.Quantity > 0)
                ticksFromEntry = (Close[0] - Position.AveragePrice) / myTickSize;
            else if (Position.MarketPosition == MarketPosition.Short && Position.Quantity > 0)
                ticksFromEntry = (Position.AveragePrice - Close[0]) / myTickSize;
            else
                ticksFromEntry = 0;

            // ----------------------------------------------------
            // Example exit signals (just for demonstration)
            // ----------------------------------------------------
            if (Position.MarketPosition == MarketPosition.Long)
            {
                if (CrossBelow(EMA4, EMA5, 1))
                {
                    Print("[OnBarUpdate] => Exit signal LONG => CrossBelow(EMA4, EMA5).");
                    ExitLong(Position.Quantity, "EXITLONG", "");
                }
            }
            else if (Position.MarketPosition == MarketPosition.Short)
            {
                if (CrossAbove(EMA4, EMA5, 1))
                {
                    Print("[OnBarUpdate] => Exit signal SHORT => CrossAbove(EMA4, EMA5).");
                    ExitShort(Position.Quantity, "EXITSHORT", "");
                }
            }

            // ----------------------------------------------------
            // Potential Long Entry (example)
            // ----------------------------------------------------
            if (Position.MarketPosition == MarketPosition.Flat && State == State.Realtime)
            {
                if (Close[1] < Close[0]
                  // && Close[0] > EMA1[0]
                 //  && EMA1[1] < EMA1[0]
                 //  && Close[0] > EMA2[0]
                  // && EMA1[0] <= EMA3[0]
                  // && Close[1] > High[2]
                   && Close[0] > High[1])
                {
                    double sessionOpen = currentDayOHL.CurrentOpen[0];
                    double sessionHigh = currentDayOHL.CurrentHigh[0];
                    if (Close[0] > sessionOpen && Close[0] < sessionHigh)
                    {
                        dernierTrade = $"Signal Buy | {Instrument.FullName} | Prix Entrée : {Close[0]}";
                        Print($"[OnBarUpdate] => Potential LONG => {dernierTrade}, ActiverPassageOrdre={ActiverPassageOrdre}");
                        if (ActiverPassageOrdre)
                        {
                            EnterLong(NB_DE_LOT, $"BuySignal{CurrentBar}");
                            SetStopLoss(CalculationMode.Ticks, STOP_LOSS);
                            SetProfitTarget(CalculationMode.Ticks, ProfitTarget);
                        }
                    }
                }
            }

            // ----------------------------------------------------
            // Potential Short Entry (example)
            // ----------------------------------------------------
            if (Position.MarketPosition == MarketPosition.Flat && State == State.Realtime)
            {
                if (Close[1] > Close[0]
                 //  && Close[0] < EMA1[0]
                //   && EMA1[1] > EMA1[0]
                //   && Close[0] < EMA3[0]
               //    && EMA1[0] >= EMA2[0]
               //    && Close[1] < Low[2]
                  && Close[0] < Low[1])
                {
                    double sessionLow  = currentDayOHL.CurrentLow[0];
                    double sessionOpen = currentDayOHL.CurrentOpen[0];
                    if (Close[0] > sessionLow && Close[0] < sessionOpen)
                    {
                        dernierTrade = $"Signal Short | {Instrument.FullName} | Prix d'entrée : {Close[0]}";
                        Print($"[OnBarUpdate] => Potential SHORT => {dernierTrade}, ActiverPassageOrdre={ActiverPassageOrdre}");
                        if (ActiverPassageOrdre)
                        {
                            EnterShort(NB_DE_LOT, $"ShortSignal{CurrentBar}");
                            SetStopLoss(CalculationMode.Ticks, STOP_LOSS);
                            SetProfitTarget(CalculationMode.Ticks, ProfitTarget);
                        }
                    }
                }
            }

            // ----------------------------------------------------
            // BreakEven logic (paliers)
            // ----------------------------------------------------
            if (ActiverPassageOrdre && State == State.Realtime && Position.MarketPosition != MarketPosition.Flat && Position.Quantity > 0)
            {
                // Just an example for threshold 9
                if (!breakEvenThreshold9Triggered && ticksFromEntry >= BreakEvenThreshold9)
                {
                    breakEvenThreshold9Triggered = true;
                    Print($"[OnBarUpdate] => BreakEven threshold 9 triggered => ticksFromEntry={ticksFromEntry}");
                    // Lock in all prior thresholds
                    breakEvenThreshold1Triggered = true;
                    breakEvenThreshold2Triggered = true;
                    breakEvenThreshold3Triggered = true;
                    breakEvenThreshold4Triggered = true;
                    breakEvenThreshold5Triggered = true;
                    breakEvenThreshold6Triggered = true;
                    breakEvenThreshold7Triggered = true;
                    breakEvenThreshold8Triggered = true;

                    double newStopPrice = 0.0;
                    if (Position.MarketPosition == MarketPosition.Long)
                    {
                        newStopPrice = Position.AveragePrice + BreakEvenOffset9 * myTickSize;
                        if (newStopPrice < Close[0])
                        {
                            Print($"[OnBarUpdate] => Setting STOP LONG to {newStopPrice}");
                            SetStopLoss(CalculationMode.Price, newStopPrice);
                        }
                    }
                    else
                    {
                        newStopPrice = Position.AveragePrice - BreakEvenOffset9 * myTickSize;
                        if (newStopPrice > Close[0])
                        {
                            Print($"[OnBarUpdate] => Setting STOP SHORT to {newStopPrice}");
                            SetStopLoss(CalculationMode.Price, newStopPrice);
                        }
                    }
                }
            }

            // ----------------------------------------------------
            // Update MFE/MAE
            // ----------------------------------------------------
            if (Position.MarketPosition != MarketPosition.Flat && entryPrice > 0)
            {
                double adjustedTick = GetAdjustedTickSize();
                if (Position.MarketPosition == MarketPosition.Long)
                {
                    double distanceUpTicks   = (High[0] - entryPrice) / adjustedTick;
                    double distanceDownTicks = (entryPrice - Low[0])   / adjustedTick;
                    if (distanceUpTicks > maxFavorable)
                        maxFavorable = distanceUpTicks;
                    if (distanceDownTicks > maxAdverse)
                        maxAdverse = distanceDownTicks;
                }
                else if (Position.MarketPosition == MarketPosition.Short)
                {
                    double distFavorableShort = (entryPrice - Low[0])  / adjustedTick;
                    double distAdverseShort   = (High[0] - entryPrice) / adjustedTick;
                    if (distFavorableShort > maxFavorable)
                        maxFavorable = distFavorableShort;
                    if (distAdverseShort > maxAdverse)
                        maxAdverse = distAdverseShort;
                }
            }
        }

        // ---------------------------------------------------------
        // InsertTradeOpenToSupabase:
        // ---------------------------------------------------------
        private async Task InsertTradeOpenToSupabase(
            Guid tradeId,
            string side,
            int quantity,
            double entryPrice,
            DateTime entryTime,
            string strategyName,
            string accountName,
            string instrumentName)
        {
            try
            {
                string jsonPayload = $@"[ {{
  ""client_trade_id"": ""{tradeId}"",
  ""strategy_name"": ""{Escape(strategyName)}"",
  ""account_name"": ""{Escape(accountName)}"",
  ""instrument_name"": ""{Escape(instrumentName)}"",
  ""trade_side"": ""{Escape(side)}"",
  ""quantity"": {quantity},
  ""entry_price"": {entryPrice},
  ""entry_time"": ""{entryTime:O}""
}} ]";

                string url = $"{supabaseUrl}/rest/v1/{supabaseTableName}";
                Print($"[InsertTradeOpenToSupabase] POST => {url}\nPayload:\n{jsonPayload}");

                HttpContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await supabaseHttpClient.PostAsync(url, content);

                string respContent = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                {
                    Print($"[ERROR] InsertTradeOpenToSupabase: {response.StatusCode} => {respContent}");
                }
                else
                {
                    Print($"[INFO] InsertTradeOpenToSupabase => success! Response => {respContent}");
                }
            }
            catch (Exception ex)
            {
                Print($"[EXCEPTION] InsertTradeOpenToSupabase: {ex.Message}");
            }
        }

        // ---------------------------------------------------------
        // UpdateTradeCloseToSupabase:
        // ---------------------------------------------------------
        private async Task UpdateTradeCloseToSupabase(
            Guid tradeId,
            double exitPrice,
            DateTime exitTime,
            double mae,
            double mfe,
            int resultTicks,
            string tradeDuration,
            double dailyPnL)
        {
            try
            {
                string jsonPayload = $@"[ {{
  ""exit_price"": {exitPrice},
  ""exit_time"": ""{exitTime:O}"",
  ""mae"": {mae},
  ""mfe"": {mfe},
  ""result_ticks"": {resultTicks},
  ""trade_duration"": ""{Escape(tradeDuration)}"",
  ""daily_pnl"": {dailyPnL}
}} ]";

                // Make sure we URL-escape the GUID
                string filterGuid = Uri.EscapeDataString(tradeId.ToString());
                string url = $"{supabaseUrl}/rest/v1/{supabaseTableName}?client_trade_id=eq.{filterGuid}";

                // Debug
                Print($"[UpdateTradeCloseToSupabase] PATCH => {url}\nPayload:\n{jsonPayload}");

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), url)
                {
                    Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
                };
                request.Headers.Add("Prefer", "resolution=merge-duplicates");
                request.Headers.Add("Prefer", "return=representation");

                HttpResponseMessage response = await supabaseHttpClient.SendAsync(request);
                string respBody = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Print($"[ERROR] UpdateTradeCloseToSupabase: {response.StatusCode} => {respBody}");
                }
                else
                {
                    Print($"[INFO] UpdateTradeCloseToSupabase => success. Body => {respBody}");
                }
            }
            catch (Exception ex)
            {
                Print($"[EXCEPTION] UpdateTradeCloseToSupabase: {ex.Message}");
            }
        }

        // Basic string safe-escape for quotes/backslashes
        private string Escape(string input)
        {
            if (input == null) return "";
            return input
                .Replace("\\", "\\\\")
                .Replace("\"", "\\\"");
        }

        private int GetBarsToWait()
        {
            if (lastClosedPosition == PositionClosedType.Short)
                return BarsToWaitAfterShortClose;
            else if (lastClosedPosition == PositionClosedType.Long)
                return BarsToWaitAfterLongClose;
            else
                return 0;
        }

        // ---------------------------------------------------------
        // OnStateChange
        // ---------------------------------------------------------
        protected override void OnStateChange()
        {
            if (State == State.SetDefaults)
            {
                #region Strategy defaults
                Description  = "A system to place orders quickly in volatile markets (no chart display).";
                Name         = "SCALPERSNASDAQ_LogicOnly";
                Calculate    = Calculate.OnBarClose;
                EntriesPerDirection                  = 1;
                IsExitOnSessionCloseStrategy         = true;
                ExitOnSessionCloseSeconds            = 30;
                IsFillLimitOnTouch                   = false;
                MaximumBarsLookBack                  = MaximumBarsLookBack.TwoHundredFiftySix;
                OrderFillResolution                  = OrderFillResolution.Standard;
                Slippage                             = 0;
                StartBehavior                        = StartBehavior.WaitUntilFlat;
                TimeInForce                          = TimeInForce.Day;
                TraceOrders                          = false;
                RealtimeErrorHandling                = RealtimeErrorHandling.StopCancelClose;
                StopTargetHandling                   = StopTargetHandling.PerEntryExecution;
                BarsRequiredToTrade                  = 20;
                IsInstantiatedOnEachOptimizationIteration = true;
                #endregion

                #region Default parameter values
                EMA_LENGTH       = 20;
                EMA_VALIDATION   = 50;
                EMALOW           = 8;
                EMAFAST          = 2;
                NB_DE_LOT        = 1;
                STOP_LOSS        = 25;
                ProfitTarget     = 100;
                ActiverPassageOrdre = true;

                HeureDebut  = new TimeSpan(1, 30, 0);
                HeureFin    = new TimeSpan(12, 25, 0);
                HeureDebut2 = new TimeSpan(17, 35, 0);
                HeureFin2   = new TimeSpan(23, 30, 0);

                NightFactor      = 0.7;
                EuropeFactor     = 0.8;
                UsFactor         = 1.0;
                MaxDailyLoss     = 5350;
                MaxDailyProfit   = 5800;

               BreakEvenThreshold1 = 20;
                BreakEvenOffset1    = 5;

                BreakEvenThreshold2 = 30;
                BreakEvenOffset2    = 18;

                BreakEvenThreshold3 = 40;
                BreakEvenOffset3    = 28;

                BreakEvenThreshold4 = 50;
                BreakEvenOffset4    = 35;

                BreakEvenThreshold5 = 60;
                BreakEvenOffset5    = 50;

                BreakEvenThreshold6 = 70;
                BreakEvenOffset6    = 60;

                BreakEvenThreshold7 = 80;
                BreakEvenOffset7    = 70;

                BreakEvenThreshold8 = 90;
                BreakEvenOffset8    = 80;

                BreakEvenThreshold9 = 100;
                BreakEvenOffset9    = 95;

                TimeZoneId        = "Israel Standard Time";
                TimeDisplayFormat = "HH:mm:ss";

                BarsToWaitAfterShortClose = 2;
                BarsToWaitAfterLongClose  = 2;
                #endregion
            }
            else if (State == State.Configure)
            {
                Print("[OnStateChange] => State.Configure => Initializing Supabase HttpClient...");
                supabaseHttpClient = new HttpClient();
                supabaseHttpClient.DefaultRequestHeaders.Add("apikey",       supabaseApiKey);
                supabaseHttpClient.DefaultRequestHeaders.Add("Authorization", supabaseApiKey);
            }
            else if (State == State.DataLoaded)
            {
                Print("[OnStateChange] => State.DataLoaded => Creating indicators...");
                EMA1 = EMA(Close,  EMA_VALIDATION);
                EMA2 = EMA(High,   EMA_LENGTH);
                EMA3 = EMA(Low,    EMA_LENGTH);
                EMA4 = EMA(Close,  EMAFAST);
                EMA5 = EMA(Close,  EMALOW);
                currentDayOHL = CurrentDayOHL();
            }
            else if (State == State.Historical)
            {
                if (!Bars.BarsType.IsIntraday)
                {
                    Log("L'indicateur CurrentDayOHL nécessite des données intrajournalières.", LogLevel.Error);
                }
                Print("[OnStateChange] => State.Historical => Done loading historical data.");
            }
            else if (State == State.Realtime)
            {
                Print("[OnStateChange] => State.Realtime => Now running in real-time.");
            }
            else if (State == State.Terminated)
            {
                Print("[OnStateChange] => State.Terminated => Disposing supabaseHttpClient.");
                supabaseHttpClient?.Dispose();
            }
        }

        #region Properties

        [NinjaScriptProperty]
        [TypeConverter(typeof(TimeZoneIdConverterSCALPERSNASDAQ))]
        [PropertyEditor("NinjaTrader.Gui.Tools.StringStandardValuesEditor")]
        [Display(Name="TimeZoneId", Description="Time Zone ID", Order=1, GroupName="1. General Parameters")]
        public string TimeZoneId { get; set; }

        [NinjaScriptProperty]
        [Display(Name="TimeDisplayFormat", Description="Format de l'heure (e.g. HH:mm:ss)", Order=2, GroupName="1. General Parameters")]
        public string TimeDisplayFormat { get; set; }

        [NinjaScriptProperty]
        [Display(Name="ActiverPassageOrdre", Description="Activer ou désactiver le passage d'ordre", Order=3, GroupName="1. General Parameters")]
        public bool ActiverPassageOrdre { get; set; }

        [NinjaScriptProperty]
        [Display(Name="HeureDebut", Description="Heure de début (1ère plage)", Order=1, GroupName="2. Session Timings")]
        public TimeSpan HeureDebut { get; set; }

        [NinjaScriptProperty]
        [Display(Name="HeureFin", Description="Heure de fin (1ère plage)", Order=2, GroupName="2. Session Timings")]
        public TimeSpan HeureFin { get; set; }

        [NinjaScriptProperty]
        [Display(Name="HeureDebut2", Description="Heure de début (2ème plage)", Order=3, GroupName="2. Session Timings")]
        public TimeSpan HeureDebut2 { get; set; }

        [NinjaScriptProperty]
        [Display(Name="HeureFin2", Description="Heure de fin (2ème plage)", Order=4, GroupName="2. Session Timings")]
        public TimeSpan HeureFin2 { get; set; }

        [NinjaScriptProperty]
        [Range(50, int.MaxValue)]
        [Display(Name="EMA_VALIDATION", Description="Longueur EMA Validation", Order=1, GroupName="3. EMA Settings")]
        public int EMA_VALIDATION { get; set; }

        [NinjaScriptProperty]
        [Range(20, int.MaxValue)]
        [Display(Name="EMA_LENGTH", Description="Longueur de la EMA", Order=2, GroupName="3. EMA Settings")]
        public int EMA_LENGTH { get; set; }

        [NinjaScriptProperty]
        [Range(3, int.MaxValue)]
        [Display(Name="EMALOW", Description="EMA Low exit", Order=3, GroupName="3. EMA Settings")]
        public int EMALOW { get; set; }

        [NinjaScriptProperty]
        [Range(2, int.MaxValue)]
        [Display(Name="EMAFAST", Description="EMA Fast exit", Order=4, GroupName="3. EMA Settings")]
        public int EMAFAST { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="NB_DE_LOT", Description="Nombre de lot", Order=1, GroupName="4. Trade Management")]
        public int NB_DE_LOT { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="STOP_LOSS", Description="Stop loss en ticks", Order=2, GroupName="4. Trade Management")]
        public int STOP_LOSS { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="ProfitTarget", Description="Profit target en ticks", Order=3, GroupName="4. Trade Management")]
        public int ProfitTarget { get; set; }

        [NinjaScriptProperty]
        [Range(1, double.MaxValue)]
        [Display(Name="MaxDailyLoss", Description="Stop Strategy if daily loss is reached", Order=1, GroupName="5. Daily Stop")]
        public double MaxDailyLoss { get; set; }

        [NinjaScriptProperty]
        [Range(1, double.MaxValue)]
        [Display(Name="MaxDailyProfit", Description="Stop Strategy if daily profit is reached", Order=2, GroupName="5. Daily Stop")]
        public double MaxDailyProfit { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold1", Description="Premier palier (en ticks)", Order=1, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold1 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset1", Description="Offset du stop (palier 1)", Order=2, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset1 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold2", Description="Deuxième palier (en ticks)", Order=3, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold2 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset2", Description="Offset du stop (palier 2)", Order=4, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset2 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold3", Description="Troisième palier (en ticks)", Order=5, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold3 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset3", Description="Offset du stop (palier 3)", Order=6, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset3 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold4", Description="Quatrième palier (en ticks)", Order=7, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold4 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset4", Description="Offset du stop (palier 4)", Order=8, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset4 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold5", Description="Cinquième palier (en ticks)", Order=9, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold5 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset5", Description="Offset du stop (palier 5)", Order=10, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset5 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold6", Description="Sixième palier (en ticks)", Order=11, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold6 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset6", Description="Offset du stop (palier 6)", Order=12, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset6 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold7", Description="Septième palier (en ticks)", Order=13, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold7 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset7", Description="Offset du stop (palier 7)", Order=14, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset7 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold8", Description="Huitième palier (en ticks)", Order=15, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold8 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset8", Description="Offset du stop (palier 8)", Order=16, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset8 { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BreakEvenThreshold9", Description="Neuvième palier (en ticks)", Order=17, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenThreshold9 { get; set; }

        [NinjaScriptProperty]
        [Range(0, int.MaxValue)]
        [Display(Name="BreakEvenOffset9", Description="Offset du stop (palier 9)", Order=18, GroupName="6. BreakEven & Paliers")]
        public int BreakEvenOffset9 { get; set; }

        [NinjaScriptProperty]
        [Range(0.1, double.MaxValue)]
        [Display(Name="NightFactor", Description="Facteur de Stop pour la session de nuit", Order=1, GroupName="7. Factor by Session")]
        public double NightFactor { get; set; }

        [NinjaScriptProperty]
        [Range(0.1, double.MaxValue)]
        [Display(Name="EuropeFactor", Description="Facteur de Stop pour la session Europe", Order=2, GroupName="7. Factor by Session")]
        public double EuropeFactor { get; set; }

        [NinjaScriptProperty]
        [Range(0.1, double.MaxValue)]
        [Display(Name="UsFactor", Description="Facteur de Stop pour la session US", Order=3, GroupName="7. Factor by Session")]
        public double UsFactor { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BarsToWaitAfterShortClose", Description="Nombre de bougies à attendre après la clôture short", Order=1, GroupName="8. Pause Management")]
        public int BarsToWaitAfterShortClose { get; set; }

        [NinjaScriptProperty]
        [Range(1, int.MaxValue)]
        [Display(Name="BarsToWaitAfterLongClose", Description="Nombre de bougies à attendre après la clôture long", Order=2, GroupName="8. Pause Management")]
        public int BarsToWaitAfterLongClose { get; set; }

        #endregion
    }
}
#endregion