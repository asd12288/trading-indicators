import Image from "next/image";
import React from "react";
import { HiArrowRight } from "react-icons/hi";
import hero from "../../public/hero.png";
import Link from "next/link";
import Stats from "../Stats";

const Hero = () => {
  return (
    <section>
      <div className="flex h-full flex-col items-center justify-center md:flex-row md:items-center md:justify-around md:p-8">
        <div className="mb-24 w-full p-2 md:p-8 lg:w-3/5">
          <p className="text-center md:text-left">⭐⭐⭐⭐⭐</p>
          <p className="mb-3 text-center font-thin md:text-left">
            More then 1000+ traders
          </p>
          <h1 className="leading-2 text-center text-4xl font-bold text-green-50 md:text-left md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Trade Smarter with Real-Time <br />
            <span className="text-green-400">Trading Signals</span>
          </h1>
          <h2 className="text-md mt-8 text-center font-light text-gray-300 md:pr-10 md:text-left lg:text-xl">
            Join our community of traders leveraging expert analysis to stay
            ahead in the Trade market
          </h2>
          <div className="mt-10 flex justify-center gap-4 md:justify-start">
            <Link href="/signup">
              <button className="rounded-full bg-green-700 px-4 py-2 transition-all hover:bg-green-700 md:px-8 md:py-3 md:font-medium lg:text-xl">
                Join us{" "}
                <span>
                  <HiArrowRight className="inline" />
                </span>
              </button>
            </Link>
            <Link href="/info">
              <button className="px-3 py-2 text-xs underline transition-all md:px-4 md:py-3 md:font-medium lg:text-xl">
                Learn more
              </button>
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-12 md:grid md:grid-cols-3 md:gap-4 lg:w-2/3 lg:justify-between lg:gap-20">
            <Stats text="Users" num="100" symbol="+" duration={3} />
            <Stats text="Signals" num="26" symbol="+" duration={2} />
            <Stats text="Win Rate" num="70" symbol="%" duration={4} />
          </div>
        </div>
        <div className="w- md:w-2/5 md:p-9">
          <Image
            className="hidden lg:block"
            src={hero}
            width={600}
            height={800}
            quality={100}
            alt="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
