"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import avatar from "@/public/avatar.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  updateEmail,
  updateAvatar,
} from "@/app/[locale]/(root)/profile/actions";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Camera,
  CheckIcon,
  Loader2,
  User,
  Mail,
  CrownIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProfileCardProps {
  user: {
    id: string;
    email: string;
  };
  profile: {
    preferences: string;
    username: string;
    avatar: string;
    avatarUrl: string;
    plan: string;
    email: string;
  };
}

const ProfileCard = ({ user, profile }: ProfileCardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("ProfileCard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { username, avatarUrl, plan, email } = profile || {};
  const userId = user.id;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateEmail(userId, user, formData);
      if (result.error) {
        toast.error(t("toast.error.title"));
      } else {
        toast.success(t("toast.success.title"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await updateAvatar(user.id, file);
      if (result.error) {
        toast.error(t("toast.error.title"));
      } else {
        toast.success(t("toast.avatar.success"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-md"
    >
      <Card className="overflow-hidden border border-slate-700 bg-slate-900/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="bg-slate-800/30 pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-slate-50">
              {t("title")}
            </CardTitle>
            <Badge
              className={
                plan === "pro"
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600"
                  : "bg-slate-700"
              }
            >
              {plan === "pro" ? "PRO" : "FREE"}
            </Badge>
          </div>
          <div className="mt-6 flex items-center gap-6">
            <div className="relative">
              <div
                className={`${isUploading ? "animate-pulse" : ""} group relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-slate-700 ring-offset-2 ring-offset-slate-900`}
              >
                <Image
                  src={avatarUrl || avatar}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              {isUploading && (
                <div className="absolute bottom-0 right-0 rounded-full bg-slate-800 p-1">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-slate-100">{username}</h3>
              <p className="text-sm text-slate-400">{email}</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </CardHeader>

        <CardContent className="p-6">
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <User className="h-4 w-4" />
                  {t("labels.username")}
                </Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={username}
                  className="border-slate-700 bg-slate-800/70 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-sm font-medium text-slate-300"
                >
                  <Mail className="h-4 w-4" />
                  {t("labels.email")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={email}
                  type="email"
                  disabled
                  className="border-slate-700 bg-slate-800/70 text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <div className="mt-6 flex items-center gap-2">
                <CrownIcon
                  className={`h-5 w-5 ${plan === "pro" ? "text-yellow-500" : "text-slate-500"}`}
                />
                <span className="text-sm text-slate-50">
                  {t("plan.label")}
                  {"  "}
                  <span className="font-medium text-slate-100">
                    {plan === "pro" ? "Premium" : "Free"}
                  </span>
                </span>

                {plan === "free" && (
                  <Link href="/profile?tab=upgrade" className="ml-auto">
                    <Badge className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-700 px-3 py-1 text-xs transition-transform hover:scale-105">
                      {t("plan.upgrade")}
                      <ArrowUpRightIcon className="ml-1 h-3 w-3" />
                    </Badge>
                  </Link>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-500 hover:to-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("buttons.saving")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4" />
                  {t("buttons.save")}
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between bg-slate-800/30 p-4 pt-4 text-xs text-slate-400">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-400 hover:underline"
          >
            {!avatarUrl ? t("avatar.add") : t("avatar.change")}
          </button>
          <span>Member since: {new Date().getFullYear()}</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
