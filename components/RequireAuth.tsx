"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { useUser } from "@/providers/UserProvider";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    // Only redirect after loading is complete and we know there's no user
    if (!loading && !user) {
      // Store the current path for redirect after login
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If not loading and we have a user, render the children
  if (!loading && user) {
    return <>{children}</>;
  }

  // Otherwise show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Redirecting to login...</p>
    </div>
  );
}
