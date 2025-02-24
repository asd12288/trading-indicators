"use client";

import Image from "next/image";
import React, { useRef } from "react";
import avatar from "@/public/avatar.png";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  updateEmail,
  updateAvatar,
} from "@/app/[locale]/(root)/profile/actions";
import { useToast } from "@/hooks/use-toast";
import { Link } from "@/i18n/routing";
import { useClients } from "@/hooks/useClients";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

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
  };
}

const ProfileCard = ({ user, profile }: ProfileCardProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("ProfileCard");
  const params = useParams();
  const locale = params.locale || "en";

  const { username, avatarUrl, plan, email } = profile || {};
  const userId = user.id;

  const { clients } = useClients();

  const handleSubmit = async (formData: FormData) => {
    const result = await updateEmail(userId, user, formData);
    if (result.error) {
      toast({
        variant: "destructive",
        title: t("toast.error.title"),
        description: result.error.message,
      });
    } else {
      toast({
        title: t("toast.success.title"),
        description: t("toast.success.profileUpdate"),
      });
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await updateAvatar(user.id, file);
    if (result.error) {
      toast({
        variant: "destructive",
        title: t("toast.error.title"),
        description: result.error.message,
      });
    } else {
      toast({
        title: t("toast.success.title"),
        description: t("toast.success.avatarUpdate"),
      });
    }
  };

  return (
    <div className="mt-10 md:w-96">
      <form action={handleSubmit}>
        <h1 className="mb-4 text-xl font-semibold md:text-3xl">
          {t("title")} - {username}
        </h1>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-start gap-4">
            <Image
              src={avatarUrl || avatar}
              alt="avatar"
              width={75}
              height={75}
              className="aspect-square rounded-full object-cover"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              {!avatarUrl ? t("avatar.add") : t("avatar.change")}
            </Button>
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="username">{t("labels.username")}</Label>
            <Input id="username" name="username" defaultValue={username} />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="email">{t("labels.email")}</Label>
            <Input
              id="email"
              name="email"
              defaultValue={email}
              type="email"
              disabled
            />
          </div>
          <div className="flex items-center justify-between">
            <p>
              {t("plan.label")} <span className="font-semibold">{plan}</span>
            </p>

            {plan === "free" ? (
              <Link href="/profile?tab=upgrade">
                <p className="rounded-lg bg-green-700 px-3 py-2 font-semibold hover:bg-green-800">
                  {t("plan.upgrade")}
                </p>
              </Link>
            ) : null}
          </div>

          <Button type="submit" className="w-full">
            {t("buttons.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileCard;
