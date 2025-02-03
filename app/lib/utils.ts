import supabase from "@/utils/supabase";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLatestByInstrument = async () => {
  const { data: rows, error } = await supabase
    .from("indicators_order_start")
    .select("*");

  if (error || !rows) {
    throw new Error("Error loading signals");
    console.log("Error loading signals");
  }

  return rows.reduce(
    (
      acc: { [key: string]: { instrument: string; orderTime: string } },
      row: any,
    ) => {
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
    {} as { [key: string]: { instrument: string; orderTime: string } },
  );
};
