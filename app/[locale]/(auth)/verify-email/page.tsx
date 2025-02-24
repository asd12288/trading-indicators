import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { MdEmail } from "react-icons/md";

export default function VerifyEmailPage() {
  const t = useTranslations("verfiyEmail");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-center text-2xl font-bold">{t("title")}</h1>
          <MdEmail className="text-4xl" />
        </div>
        <p className="text-center text-gray-600">{t("subtitle")}</p>
        <div className="mt-4">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2"
          >
            <p className="">{t("login")}</p>
            <ArrowRight className="top-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
