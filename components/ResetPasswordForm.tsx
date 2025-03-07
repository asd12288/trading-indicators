"use client";

import { updatePassword } from "@/app/[locale]/(auth)/reset-password/actions";
import { EyeIcon, EyeOffIcon, LockIcon, CheckCircleIcon } from "lucide-react";
import React, { startTransition, useActionState, useState } from "react";
import { z } from "zod";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-md"
    >
      <Card className="overflow-hidden border border-slate-700 bg-slate-900/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="bg-slate-800/30 pb-6">
          <div className="flex items-center gap-3">
            <LockIcon className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-xl text-slate-50">
              {t("title")}
            </CardTitle>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Enter your new password below. Password must be at least 8
            characters long.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="locale" value={locale} />

            <div className="space-y-2">
              <Label
                className="flex items-center gap-2 text-sm font-medium text-slate-300"
                htmlFor="password"
              >
                {t("labels.password")}
              </Label>
              <div className="relative">
                <Input
                  className="border-slate-700 bg-slate-800/70 pr-10 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                className="flex items-center gap-2 text-sm font-medium text-slate-300"
                htmlFor="confirmPassword"
              >
                {t("labels.confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  className="border-slate-700 bg-slate-800/70 pr-10 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {clientError && (
              <div className="rounded-md border border-red-800 bg-red-900/20 p-3 text-sm text-red-400">
                {clientError}
              </div>
            )}

            {error && (
              <div className="rounded-md border border-red-800 bg-red-900/20 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 rounded-md border border-green-800 bg-green-900/20 p-3 text-sm text-green-400">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Password updated successfully!</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-500 hover:to-blue-600"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                  {t("buttons.updating")}
                </span>
              ) : (
                t("buttons.submit")
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="bg-slate-800/30 p-4 text-center text-xs text-slate-400">
          Make sure your password is secure and don't share it with anyone
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ResetPasswordForm;
