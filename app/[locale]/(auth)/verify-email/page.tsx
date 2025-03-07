import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { MdEmail } from "react-icons/md";

export default function VerifyEmailPage() {
  const t = useTranslations("verfiyEmail");

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-800/80 p-8 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/20 p-6">
            <MdEmail className="text-6xl text-primary animate-pulse" />
          </div>
        </div>
        
        <h1 className="mt-6 text-center text-3xl font-bold text-white">
          {t("title")}
        </h1>
        
        <p className="mt-4 text-center text-gray-400 leading-relaxed">
          {t("subtitle")}
        </p>
        
        {/* Email inbox illustration */}
        <div className="my-8 flex justify-center">
          <div className="w-3/4 h-24 bg-slate-700/50 rounded-lg border border-slate-600 p-3 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <div className="h-1.5 w-24 bg-slate-500 rounded"></div>
            </div>
            <div className="h-1.5 w-full bg-slate-600/50 rounded mb-1.5"></div>
            <div className="h-1.5 w-3/4 bg-slate-600/50 rounded"></div>
          </div>
        </div>
        
        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary/90 hover:bg-primary px-6 py-3 font-medium text-white transition-all"
        >
          <span>{t("login")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
