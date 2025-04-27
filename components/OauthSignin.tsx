"use client";

import { oAuthSignIn } from "@/app/[locale]/(auth)/login/actions";
import { Provider } from "@supabase/supabase-js";
import { JSX } from "react";
import { FaGoogle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

type OAuthProvider = {
  name: Provider;
  icon?: JSX.Element;
};

export function OAuthButtons({ locale }: { locale: string }) {
  const t = useTranslations("OAuth");

  const oAuthProviders: OAuthProvider[] = [
    {
      name: "google",
      icon: <FaGoogle className="text-2xl" />,
    },
  ];

  const handleOAuthSignIn = async (provider: Provider) => {
    await oAuthSignIn(provider, locale);
  };

  return (
    <>
      {oAuthProviders.map((provider) => (
        <button
          onClick={() => handleOAuthSignIn(provider.name)}
          key={provider.name}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white p-2 text-slate-950"
        >
          {provider.icon}
          {t(`providers.${provider.name}`)}
        </button>
      ))}
    </>
  );
}
