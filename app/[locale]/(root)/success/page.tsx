"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Gift, Rocket, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const t = useTranslations("Success");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fire confetti animation on page load
    const fireConfetti = () => {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Use either burst or random-direction confetti
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#5b21b6", "#2563eb", "#3b82f6"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#9333ea", "#8b5cf6", "#4f46e5"],
        });
      }, 250);
    };

    // Get user info if available
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/profile");
        const data = await response.json();
        if (data.user) {
          setUserName(data.user.email?.split("@")[0] || "");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fireConfetti();
    fetchUserInfo();
  }, []);

  const steps = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      title: t("steps.payment.title"),
      description: t("steps.payment.description"),
    },
    {
      icon: <Gift className="h-6 w-6 text-purple-400" />,
      title: t("steps.access.title"),
      description: t("steps.access.description"),
    },
    {
      icon: <Rocket className="h-6 w-6 text-blue-400" />,
      title: t("steps.start.title"),
      description: t("steps.start.description"),
    },
  ];

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-4 py-12">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>

        <h1 className="mb-2 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
          {userName ? `${t("titleWithName", { name: userName })}` : t("title")}
        </h1>

        <p className="mb-8 text-lg text-slate-300">{t("subtitle")}</p>
      </motion.div>

      <motion.div
        className="mb-10 grid w-full gap-6 md:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <Card className="h-full border border-slate-700 bg-slate-800/50 shadow-lg backdrop-blur">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-700/50">
                  {step.icon}
                </div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-300">{step.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
        <Button
          size="lg"
          variant="outline"
          className="border-slate-700 bg-slate-800/50 backdrop-blur"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("buttons.home")}
          </Link>
        </Button>

        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-blue-600"
          asChild
        >
          <Link href="/smart-alerts">
            {t("buttons.dashboard")} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-slate-400">
          {t("help")}{" "}
          <a
            href="mailto:support@trader-map.com"
            className="text-blue-400 underline hover:text-blue-300"
          >
            support@trader-map.com
          </a>
        </p>
      </div>
    </div>
  );
}
