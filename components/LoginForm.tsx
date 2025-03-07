"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
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
import { emailLogin } from "@/app/[locale]/(auth)/login/actions";
import { Link, useRouter } from "@/i18n/routing";
import { OAuthButtons } from "./OauthSignin";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("LoginForm");
  const params = useParams();
  const locale = params.locale as string;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("locale", locale);

    console.log(locale);

    startTransition(async () => {
      const result = await emailLogin(formData);
      if (result?.error) {
        setServerError(result.error);
      } else {
        router.push(`/smart-alerts`);
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
                      className="border-slate-700 bg-slate-800/50 text-slate-100 placeholder:text-slate-500 focus:border-green-500/50 focus:ring focus:ring-green-500/20"
                      autoComplete="email"
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium text-slate-200">
                      {t("labels.password")}
                    </FormLabel>
                    <Link
                      href={`/forgot-password`}
                      className="text-xs font-medium text-green-400 hover:text-green-300 hover:underline"
                    >
                      {t("links.forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("placeholder.password")}
                        className="border-slate-700 bg-slate-800/50 pr-10 text-slate-100 placeholder:text-slate-500 focus:border-green-500/50 focus:ring focus:ring-green-500/20"
                        autoComplete="current-password"
                        {...field}
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs font-medium text-red-400" />
                </FormItem>
              )}
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-2"
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
                    {t("buttons.submitting")}
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
          <OAuthButtons locale={locale} />
        </div>

        <div className="pt-2 text-center text-sm font-light">
          {t("account.question")}{" "}
          <Link
            href={`/signup`}
            className="font-medium text-green-400 underline decoration-green-400/30 underline-offset-2 hover:text-green-300"
          >
            {t("links.createAccount")}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
