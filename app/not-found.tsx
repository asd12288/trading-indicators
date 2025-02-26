import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <>
      <Header />
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-48 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-4xl font-medium">{t("title")}</h2>
          <p className="text-2xl">{t("description")}</p>
        </div>
        <Button className="bg-green-800 px-4 py-2 hover:bg-green-900">
          <Link href="/">{t("button")}</Link>
        </Button>
      </div>
      <Footer />
    </>
  );
}
