/**
 * Trade Events Bridge
 * 
 * This file serves as a bridge between the C# trading strategy code and the JavaScript frontend.
 * It exposes methods that can be called from C# code to trigger notifications in the browser.
 */

import { tradeNotificationManager } from "../managers/trade-notification-manager";

// Global object that will be accessible from C# via window object
window.TradeEventsBridge = {
  /**
   * Called when a new trade is started
   * @param {string} instrumentName - The instrument being traded
   * @param {string} tradeSide - Direction of the trade (LONG/SHORT)
   * @param {number} entryPrice - Entry price
   */
  onTradeStart: (instrumentName, tradeSide, entryPrice) => {
    console.log(`[TradeEventsBridge] Trade started: ${instrumentName} ${tradeSide} at ${entryPrice}`);
    tradeNotificationManager.notifyTradeStarted(instrumentName, tradeSide, entryPrice);
  },

  /**
   * Called when a trade is completed/closed
   * @param {string} instrumentName - The instrument that was traded
   * @param {string} tradeSide - Direction of the trade (LONG/SHORT)
   * @param {number} exitPrice - Exit price
   * @param {number} profitLoss - P/L in ticks 
   */
  onTradeEnd: (instrumentName, tradeSide, exitPrice, profitLoss) => {
    console.log(`[TradeEventsBridge] Trade ended: ${instrumentName} ${tradeSide} at ${exitPrice} (P/L: ${profitLoss})`);
    tradeNotificationManager.notifyTradeEnded(instrumentName, tradeSide, exitPrice, profitLoss);
  },

  /**
   * Called when a stop-loss or take-profit level is adjusted 
   * @param {string} instrumentName - The instrument being traded
   * @param {string} tradeSide - Direction of the trade (LONG/SHORT)
   * @param {boolean} isStopLoss - Whether this is a stop-loss (true) or take-profit (false) change
   * @param {number} newValue - The new price level
   */
  onTargetStopChange: (instrumentName, tradeSide, isStopLoss, newValue) => {
    console.log(`[TradeEventsBridge] ${isStopLoss ? 'Stop-loss' : 'Take-profit'} changed for ${instrumentName}: new value = ${newValue}`);
    tradeNotificationManager.notifyTargetStopChanged(instrumentName, tradeSide, isStopLoss, newValue);
  }
};

export default window.TradeEventsBridge;