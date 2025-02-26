"use client";

import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();

  const t = useTranslations('SuccessPayment');
  useEffect(() => {
    // Force a router refresh to ensure all server components
    // fetch fresh data from the database
    router.refresh();

    // Optional: redirect to dashboard after a delay
    const timeout = setTimeout(() => {
      router.push("/signals");
    }, 5000); // 5 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto inline-block rounded-full bg-green-100 p-3 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">{t('title')}</h1>

        <p className="text-gray-500">
        {t('description')}
        </p>

        <div className="pt-4">
          <Link
            href="/signals"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-2 font-medium text-white"
          >
              {t('button')}
          </Link>
        </div>
      </div>
    </div>
  );
}
