"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "../ui/select";
import supabaseClient from "@/database/supabase/client";
import { toast } from "@/hooks/use-toast";

// Helper to convert "YYYY-MM-DD HH:mm:ss+00" to "YYYY-MM-DDTHH:mm:ss"
function convertDbTime(dbTime) {
  if (!dbTime) return "";
  // Split date/time from timezone offset, then replace space with T.
  const [dateTime] = dbTime.split("+");
  return dateTime.replace(" ", "T");
}

const formSchema = z.object({
  instrument_name: z.string(),
  trade_side: z.string(),
  entry_price: z.preprocess((val) => Number(val), z.number()),
  entry_time: z.string(),
  exit_price: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable(),
  ),
  exit_time: z.string().nullable(),
  mae: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable(),
  ),
  mfe: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable(),
  ),
  result_ticks: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.number().nullable(),
  ),
  trade_duration: z.string().nullable(),
  take_profit_price: z.preprocess((val) => Number(val), z.number()),
  stop_loss_price: z.preprocess((val) => Number(val), z.number()),
});

const EditSignalFrom = ({ data, signalId, onFinish }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      entry_time: convertDbTime(data.entry_time),
      exit_time: data.exit_time ? convertDbTime(data.exit_time) : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabaseClient
      .from("all_signals")
      .update(values)
      .eq("client_trade_id", signalId);

    if (error) {
      console.error(error);
    }

    toast({
      title: "Signal Updated",
      description: "Signal has been updated successfully",
    });
    if (onFinish) onFinish();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-[800px] grid-cols-3 gap-8"
      >
        <FormField
          control={form.control}
          name="instrument_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signal Name</FormLabel>
              <FormControl>
                <Input placeholder="Signal Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trade_side"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Side</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select trade side" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700">
                    <SelectItem className="cursor-pointer" value="Long">
                      Long
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="Short">
                      Short
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entry_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Price</FormLabel>
              <FormControl>
                <Input placeholder="Entry Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="entry_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entry Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="Entry Time"
                  {...field}
                  type="datetime-local"
                  step="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exit Price</FormLabel>
              <FormControl>
                <Input placeholder="Exit Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exit_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exit Time</FormLabel>
              <FormControl>
                <Input
                  placeholder="Exit Time"
                  {...field}
                  type="datetime-local"
                  step="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mae"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MAE</FormLabel>
              <FormControl>
                <Input placeholder="MAE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mfe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MFE</FormLabel>
              <FormControl>
                <Input placeholder="MFE" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="result_ticks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Result Ticks</FormLabel>
              <FormControl>
                <Input placeholder="Result Ticks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trade_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trade Duration</FormLabel>
              <FormControl>
                <Input placeholder="Trade Duration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="take_profit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Take Profit Price</FormLabel>
              <FormControl>
                <Input placeholder="Take Profit Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stop_loss_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stop Loss Price</FormLabel>
              <FormControl>
                <Input placeholder="Stop Loss Price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EditSignalFrom;
