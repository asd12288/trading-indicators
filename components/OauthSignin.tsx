"use client";
import { oAuthSignIn } from "@/app/(auth)/login/actions";
import { Provider } from "@supabase/supabase-js";
import { JSX } from "react";
import { FaGoogle } from "react-icons/fa";

type OAuthProvider = {
  name: Provider;
  dispalyName: string;
  icon?: JSX.Element;
};

export function OAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "google",
      dispalyName: " Login with Google",
      icon: <FaGoogle className="text-2xl" />,
    },
  ];

  return (
    <>
      {oAuthProviders.map((provider) => (
        <button
          onClick={async () => await oAuthSignIn(provider.name)}
          key={provider.name}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white p-2 text-slate-950"
        >
          {provider.icon}
          {provider.dispalyName}
        </button>
      ))}
    </>
  );
}
