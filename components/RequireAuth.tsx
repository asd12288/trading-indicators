"use client";

// filepath: /c:/Users/ilanc/Desktop/indicators/components/RequireAuth.tsx
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    signIn(undefined, { callbackUrl: router.asPath });
    return <p>Redirecting to login...</p>;
  }
  return <>{children}</>;
}