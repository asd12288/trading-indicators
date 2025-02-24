"use client";

import React, { useActionState } from "react";
import { sendResetPasswordEmail } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const Page = () => {
  const [state, formAction, isPending] = useActionState(
    sendResetPasswordEmail,
    {
      error: "",
      success: false,
    },
  );
  const t = useTranslations("ForgotPassword");

  const { error, success } = state;
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 max-w-96 space-y-6 rounded-xl bg-slate-800 p-8 text-slate-50 shadow-md">
        <h3 className="text-2xl font-semibold">{t("title")}</h3>
        <form action={formAction}>
          <div className="mb-4">
            <Label
              htmlFor="email"
              className="mb-2 block text-sm font-bold text-slate-200"
            >
              {t("labels.email")}
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder={t("placeholder.email")}
              className="w-full appearance-none rounded border px-3 py-2 shadow"
            />
          </div>
          <div>
            <button
              disabled={isPending}
              type="submit"
              className="w-full rounded bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800"
            >
              {isPending ? t("buttons.sending") : t("buttons.submit")}
            </button>
            {error && <p className="mt-3 text-center text-red-500">{error}</p>}
            {success && (
              <p className="mt-3 text-center text-green-500">{success}</p>
            )}
          </div>
        </form>
        <Link href="/login" className="text-sm font-light hover:underline">
          <p className="mt-2">{t("messages.backToLogin")}</p>
        </Link>
      </div>
    </div>
  );
};

export default Page;
