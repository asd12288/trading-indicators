"use client";

import { updatePassword } from "@/app/[locale]/(auth)/reset-password/actions";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { startTransition, useActionState, useState } from "react";
import { z } from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const ResetPasswordForm = () => {
  const { locale } = useParams();
  const t = useTranslations("ResetPasswordForm");
  const [clientError, setClientError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(updatePassword, {
    error: "",
    success: false,
  });

  const passwordSchema = z
    .object({
      password: z.string().min(8, t("validation.minLength")),
      confirmPassword: z.string().min(8, t("validation.minLength")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const passwordData = {
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const result = passwordSchema.safeParse(passwordData);

    if (!result.success) {
      setClientError(result.error.errors[0].message);
      return;
    }

    setClientError("");

    startTransition(() => {
      formAction(formData);
    });
  };

  const { error, success } = state;

  return (
    <div className="max-w-96 space-y-6 bg-slate-800 p-2 text-slate-50 md:w-96 md:p-8">
      <h3 className="mb-2 text-2xl font-semibold">{t("title")}</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label
            className="mb-2 block text-sm font-bold text-slate-200"
            htmlFor="password"
          >
            {t("labels.password")}
          </Label>
          <div className="relative">
            <input type="hidden" name="locale" value={locale} />
            <Input
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <div>
          <Label
            className="mb-2 block text-sm font-bold text-slate-200"
            htmlFor="confirmPassword"
          >
            {t("labels.confirmPassword")}
          </Label>
          <div>
            <Input
              className="w-full appearance-none rounded border px-3 py-2 shadow"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button type="submit" className="px-4 py-2">
            {isPending ? t("buttons.updating") : t("buttons.submit")}
          </Button>
          {clientError && <p className="text-red-500">{clientError}</p>}
          {success && <p className="text-green-500">{success}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
