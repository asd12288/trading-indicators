import supabase from "@/utils/supabase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


interface Instrument {
  instrument: string;
  orderTime: string;
  [key: string]: any;
}

export const getLatestByInstrument = async () => {
  const { data: rows, error } = await supabase
    .from("indicators_order_start")
    .select("*");

  if (error || !rows) {
    throw new Error("Error loading signals");
  }

  // First get latest by instrument
  const latestByInstrument = rows.reduce(
    (acc: { [key: string]: Instrument }, row: Instrument) => {
      const current = acc[row.instrument];
      if (
        !current ||
        new Date(row.orderTime).getTime() >
          new Date(current.orderTime).getTime()
      ) {
        acc[row.instrument] = row;
      }
      return acc;
    },
    {},
  );

  // Then filter for specific instruments
  const filteredInstruments = Object.values(latestByInstrument).filter(
    (instrument) => ["NASDAX", "DAX", "S&P500"].includes(instrument.instrument),
  );

  return {
    all: latestByInstrument,
    filtered: filteredInstruments,
  };
};
