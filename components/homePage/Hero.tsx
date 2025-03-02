import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import hero from "../../public/hero.png";
import DemoCard from "./DemoCard";
import LogosScroling from "@/components/LogosScroling";

const Hero = () => {
  const t = useTranslations("HomePage.hero");

  return (
    <section>
      <div className="flex flex-col bg-gradient-to-b from-slate-950 to-slate-800 md:grid md:grid-cols-2">
        {/* LEFT COLUMN */}
        <div className="mt-8 w-full py-4 md:py-20 md:pl-20 xl:py-28">
          <p className="text-center md:text-left">{t("rating")}</p>
          <p className="my-3 text-center font-thin md:text-left">
            {t("count")}
          </p>
          <h1 className="text-center text-4xl font-bold text-green-50 md:text-left md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Smart Alert <br /> {t("mainTitleStart")}
          </h1>
          <h2 className="mt-4 text-center text-lg font-light md:text-left md:text-2xl lg:text-4xl">
            {t("highlightedText")}
          </h2>

          <div className="mt-10 flex justify-center gap-4 md:justify-start">
            <Link href="/signup">
              <div className="flex flex-col items-center gap-2">
                <button className="rounded-full bg-gradient-to-r from-green-600 to-green-800 px-4 py-2 transition-all hover:bg-green-700 md:px-8 md:py-3 md:font-medium lg:text-xl">
                  {t("buttons.joinUs")}{" "}
                  <span>
                    <HiArrowRight className="inline" />
                  </span>
                </button>
                <p className="text-xs font-light">
                  {t("noCard")}
                </p>
              </div>
            </Link>

            <Link href="/info">
              <button className="px-3 py-2 text-xs underline transition-all md:px-4 md:py-3 md:font-medium lg:text-xl">
                {t("buttons.learnMore")}
              </button>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="my-4 flex w-full items-center justify-center lg:mt-12">
          {/* Parent must be relative for absolute positioning inside */}
          <div className="w-full items-center justify-center md:relative lg:flex">
            {/* A container to hold both cards, one behind the other */}
            <div className="xs:grid grid-cols-2 md:relative">
              <div className="relative z-10">
                <DemoCard type="es" />
              </div>

              <div className="z-0 hidden md:absolute md:right-[-95px] md:top-[-95px] lg:block">
                <DemoCard type="nq" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogosScroling />
    </section>
  );
};

export default Hero;
