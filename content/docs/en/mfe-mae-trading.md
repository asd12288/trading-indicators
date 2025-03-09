---
title: MFE/MAE Trading Strategy
description: Maximize profits with Maximum Favorable Excursion and Maximum Adverse Excursion analysis
---

# MFE/MAE Trading Strategy 📊

Understanding Maximum Favorable Excursion (MFE) and Maximum Adverse Excursion (MAE) can transform your trading approach and help you optimize your entry and exit points.

## What is MFE/MAE Analysis?

**Maximum Favorable Excursion (MFE)** measures the maximum profit potential of a trade - how far the price moved in your favor before you exited.

**Maximum Adverse Excursion (MAE)** measures the maximum drawdown during a trade - how far the price moved against you before you exited.

## Why MFE/MAE Analysis Matters

By analyzing these metrics across your trading history, you can:

1. **Optimize Stop Loss Placement**: Determine statistically optimal stop loss levels based on typical price behavior
2. **Improve Profit Targets**: Set realistic profit targets based on historical price movements
3. **Identify Strategy Weaknesses**: Discover if you're consistently missing profit potential or taking excessive risk
4. **Refine Entry Criteria**: Improve your entry timing to minimize initial drawdowns

## The Trader Map Approach

Our platform automatically calculates MFE and MAE for all your trades and provides visual analysis tools:

### MFE/MAE Scatterplot

This visualization plots your trades showing the relationship between:
- How much each trade moved against you (MAE)
- How much each trade moved in your favor (MFE)
- Whether the trade was ultimately profitable

### R-Multiple Distribution

This analysis converts your MFE/MAE data into R-multiples (where 1R equals your initial risk) to standardize the analysis across different instruments and position sizes.

## Implementing an MFE/MAE Strategy

### Step 1: Establish Your Baseline

Review at least 30-50 trades to identify your current patterns:
- What's your typical MAE before a profitable trade?
- What's your average MFE on winning trades?
- What's your MAE to MFE ratio?

### Step 2: Optimize Stop Placement

Use your MAE analysis to ensure your stops are beyond normal market noise but still respect your risk tolerance.

### Step 3: Set Better Profit Targets

Use your MFE analysis to set profit targets that capture a reasonable portion of typical price movements.

### Step 4: Develop Trading Rules

Create specific rules for your trading system based on your findings, such as:
- Adding to positions when price has moved in your favor by a specific amount
- Partial profit-taking at statistically significant levels
- Moving stops to breakeven after price reaches certain MFE thresholds

## Case Study: EUR/USD Scalping Strategy

A trader used MFE/MAE analysis on 100 EUR/USD scalping trades and found:
- 90% of winning trades had an initial MAE of less than 5 pips
- Winning trades typically reached 12-15 pips MFE before retracing
- Trades with MAE > 7 pips rarely became profitable

This led to a refined strategy with stops at 6 pips, targets at 12 pips, and a transition to breakeven after 8 pips in profit.

## Using Trader Map for MFE/MAE Analysis

Our platform provides:
1. **Automated Tracking**: All trades are automatically analyzed for MFE/MAE
2. **Visual Analytics**: Interactive charts showing your MFE/MAE distribution
3. **Custom Reports**: Generate detailed reports filtered by instrument, timeframe, or strategy
4. **Trade Playback**: Review how price moved during your trades to identify patterns

## Next Steps

Start analyzing your own trades with our [MFE/MAE Dashboard](/dashboard/mfe-mae) or learn about our [Trade Simulator](/docs/trade-simulator) for practicing your new strategies.
