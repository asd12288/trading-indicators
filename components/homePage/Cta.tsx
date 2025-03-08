import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

const Cta = () => {
  const t = useTranslations("HomePage.cta");

  return (
    <div className="relative my-12 overflow-hidden">
      {/* Background patterns */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"
        aria-hidden="true"
      ></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Decorative circle */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur-3xl"></div>

      <div className="relative px-6 py-16 text-center md:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="mb-3 inline-block rounded-full bg-green-500/20 px-4 py-1 text-sm font-medium text-green-300">
            {t("tag")}
          </span>

          <h4 className="font-heading mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-extrabold text-transparent md:text-5xl">
            {t("title")}
          </h4>

          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            {t("subtitle")}{" "}
            <span className="font-semibold text-green-400">Trader Map</span>{" "}
          </p>

          <div className="mt-8 flex justify-center">
            <Link href="/signup" className="group relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 opacity-70 blur transition duration-200 group-hover:opacity-100"></div>
              <Button className="relative flex items-center gap-2 rounded-full bg-gradient-to-br from-green-600 to-green-700 px-8 py-6 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:shadow-green-500/20 group-hover:scale-105">
                {t("button")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center"></div>
            <div className="flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-slate-300">{t("card")}</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-slate-300">{t("cancel")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;
