import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

const Cta = () => {
  const t = useTranslations("HomePage.cta");

  return (
    <div className="my-8 px-6 py-10 text-center shadow-md bg-slate-800">
      <h4 className="text-2xl font-extrabold text-slate-200 md:text-4xl">
        {t("title")}
      </h4>
      <h5 className="mt-3 text-base text-slate-400 md:text-lg">
        {t("subtitle")}
      </h5>
      <Link href="/signup">
        <Button className="mt-6 rounded-full bg-green-700 px-6 py-3 text-lg font-semibold text-white transition hover:scale-105 hover:bg-green-800">
          {t("button")}
        </Button>
      </Link>
    </div>
  );
};

export default Cta;
