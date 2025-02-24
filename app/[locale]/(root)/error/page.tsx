import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ErrorPage() {
  const t = useTranslations("ErrorPage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <Button>{t("button")}</Button>
    </div>
  );
}
