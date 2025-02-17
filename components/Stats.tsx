"use client";
import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

const Stats = ({ num, text, symbol = "", duration }) => {
  const number = Number(num);
  const count = useMotionValue(0);
  const rounded = useTransform(() => Math.round(count.get()));

  useEffect(() => {
    const controls = animate(count, number, { duration: duration, ease: "easeOut" });
    return () => controls.stop();
  }, []);

  return (
    <div>
      <div className="flex items-baseline ">
        <motion.pre className="text-center text-2xl font-semibold md:text-left md:text-3xl lg:text-4xl xl:text-5xl">
          {rounded}
        </motion.pre>
        <p className="text-3xl font-bold">{symbol}</p>
      </div>
      <p className="mt-1 text-center text-lg font-light md:text-left">{text}</p>
    </div>
  );
};

export default Stats;
