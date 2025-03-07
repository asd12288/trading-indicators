import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Visual Element */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="animate-pulse text-[10rem] font-bold text-green-500/20 md:text-[16rem]">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-32 w-32 text-green-600 md:h-48 md:w-48"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white md:text-5xl">
                {t("title")}
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                {t("description")}
              </p>
              <Button className="mt-4 transform bg-green-600 px-8 py-6 text-lg transition-all duration-200 hover:scale-105 hover:bg-green-700 hover:shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {t("button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
