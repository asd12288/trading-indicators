import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A";

  // Convert to string to check decimal places
  const numStr = num.toString();

  // If it has decimal places, preserve them all (up to 10)
  const decimalPlaces = numStr.includes(".")
    ? Math.min(numStr.split(".")[1].length, 10)
    : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: Math.max(decimalPlaces, 2), // At least 2, up to the actual number
  }).format(num);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
