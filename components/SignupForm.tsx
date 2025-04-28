"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/[locale]/(auth)/signup/actions";
import { OAuthButtons } from "./OauthSignin";
import { Link, useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("SignupForm");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  // Update the schema to include terms acceptance
  const signupFormSchema = z
    .object({
      email: z.string().email(t("validation.email")),
      password: z.string().min(8, t("validation.password")),
      confirmPassword: z.string().min(8, t("validation.passwordMismatch")),
      termsAccepted: z.literal(true, {
        errorMap: () => ({
          message: t("validation.termsRequired"),
        }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.passwordMismatch"),
    });

  type SignupFormValues = z.infer<typeof signupFormSchema>;

  // Update the form default values
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: SignupFormValues) {
    setServerError(null);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirmPassword", values.confirmPassword);

    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) {
        setServerError(result.error);
      } else {
        router.push("/verify-email");
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md px-4"
    >
      <Link href="/">
        <motion.div
          className="mb-6 flex items-center gap-2 text-slate-300 hover:text-white"
          whileHover={{ x: -3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <FaArrowLeft className="text-lg" />
          <p className="text-sm font-medium hover:underline">
            {t("navigation.backHome")}
          </p>
        </motion.div>
      </Link>
      <h1 className="mb-2 text-4xl font-bold text-slate-50">{t("title")}</h1>
      <p className="mb-6 text-slate-400">{t("subtitle")}</p>

      <div className="space-y-6 rounded-xl border border-slate-700/30 bg-gradient-to-b from-slate-800 to-slate-900 p-6 text-slate-50 shadow-xl sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-200"
              >
                {serverError}
              </motion.div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-slate-200">
                    {t("labels.email")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("placeholder.email")}
                      type="email"
                      autoComplete="email"
                      className="border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-green-500/50 focus:ring focus:ring-green-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-slate-200">
                    {t("labels.password")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("placeholder.password")}
                      className="border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-green-500/50 focus:ring focus:ring-green-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-sm font-medium text-slate-200">
                    {t("labels.confirmPassword")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("placeholder.confirmPassword")}
                      className="border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-green-500/50 focus:ring focus:ring-green-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-700/40 bg-slate-800/20 p-3">
                  <FormControl>
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-1 focus:ring-green-500 focus:ring-offset-0"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      {field.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        />
                      )}
                    </div>
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal text-slate-300">
                      {t("labels.terms")}{" "}
                      <Link
                        href="/terms-and-conditions"
                        className="font-medium text-green-400 underline decoration-green-400/30 underline-offset-2 hover:text-green-300 hover:decoration-green-300/50"
                      >
                        {t("labels.termsLink")}
                      </Link>
                    </FormLabel>
                    <FormMessage className="text-xs font-medium text-red-400" />
                  </div>
                </FormItem>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mt-2"
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transition-all duration-200 hover:from-green-500 hover:to-green-600 hover:shadow-lg disabled:opacity-70"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("buttons.creating")}
                  </span>
                ) : (
                  t("buttons.submit")
                )}
              </Button>
            </motion.div>
          </form>
        </Form>

        <div className="relative flex items-center py-1.5">
          <div className="flex-grow border-t border-slate-700/50"></div>
          <span className="mx-4 flex-shrink text-xs font-light text-slate-400">
            {t("dividers.or")}
          </span>
          <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <OAuthButtons />
        </div>

        <div className="pt-2 text-center text-sm font-light">
          {t("account.existing")}{" "}
          <Link
            href="/login"
            className="font-medium text-green-400 underline decoration-green-400/30 underline-offset-2 hover:text-green-300"
          >
            {t("account.login")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
