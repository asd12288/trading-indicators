import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ErrorPage() {
  const t = useTranslations("ErrorPage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mb-8 leading-relaxed text-slate-400">
          {t("description")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => window.location.reload()}
            variant="default"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <RefreshCcw className="h-4 w-4" />
            {t("button")}
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="mt-2 flex w-full items-center gap-2 sm:mt-0 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
