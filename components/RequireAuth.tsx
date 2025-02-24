"use client";

import { usePathname } from "@/i18n/routing";
// filepath: /c:/Users/ilanc/Desktop/indicators/components/RequireAuth.tsx
import { useSession, signIn } from "next-auth/react";
import React from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn(undefined, { callbackUrl: pathname });
    return <p>Redirecting to login...</p>;
  }
  return <>{children}</>;
}
