import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const UpgradePrompt = () => {
  const t = useTranslations("UpgradePrompt");

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <p className="text-center text-gray-400">{t("title")}</p>
      <Link href="/profile?tab=upgrade">
        <button className="rounded-lg bg-green-800 p-2">{t("button")}</button>
      </Link>
    </div>
  );
};

export default UpgradePrompt;
