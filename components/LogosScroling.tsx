"use client";
import React from "react";

import euronext from "@/public/logos/euronext.png";
import nasdaq from "@/public/logos/nasdaq.png";
import ice from "@/public/logos/ice.png";
import hkex from "@/public/logos/hkex.png";
import olme from "@/public/logos/olme.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CompanyLogoData = [
  { src: euronext, alt: "Euronext Exchange Logo" },
  { src: nasdaq, alt: "Nasdaq Exchange Logo" },
  { src: ice, alt: "Intercontinental Exchange Logo" },
  { src: hkex, alt: "Hong Kong Exchange Logo" },
  { src: olme, alt: "OLME Trading Exchange Logo" },
] as const;

const LogosScroling: React.FC = () => {
  const t = useTranslations("HomePage.logos");
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Only enable animation when component is visible
  useEffect(() => {
    setShouldAnimate(true);

    // Clean up animation on unmount
    return () => setShouldAnimate(false);
  }, []);

  return (
    <section
      aria-labelledby="trusted-exchanges"
      className="overflow-hidden bg-slate-900/50 py-10"
    >
      <div className="container mx-auto">
        <h2
          id="trusted-exchanges"
          className="my-5 text-center text-xl font-medium text-white/70"
        >
          {t("title")}
        </h2>
        <div className="relative flex overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-slate-950 before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-slate-950 after:to-transparent after:content-['']">
          <motion.div
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            initial={{ translateX: 0 }}
            animate={shouldAnimate ? { translateX: "-50%" } : {}}
            className="flex flex-none gap-16 pr-16"
          >
            {[...new Array(2)].fill(0).map((_, index) => (
              <Fragment key={index}>
                {CompanyLogoData.map(({ src, alt }) => (
                  <div key={alt} className="flex items-center justify-center">
                    <Image
                      src={src}
                      alt={alt}
                      className="h-12 w-auto flex-none grayscale filter transition-all duration-300 hover:grayscale-0 md:h-20"
                      loading="lazy"
                      width={150}
                      height={60}
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LogosScroling);
