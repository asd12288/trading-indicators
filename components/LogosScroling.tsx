"use client";

import euronext from "@/public/logos/euronext.png";
import nasdaq from "@/public/logos/nasdaq.png";
import ice from "@/public/logos/ice.png";
import hkex from "@/public/logos/hkex.png";
import olme from "@/public/logos/olme.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

const CompanyLogoData = [
  { src: euronext, alt: "euronext" },
  { src: nasdaq, alt: "nasdaq" },
  { src: ice, alt: "ice" },
  { src: hkex, alt: "hkex" },
  { src: olme, alt: "olme" },
] as const;

const LogosScroling: React.FC = () => {
  const t = useTranslations("HomePage.logos");

  return (
    <div className="container mx-auto py-10">
      <h2 className="my-5 text-center text-xl text-white/70">{t("title")}</h2>
      <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-10 before:bg-gradient-to-r before:from-slate-950 before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-10 after:bg-gradient-to-l after:from-slate-950 after:to-transparent after:content-['']">
        <motion.div
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
          initial={{ translateX: 0 }}
          animate={{ translateX: "-50%" }}
          className="flex flex-none gap-16 pr-16"
        >
          {[...new Array(3)].fill(0).map((_, index) => (
            <Fragment key={index}>
              {CompanyLogoData.map(({ src, alt }) => (
                <Image
                  key={alt}
                  src={src}
                  alt={alt}
                  className="h-12 w-auto flex-none md:h-24"
                />
              ))}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LogosScroling;
