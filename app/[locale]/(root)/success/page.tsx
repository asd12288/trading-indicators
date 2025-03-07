"use client";

import { useRouter, Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const t = useTranslations("SuccessPayment");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    router.refresh();

    const redirectTime = 5000; // 5 seconds
    const interval = 50; // Update interval in ms
    const steps = redirectTime / interval;
    const decrementValue = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress - decrementValue;
        return newProgress < 0 ? 0 : newProgress;
      });
    }, interval);

    const timeout = setTimeout(() => {
      router.push("/smart-alerts");
    }, redirectTime);

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-800/80 p-8 text-center shadow-2xl backdrop-blur-sm">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <svg className="h-24 w-24 rotate-[-90deg]">
              <circle
                className="text-slate-700"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
              <circle
                className="text-green-500 transition-all duration-300 ease-in-out"
                strokeWidth="4"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - progress / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="48"
                cy="48"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">{t("title")}</h1>

        <p className="mb-8 leading-relaxed text-slate-400">
          {t("description")}
        </p>

        <div className="mb-6 text-sm text-slate-500">
          Redirecting in {Math.ceil(progress / 20)} seconds...
        </div>

        <Link
          href="/signals"
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white transition-all"
        >
          {t("button")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
