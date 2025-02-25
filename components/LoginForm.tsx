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
        router.push(`/signals`);
      }
    });
  }

  return (
    <>
      <Link href="/">
        <div className="mb-4 flex items-center gap-2">
          <FaArrowLeft className="text-lg" />
          <p className="text-sm font-light hover:cursor-pointer hover:underline">
            {t("navigation.backHome")}
          </p>
        </div>
      </Link>
      <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>
      <div className="w-96 max-w-96 space-y-6 rounded-xl bg-slate-800 p-8 text-slate-50 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-slate-50">{t("subtitle")}</p>
            </div>

            {serverError && (
              <div className="rounded border border-red-500 bg-red-100 p-2 text-center text-sm text-red-900">
                {serverError}
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("placeholder.email")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("labels.password")}</FormLabel>
                    <Link
                      href={`/forgot-password`}
                      className="text-sm font-medium hover:underline"
                    >
                      {t("links.forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("placeholder.password")}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-green-800 text-white hover:bg-green-900"
              disabled={isPending}
            >
              {isPending ? t("buttons.submitting") : t("buttons.submit")}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-light">{t("dividers.or")}</p>
          <OAuthButtons locale={locale} />
        </div>

        <div className="text-center text-sm font-light">
          {t("account.question")}{" "}
          <Link href={`/signup`} className="underline">
            {t("links.createAccount")}
          </Link>
        </div>
      </div>
    </>
  );
}
