import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import hero from "../../public/hero.png";
import DemoCard from "./DemoCard";

const Hero = () => {
  const t = useTranslations("HomePage.hero");

  return (
    <section>
      <div className="grid grid-cols-2 bg-gradient-to-br  from-slate-950 to-slate-700">
        {/* LEFT COLUMN */}
        <div className="w-full py-28 md:py-20 md:pl-20">
          <p className="text-center md:text-left">{t("rating")}</p>
          <p className="my-3 text-center font-thin md:text-left">
            {t("count")}
          </p>
          <h1 className="text-center text-4xl font-bold text-green-50 md:text-left md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Smart Alert <br /> for active traders
          </h1>
          <h2 className="mt-4 text-center text-lg font-light md:text-left md:text-2xl lg:text-4xl">
            React Faster, Trade Smarter
          </h2>

          <div className="mt-10 flex justify-center gap-4 md:justify-start">
            <Link href="/signup">
              <div className="flex flex-col items-center gap-2">
                <button className="rounded-full bg-green-700 px-4 py-2 transition-all hover:bg-green-700 md:px-8 md:py-3 md:font-medium lg:text-xl">
                  {t("buttons.joinUs")}{" "}
                  <span>
                    <HiArrowRight className="inline" />
                  </span>
                </button>
                <p className="text-xs font-light">No Credit card required</p>
              </div>
            </Link>

            <Link href="/info">
              <button className="px-3 py-2 text-xs underline transition-all md:px-4 md:py-3 md:font-medium lg:text-xl">
                {t("buttons.learnMore")}
              </button>
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-12 md:grid md:grid-cols-3 md:gap-4 lg:w-2/3 lg:justify-between lg:gap-20"></div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex w-full items-center justify-center">
          {/* Parent must be relative for absolute positioning inside */}
          <div className="relative hidden w-full items-center justify-center lg:flex">
            {/* A container to hold both cards, one behind the other */}
            <div className="relative">
              {/* Foreground (top) card */}
              <div className="relative z-10">
                <DemoCard type='es' />
              </div>
              {/* Background (behind) card, offset slightly */}
              <div className="absolute right-[-80px] top-[-80px] z-0">
                <DemoCard type='nq' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
