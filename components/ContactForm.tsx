"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { useTranslations } from "next-intl";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  message: z.string().nonempty(),
  title: z.string().nonempty(),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      title: "",
    },
  });

  const t = useTranslations("HomePage.contactForm");

  const [success, setSuccess] = useState(false);
  const [loading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/email/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong sending the email");
      }
      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      setSuccess(false);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }

    // email logic here

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto space-y-5 rounded-lg border border-slate-800 bg-slate-950/50 p-6 backdrop-blur-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-300">
                <FiUser className="text-emerald-500" /> {t("name")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  {...field}
                  className="border-slate-700 bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-300">
                <FiMail className="text-emerald-500" /> {t("email")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  required
                  typeof="email"
                  className="border-slate-700 bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-300">
                <FiBriefcase className="text-emerald-500" />{" "}
                {t("title.position")}
              </FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="border-slate-700 bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                    <SelectValue placeholder="Trader" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-700 bg-slate-800">
                    <SelectItem value="trader">{t("title.option1")}</SelectItem>
                    <SelectItem value="investor">
                      {t("title.option2")}
                    </SelectItem>
                    <SelectItem value="broker">{t("title.option3")}</SelectItem>
                    <SelectItem value="other">{t("title.option4")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-slate-300">
                <FiMessageSquare className="text-emerald-500" /> {t("message")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Message"
                  {...field}
                  className="min-h-32 border-slate-700 bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 text-lg font-medium text-white shadow-lg shadow-emerald-900/20 transition-all hover:from-emerald-500 hover:to-teal-600 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <FiSend className="h-5 w-5" />
                <span>{t("button")}</span>
              </>
            )}
          </Button>
        </motion.div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-md bg-emerald-900/30 p-3 text-center text-sm text-emerald-400"
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t("feedback.success")}
            </div>
          </motion.div>
        )}
      </form>
    </Form>
  );
};

export default ContactForm;
