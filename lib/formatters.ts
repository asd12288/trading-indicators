/**
 * Format numbers with compact notation for better readability
 * @param value Number to format
 * @param digits Number of decimal places
 * @returns Formatted string
 */
export function formatNumber(value: number, digits = 2): string {
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: digits,
  });

  return formatter.format(value);
}

/**
 * Format currency values
 * @param value Number to format as currency
 * @param currency Currency code (USD, EUR, etc)
 * @returns Formatted string
 */
export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Format percentage values
 * @param value Number to format as percentage
 * @param digits Number of decimal places
 * @returns Formatted string
 */
export function formatPercent(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}
