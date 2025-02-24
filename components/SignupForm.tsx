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

export function SignupForm() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("SignupForm");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const signupFormSchema = z
    .object({
      email: z.string().email(t("validation.email")),
      password: z.string().min(8, t("validation.password")),
      confirmPassword: z.string().min(8, t("validation.passwordMismatch")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("validation.passwordMismatch"),
    });

  type SignupFormValues = z.infer<typeof signupFormSchema>;

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
      <div className="max-y-96 w-96 space-y-6 rounded-lg bg-slate-800 p-8 text-slate-50">
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
                    <Input
                      placeholder={t("placeholder.email")}
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
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
                  <FormLabel>{t("labels.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("placeholder.password")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("labels.confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("placeholder.confirmPassword")}
                      {...field}
                    />
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
              {isPending ? t("buttons.creating") : t("buttons.submit")}
            </Button>
          </form>
        </Form>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-light"> {t("dividers.or")}</p>
          <OAuthButtons />
        </div>

        <div className="text-center text-sm font-light">
          {t("account.existing")}{" "}
          <Link href="/login" className="underline">
            {t("account.login")}
          </Link>
        </div>
      </div>
    </>
  );
}
