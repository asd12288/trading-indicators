import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4 text-center md:p-48">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold md:text-6xl">404</h1>
          <h2 className="text-xl font-medium md:text-4xl">{t("title")}</h2>
          <p className="md:text-2xl">{t("description")}</p>
        </div>
        <Button className="bg-green-800 px-4 py-2 hover:bg-green-900">
          <Link href="/">{t("button")}</Link>
        </Button>
      </div>
    </>
  );
}


