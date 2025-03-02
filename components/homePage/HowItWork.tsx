import React from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import { Timeline } from "../ui/timeline";
import { time } from "console";
import { title } from "process";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

const data = [
  {
    title: "Monitoring",
    content: (
      <div className="space-y-2 md:px-24">
        <h3 className="text-xl font-semibold md:text-3xl">
          Continuous Monitoring & Analysis
        </h3>
        <p className="text-xs md:text-lg">
          Our algorithms scan the market 24/7, looking for technical patterns or
          momentum signals.
        </p>
      </div>
    ),
  },

  {
    title: "Analysis",
    content: (
      <div className="space-y-2 md:px-24">
        <h3 className="text-xl font-semibold md:text-3xl">
          Real-time data processing
        </h3>
        <p className="text-xs md:text-lg">
          Using advanced indicators and in-depth analysis, each signal is
          assessed to ensure maximum accuracy.
        </p>
      </div>
    ),
  },
  {
    title: "Alert Generation",
    content: (
      <div className="space-y-2 md:px-24">
        <h3 className="text-xl font-semibold md:text-3xl">
          Instant smart alerts{" "}
        </h3>
        <p className="text-xs md:text-lg">
          As soon as a relevant signal is detected, an alert is sent directly to
          your interface and optionally on Telegram.
        </p>
      </div>
    ),
  },
];

const HowItWork = () => {
  return (
    <div className="mt-16 md:mt-10">
      <h2 className="section-title">How It Work</h2>
      <Timeline data={data} />
    </div>
  );
};

export default HowItWork;
